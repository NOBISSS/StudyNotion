//Flow:
//      1.Flip course status->Published
//      2.Fetch all Students who wishlisted this course
//      3.Enqueue one email per student(Resuing emailQueue)

import { email } from "zod";
import { Course } from "../../modules/course/CourseModel.js";
import User from "../../modules/user/UserModel.js";
import Wishlist from "../../modules/wishlist/wishlistModel.js";
import { emailQueue } from "../queue/emailQueue.js";
import { scheduleQueue,type SchedulePublishPayload } from "../queue/scheduleQueue.js";
import { coursePublishedTemplate } from "../templates/coursePublishedTemplate.js";
import type {Job} from "bull"


// Flow- (1)
scheduleQueue.process(async (job:Job<SchedulePublishPayload>)=>{
    const {courseId,courseName}=job.data

    //publish course
    const course=await Course.findByIdAndUpdate(
        courseId,
        {
            status:"Published",
            isScheduled:false,
            scheduledPublishAt:null,
            scheduledJobId:null
        },
        {new:true}
    )

    if(!course){
        console.warn(`[scheduledWorker] Course $[courseId] not found. Skipping`)
        return 
    }

    //Flow (2)
    const wishlists=await Wishlist.find({courseIds:courseId,status:"active"}).select("userId").lean()

    if(wishlists.length===0) return

    const userIds=wishlists.map((w)=>w.userId)
    const users=await User.find({_id:{$in:userIds}}).select("email firstName").lean()

    //Flow - (3) 
    // //email Enquee
    const emailJobs=users.map((user)=>
        emailQueue.add({
            to:user.email,
            subject:`"${courseName}" is now live on StudyNotion!`,
            html:coursePublishedTemplate({
                firstName:user.firstName,
                courseName,
                courseUrl:`${process.env.FRONTEND_URL}/courses/${courseId}`,
                thumbnailUrl:course.thumbnailUrl,
            }),
        })
    )


    await Promise.allSettled(emailJobs)

    console.log(`[scheduleWorker] Published course "${courseName}" (${courseId})` + `Notified ${users.length} wishlisted students`)

})

//error handlers
scheduleQueue.on("failed",(job,err)=>{
    console.error(
        `[scheduleWorker] Job ${job.id} failed for course ${job.data.courseId}`,err.message
    )
})

scheduleQueue.on("completed",(job)=>{
    console.log(
        `[scheduleWorker Job ${job.id} completed -- course ${job.data.courseId} published]`
    )
})


