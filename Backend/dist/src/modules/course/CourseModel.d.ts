import { Schema, Types } from "mongoose";
export declare const Course: import("mongoose").Model<{
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
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
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
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
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
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
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
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
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
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
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
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
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
    }> | undefined;
}, {
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
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
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
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=CourseModel.d.ts.map