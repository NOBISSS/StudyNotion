import type { UploadApiResponse } from "cloudinary";
import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { embeddingQueue } from "../../shared/queue/embeddingQueue.js";
import type { Handler } from "../../shared/types.js";
import { uploadToCloudinary } from "../../shared/utils/cloudinaryUpload.js";
import { vectorSearchCourses } from "../../shared/vector/searchCourses.js";
import { Category } from "../category/CategoryModel.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";
import { Section } from "../section/SectionModel.js";
import { SubSection } from "../subsection/SubSectionModel.js";
import { Material } from "../subsection/material/MaterialModel.js";
import { Quiz } from "../subsection/quiz/QuizModel.js";
import Video from "../subsection/video/VideoModel.js";
import User from "../user/UserModel.js";
import { Course } from "./CourseModel.js";
import { courseInputSchema } from "./courseValidation.js";
import { filterCoursesByAI } from "../../shared/utils/AISearchFilteration.js";
import { isValidInstructor } from "../subsection/material/materialController.js";
import { schedulePublish, cancelScheduledPublish, reschedulePublish } from "../../shared/queue/scheduleQueue.js";

export const createCourse = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if (typeof req.body.tag === "string") {
    req.body.tag = JSON.parse(req.body.tag);
  }

  if (typeof req.body.instructions === "string") {
    req.body.instructions = JSON.parse(req.body.instructions);
  }
  const parsedCourseData = courseInputSchema.safeParse(req.body);
  if (!parsedCourseData.success) {
    throw AppError.badRequest(
      parsedCourseData.error.issues[0]?.message || "Invalid course data",
    );
  }

    const { scheduledPublishAt } = parsedCourseData.data;
  const publishAt = scheduledPublishAt ? new Date(scheduledPublishAt) : null;

  if(publishAt && isNaN(publishAt.getTime())){
    throw AppError.badRequest("Invalid scheduledPublishAt Date");
  }

  const thumbnail = req.file;
  if (!thumbnail) {
    throw AppError.badRequest("Thumbnail image is required");
  }
  let thumbnailImage: UploadApiResponse | null = null;
  try {
    thumbnailImage = await uploadToCloudinary(
      thumbnail.buffer,
      "StudyNotion/Thumbnails",
    );
    if (!thumbnailImage) {
      throw AppError.internal("Failed to upload thumbnail image");
    }
  } catch (err) {
    throw AppError.internal(
      "Something went wrong from our side while uploading the thumbnail image",
    );
  }
  const instructorId =
    req.accountType === "instructor"
      ? userId
      : new Types.ObjectId(parsedCourseData.data.instructorId);
  if (!instructorId) {
    throw AppError.badRequest("Instructor ID is required for course creation");
  }
  const instructor = await User.findById(instructorId);
  if (!instructor) {
    throw AppError.notFound("Instructor not found");
  }
  const {
    category: categoryId,
    courseName,
    courseDescription: description,
    coursePlan,
    price,
    level,
    tag,
    whatYouWillLearn,
    instructions,
  } = parsedCourseData.data;
  let typeOfCourse = "Paid";
  if (price === "0") {
    typeOfCourse = "Free";
  }
  const course = await Course.create({
    courseName,
    description,
    instructorId: new Types.ObjectId(instructorId),
    instructorName: `${instructor?.firstName} ${instructor?.lastName}`,
    categoryId,
    typeOfCourse,
    coursePlan: coursePlan ? new Types.ObjectId(coursePlan) : null,
    originalPrice: Number(price) || 0,
    level,
    tag: tag || [],
    thumbnailUrl: thumbnailImage.secure_url,
    slug: `${instructor?.firstName} ${instructor?.lastName}/${courseName}`,
    whatYouWillLearn: [whatYouWillLearn || ""],
    instructions: instructions || [],
  });
  await Category.findByIdAndUpdate(categoryId, {
    $push: { courses: course._id },
  });
  // await Section.create({
  //   name: "Introduction",
  //   courseId: course._id,
  //   order: 1,
  //   subSectionIds: [],
  // });
  let job = null;

  if (publishAt) {
    job = await schedulePublish(
      {
        courseId: course._id,
        instructorId: new Types.ObjectId(instructorId),
        courseName: course.courseName,
        scheduledAt: new Date().toISOString(),
      },
      publishAt
    );

    course.scheduledPublishAt = publishAt;
    course.isScheduled = true;
    course.scheduledJobId = job.id || null;

    await course.save();
  }
  await embeddingQueue.add(
    "embed-course",
    { course: course.toObject() },
  );
    ApiResponse.created(res, { course }, "Course created successfully");
  });

export const createCourseWithThumbnailURL = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const parsedCourseData = courseInputSchema.safeParse(req.body);

  if (!parsedCourseData.success) {
    throw AppError.badRequest(
      parsedCourseData.error.issues[0]?.message || "Invalid course data",
    );
  }
  const instructorId =
    req.accountType === "instructor"
      ? new Types.ObjectId(userId)
      : new Types.ObjectId(parsedCourseData.data.instructorId);
  if (!instructorId) {
    throw AppError.badRequest("Instructor ID is required for course creation");
  }
  const instructor = await User.findById(instructorId);
  if (!instructor) {
    throw AppError.notFound("Instructor not found");
  }
  const {
    category: categoryId,
    courseName,
    courseDescription: description,
    coursePlan,
    price,
    level,
    tag,
    thumbnailImage: thumbnailUrl,
    whatYouWillLearn,
    instructions,
  } = parsedCourseData.data;
  if (!thumbnailUrl) {
    throw AppError.badRequest("Thumbnail URL is required for course creation");
  }
  let typeOfCourse = "Paid";
  if (price === "0") {
    typeOfCourse = "Free";
  }
  const course = await Course.create({
    courseName,
    description,
    instructorId: new Types.ObjectId(instructorId),
    instructorName: `${instructor?.firstName} ${instructor?.lastName}`,
    categoryId,
    typeOfCourse,
    coursePlan: coursePlan ? new Types.ObjectId(coursePlan) : null,
    originalPrice: Number(price) || 0,
    level,
    tag: tag || [],
    thumbnailUrl,
    slug:
      courseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now()}`,
    whatYouWillLearn: [whatYouWillLearn || ""],
    instructions: instructions || [],
  });
  await Category.findByIdAndUpdate(categoryId, {
    $push: { courses: course._id },
  });
  // await Section.create({
  //   name: "Introduction",
  //   courseId: course._id,
  //   order: 1,
  //   subSectionIds: [],
  // });

  ApiResponse.created(res, { course }, "Course created successfully");
await embeddingQueue.add(
  "embed-course",
  { course: course.toObject() },
  { attempts: 3, backoff: { type: "exponential", delay: 5000 } },
);
});
export const getAllCourse = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true, status: "Published" }).populate(
    "categoryId",
    "name",
  );
  ApiResponse.success(
    res,
    {
      courses,
    },
    "Courses retrieved successfully",
  );
});
export const getAllCourseByEnrollmentsAndRatings = asyncHandler(
  async (req, res) => {
    const userId = req.userId;
    const courses = await Course.find({ isActive: true, status: "Published" }).populate(
      "categoryId",
      "name",
    );
    const coursesWithEnrollmentCount = await Promise.all(
      courses.map(async (c) => ({
        ...c.toObject(),
        enrollmentsCount: await CourseEnrollment.countDocuments({
          courseId: c._id,
        }),
        ratingsAverage: await RatingAndReview.aggregate([
          { $match: { courseId: c._id } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
            },
          },
          { $project: { _id: 0, averageRating: 1 } },
        ]).then((result) => Number(result[0]?.averageRating) || 0),
        isEnrolled: (await CourseEnrollment.exists({
          courseId: c._id,
          userId: new Types.ObjectId(userId),
        }))
          ? true
          : false,
      })),
    );
    const sortedCourses = coursesWithEnrollmentCount.slice().sort((a, b) => {
      if (b.enrollmentsCount === a.enrollmentsCount) {
        return b.ratingsAverage - a.ratingsAverage;
      }
      return b.enrollmentsCount - a.enrollmentsCount;
    });
    ApiResponse.success(
      res,
      {
        courses,
        sortedCourses,
      },
      "Courses retrieved successfully",
    );
  },
);
export const getAllCourseByEnrollmentsAndRatingsAndCategory: Handler =
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const categoryId = req.params.categoryId;
    if(!categoryId){
      throw AppError.badRequest("Invalid category ID")
    }
    const courses = await Course.find({
      categoryId: new Types.ObjectId(categoryId as string),
      isActive: true,
      status: "Published",
    }).populate("categoryId", "name");
    const coursesWithEnrollmentCount = await Promise.all(
      courses.map(async (c) => ({
        ...c.toObject(),
        enrollmentsCount: await CourseEnrollment.countDocuments({
          courseId: c._id,
        }),
        ratingsAverage: await RatingAndReview.aggregate([
          { $match: { courseId: c._id } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
            },
          },
          { $project: { _id: 0, averageRating: 1 } },
        ]).then((result) => Number(result[0]?.averageRating) || 0),
        isEnrolled: (await CourseEnrollment.exists({
          courseId: c._id,
          userId: new Types.ObjectId(userId),
        }))
          ? true
          : false,
      })),
    );
    const sortedCourses = coursesWithEnrollmentCount.slice().sort((a, b) => {
      if (b.enrollmentsCount === a.enrollmentsCount) {
        return b.ratingsAverage - a.ratingsAverage;
      }
      return b.enrollmentsCount - a.enrollmentsCount;
    });
    ApiResponse.success(
      res,
      {
        courses,
        sortedCourses,
      },
      "Courses retrieved successfully",
    );
  });
export const getInstructorCourses: Handler = asyncHandler(async (req, res) => {
  const instructorId = req.userId;
  if (!instructorId) {
    throw AppError.unauthorized("Instructor ID is required");
  }
  const courses = await Course.find({ instructorId, isActive: true }).populate("categoryId", "name").sort({ createdAt: -1 });
  ApiResponse.success(res, { courses }, "Instructor courses retrieved successfully");
});
export const deleteCourse: Handler = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  if (!courseId) {
    throw AppError.badRequest("Invalid course ID");
  }
  const userId = req.userId;
  const course = await Course.findById(courseId);
  if (!userId)
    throw AppError.unauthorized("User ID is required to delete the course");
  if (!course) {
    throw AppError.notFound("Course not found");
  }
  if (course.instructorId.toString() != userId.toString() && req.accountType !== "admin") {
    throw AppError.unauthorized("You are not authorized to delete this course");
  }
  course.isActive = false;
  await course.save({ validateBeforeSave: false });
  await RatingAndReview.updateMany(
    { courseId: new Types.ObjectId(courseId as string) },
    { isActive: false },
  );
  await CourseEnrollment.updateMany(
    { courseId: new Types.ObjectId(courseId as string) },
    { isActive: false },
  );
  await Section.updateMany(
    { courseId: new Types.ObjectId(courseId as string) },
    { isRemoved: true },
  );
  await Category.findByIdAndUpdate(course.categoryId, {
    $pull: { courses: course._id },
  });
  await SubSection.updateMany(
    { courseId: new Types.ObjectId(courseId as string) },
    { isActive: false },
  );
  await Material.updateMany(
    { courseId: new Types.ObjectId(courseId as string) },
    { isActive: false },
  );
  await Quiz.updateMany(
    { courseId: new Types.ObjectId(courseId as string) },
    { isActive: false },
  );
  await Video.updateMany(
    { courseId: new Types.ObjectId(courseId as string) },
    { isActive: false },
  );
  ApiResponse.success(res, {}, "Course deleted successfully");
});
export const updateCourse: Handler = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  if (courseId && !Types.ObjectId.isValid(courseId as string)) {
    throw AppError.badRequest("Invalid course ID");
  }
  const userId = req.userId;
  if (!userId)
    throw AppError.unauthorized("User ID is required to update the course");
  const parsedCourseData = courseInputSchema.safeParse(req.body);
  if (!parsedCourseData.success) {
    throw AppError.badRequest(
      parsedCourseData.error.issues[0]?.message || "Invalid course data",
    );
  }
  const {
    courseName,
    courseDescription: description,
    coursePlan,
    price,
    level,
    tag,
    instructions,
    whatYouWillLearn,
    category: categoryId,
  } = parsedCourseData.data;
  let typeOfCourse = "Paid";
  if (price == "0") {
    typeOfCourse = "Free";
  }
  const course = await Course.findOne({
    _id: new Types.ObjectId(courseId as string),
    isActive: true,
  });
  if (!course) {
    throw AppError.notFound("Course not found");
  }
  if (
    course.instructorId.toString() !== userId.toString() &&
    req.accountType !== "admin"
  ) {
    throw AppError.unauthorized("You are not authorized to update this course");
  }
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      courseName,
      description,
      typeOfCourse,
      coursePlan: coursePlan ? new Types.ObjectId(coursePlan) : null,
      originalPrice: price || 0,
      level,
      tag: tag || [],
      instructions: instructions || [],
      whatYouWillLearn: [whatYouWillLearn || ""],
      categoryId: categoryId ? new Types.ObjectId(categoryId) : null,
    },
    { returnDocument: "after", runValidators: true },
  );
  ApiResponse.success(
    res,
    { course: updatedCourse },
    "Course updated successfully",
  );
});
export const getCourseDetails: Handler = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req;

  if (!courseId) {
    throw AppError.badRequest("Invalid course ID");
  }

  const courseObjectId = new Types.ObjectId(courseId as string);

  const course = await Course.findOne({
    _id: courseObjectId,
    isActive: true,
    status: "Published",
  }).populate("categoryId", "name");

  if (!course) {
    throw AppError.notFound("Course not found");
  }

  const sections = await Section.find({
    courseId: courseObjectId,
    isRemoved: false,
  });

  const enrollmentsCount = await CourseEnrollment.countDocuments({
    courseId: courseObjectId,
  });

  const reviews = await RatingAndReview.find({
    courseId: courseObjectId,
    isActive: true,
  }).populate("userId", "firstName lastName profilePicture");

  let isUserEnrolled = false;

  if (userId && Types.ObjectId.isValid(userId)) {
    const enrollment = await CourseEnrollment.findOne({
      courseId: courseObjectId,
      userId: new Types.ObjectId(userId),
    });
    isUserEnrolled = !!enrollment;
  }

  ApiResponse.success(
    res,
    {
      course,
      sections,
      enrollmentsCount,
      reviews,
      isUserEnrolled,
    },
    "Course details retrieved successfully",
  );
});
export const getInstructorCourseDetails: Handler = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req;
  if (!userId)
    throw AppError.unauthorized("User ID is required to get course details");
  if (!courseId) {
    throw AppError.badRequest("Invalid course ID");
  }

  const courseObjectId = new Types.ObjectId(courseId as string);

  const course = await Course.findOne({
    _id: courseObjectId,
    isActive: true,
    instructorId: userId,
  }).populate("categoryId", "name");

  if (!course) {
    throw AppError.notFound("Course not found");
  }

  ApiResponse.success(
    res,
    {
      course,
    },
    "Course details retrieved successfully",
  );
});
export const searchCourses: Handler = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    throw AppError.badRequest("Search query is required");
  }
  const vecotorSearchResults = await vectorSearchCourses(query);
  const courses = await Course.find({
    _id: { $in: vecotorSearchResults.map((result) => result.courseId) },
    isActive: true,
  }).populate("categoryId", "name");
  const reviews = await RatingAndReview.find({
    courseId: { $in: courses.map((course) => course._id) },
    isActive: true,
  });
  const coursesWithRatingsAndScores = courses.map((course) => {
    const courseReviews = reviews.filter(
      (review) => review.courseId.toString() === course._id.toString(),
    );
    const averageRating =
      courseReviews.reduce((sum, review) => sum + review.rating, 0) / courseReviews.length || 0;
    const vectorSearchResult = vecotorSearchResults.find(
      (result) => result.courseId.toString() === course._id.toString(),
    );
    return {
      ...course.toObject(),
      averageRating,
      vectorScore: vectorSearchResult ? vectorSearchResult.score : 0,
    };
  });
  const AIFilteredCourses = await filterCoursesByAI(coursesWithRatingsAndScores, query);
  ApiResponse.success(
    res,
    {
      courses: coursesWithRatingsAndScores.sort((a, b) => b.vectorScore - a.vectorScore),
      AIFilteredCourses: coursesWithRatingsAndScores.filter((course) =>
        AIFilteredCourses.some(
          (filtered) => filtered.courseId.toString() === course._id.toString(),
        ),
      ),

    },
    "Search results retrieved successfully",
  );
});
export const publishCourse: Handler = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.userId;
  if (!courseId || !userId) {
    throw AppError.badRequest("Invalid course ID or user ID");
  }
  const oldcourse = await Course.findOne({
    _id: new Types.ObjectId(courseId as string),
    isActive: true,
  });
  if (!oldcourse) {
    throw AppError.notFound("Course not found");
  }
  const instuctorValid = await isValidInstructor(new Types.ObjectId(courseId as string), new Types.ObjectId(userId));
  if (!instuctorValid) {
    throw AppError.forbidden("You are not the instructor of this course");
  }
  const course = await Course.findByIdAndUpdate(courseId as string, { status: "Published" }, { returnDocument: "after" });
  ApiResponse.success(
    res,
    { course },
    "Course published successfully",
  );

});
export const draftCourse: Handler = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.userId;
  if (!courseId || !userId) {
    throw AppError.badRequest("Invalid course ID or user ID");
  }
  const oldcourse = await Course.findOne({
    _id: new Types.ObjectId(courseId as string),
    isActive: true,
  });
  if (!oldcourse) {
    throw AppError.notFound("Course not found");
  }
  const instuctorValid = await isValidInstructor(new Types.ObjectId(courseId as string), new Types.ObjectId(userId));
  if (!instuctorValid) {
    throw AppError.forbidden("You are not the instructor of this course");
  }
  const course = await Course.findByIdAndUpdate(courseId as string, { status: "Draft" }, { returnDocument: "after" });
  ApiResponse.success(
    res,
    { course },
    "Course drafted successfully",
  );

});


export const scheduleCoursePublish: Handler = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;
  const { scheduledPublishAt } = req.body;
  if (!courseId || !userId) {
    throw AppError.badRequest("Course ID and User ID are required");
  }
  if (!Types.ObjectId.isValid(courseId as string)) {
    throw AppError.badRequest("Invalid course ID")
  }

  const course = await Course.findOne({ _id: courseId as string, isActive: true })
  if (!course) throw AppError.notFound("Course not Found")


  if (course.instructorId.toString() !== userId.toString()) {
    throw AppError.unauthorized("Not Authorized to Schedule this course")
  }

  //cancel existing schedule
  if (!scheduledPublishAt) {
    if (course.scheduledJobId) {
      await cancelScheduledPublish(course.scheduledJobId)
    }

    await Course.findByIdAndUpdate(courseId, {
      isScheduled: false,
      scheduledPublishAt: null,
      scheduledJobId: null
    })

    return ApiResponse.success(res, {}, "Scheduled publish cancelled")
  }

  //Validate the Date

  const publishAt = new Date(scheduledPublishAt)
  if (isNaN(publishAt.getTime())) {
    throw AppError.badRequest("Invalid Date Format For ScheduledPublishAt")
  }

  if (publishAt <= new Date()) {
    throw AppError.badRequest("scheduledPublishAt must be a future date")
  }


  //enqueu 
  const job = await reschedulePublish(
    course.scheduledJobId ?? undefined,
    {
      courseId: course._id,
      instructorId: userId,
      courseName: course.courseName,
      scheduledAt: publishAt.toISOString(),
    },
    publishAt
  )


  await Course.findByIdAndUpdate(courseId, {
    isScheduled: true,
    scheduledPublishAt: publishAt,
    scheduledJobId: String(job.id),
    status: "Draft",
  })

  ApiResponse.success(
    res,
    {
      scheduledPublishAt: publishAt,
      jobId: job.id,
    },
    `Course Scheduled To Publish On ${publishAt.toUTCString()}`
  )
})

export const getScheduledCourses: Handler = asyncHandler(async (req, res) => {
  const instructorId = req.userId

  if (!instructorId) {
    throw AppError.unauthorized("Instructor ID is required")
  }
  const courses = await Course.find({
    instructorId,
    isScheduled: true,
    isActive: true
  })
    .select("courseName thumbnailUrl scheduledPublishat scheduleJobId level")
    .sort({ scheduledPublishAt: 1 })
    .lean()

  ApiResponse.success(
    res,
    { courses },
    "Scheduled Courses retrived successfully"
  )
});