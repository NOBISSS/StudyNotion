import type { Handler } from "../../shared/types.js";
export declare const createCourse: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const createCourseWithThumbnailURL: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getAllCourse: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getAllCourseByEnrollmentsAndRatings: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getAllCourseByEnrollmentsAndRatingsAndCategory: Handler;
export declare const getInstructorCourses: Handler;
export declare const deleteCourse: Handler;
export declare const updateCourse: Handler;
export declare const getCourseDetails: Handler;
export declare const getInstructorCourseDetails: Handler;
export declare const searchCourses: Handler;
export declare const publishCourse: Handler;
export declare const draftCourse: Handler;
export declare const scheduleCoursePublish: Handler;
export declare const getScheduledCourses: Handler;
export declare const getCourseProgress: Handler;
//# sourceMappingURL=courseController.d.ts.map