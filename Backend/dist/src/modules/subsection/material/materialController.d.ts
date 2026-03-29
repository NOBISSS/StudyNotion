import { Types } from "mongoose";
export declare const isValidInstructor: (courseId: Types.ObjectId, userId: Types.ObjectId, accountType?: string) => Promise<(import("mongoose").Document<unknown, {}, {
    description: string;
    isActive: boolean;
    status: "Draft" | "Published";
    courseName: string;
    instructorName: string;
    instructorId: Types.ObjectId;
    typeOfCourse: "Free" | "Paid";
    totalDuration: number;
    totalLectures: number;
    totalMaterials: number;
    totalQuizzes: number;
    totalSubsections: number;
    totalDurationFormatted: string;
    originalPrice: number;
    discountPrice: number;
    whatYouWillLearn: string[];
    tag: string[];
    slug: string;
    categoryId: Types.ObjectId;
    level: "Beginner" | "Intermediate" | "Advance" | "Beginner-to-Advance";
    isBoosted: boolean;
    sections: Types.ObjectId[];
    coursePlan?: Types.ObjectId | null;
    thumbnailUrl?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    description: string;
    isActive: boolean;
    status: "Draft" | "Published";
    courseName: string;
    instructorName: string;
    instructorId: Types.ObjectId;
    typeOfCourse: "Free" | "Paid";
    totalDuration: number;
    totalLectures: number;
    totalMaterials: number;
    totalQuizzes: number;
    totalSubsections: number;
    totalDurationFormatted: string;
    originalPrice: number;
    discountPrice: number;
    whatYouWillLearn: string[];
    tag: string[];
    slug: string;
    categoryId: Types.ObjectId;
    level: "Beginner" | "Intermediate" | "Advance" | "Beginner-to-Advance";
    isBoosted: boolean;
    sections: Types.ObjectId[];
    coursePlan?: Types.ObjectId | null;
    thumbnailUrl?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}) | null>;
export declare const addMaterial: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getMaterial: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const deleteMaterial: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const updateMaterial: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=materialController.d.ts.map