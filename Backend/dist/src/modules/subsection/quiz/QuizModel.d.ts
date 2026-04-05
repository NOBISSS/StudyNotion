import { Schema, Types } from "mongoose";
export declare const Quiz: import("mongoose").Model<{
    isActive: boolean;
    subSectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    title: string;
    questions: Types.DocumentArray<{
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }> & {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }>;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    subSectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    title: string;
    questions: Types.DocumentArray<{
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }> & {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }>;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    subSectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    title: string;
    questions: Types.DocumentArray<{
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }> & {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }>;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isActive: boolean;
    subSectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    title: string;
    questions: Types.DocumentArray<{
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }> & {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }>;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    subSectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    title: string;
    questions: Types.DocumentArray<{
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }> & {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }>;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    isActive: boolean;
    subSectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    title: string;
    questions: Types.DocumentArray<{
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }, Types.Subdocument<import("bson").ObjectId, unknown, {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }> & {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }> & {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: unknown;
        }>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: unknown;
    }>;
    description?: string | null;
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
        isActive: boolean;
        subSectionId: Types.ObjectId;
        courseId: Types.ObjectId;
        title: string;
        questions: Types.DocumentArray<{
            options: Types.DocumentArray<{
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }, Types.Subdocument<import("bson").ObjectId, unknown, {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }> & {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }>;
            questionId: Types.ObjectId;
            question: string;
            correctAnswer: Types.ObjectId;
            points: number;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            options: Types.DocumentArray<{
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }, Types.Subdocument<import("bson").ObjectId, unknown, {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }> & {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }>;
            questionId: Types.ObjectId;
            question: string;
            correctAnswer: Types.ObjectId;
            points: number;
            _id?: unknown;
        }> & {
            options: Types.DocumentArray<{
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }, Types.Subdocument<import("bson").ObjectId, unknown, {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }> & {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }>;
            questionId: Types.ObjectId;
            question: string;
            correctAnswer: Types.ObjectId;
            points: number;
            _id?: unknown;
        }>;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        isActive: boolean;
        subSectionId: Types.ObjectId;
        courseId: Types.ObjectId;
        title: string;
        questions: Types.DocumentArray<{
            options: Types.DocumentArray<{
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }, Types.Subdocument<import("bson").ObjectId, unknown, {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }> & {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }>;
            questionId: Types.ObjectId;
            question: string;
            correctAnswer: Types.ObjectId;
            points: number;
            _id?: unknown;
        }, Types.Subdocument<import("bson").ObjectId, unknown, {
            options: Types.DocumentArray<{
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }, Types.Subdocument<import("bson").ObjectId, unknown, {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }> & {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }>;
            questionId: Types.ObjectId;
            question: string;
            correctAnswer: Types.ObjectId;
            points: number;
            _id?: unknown;
        }> & {
            options: Types.DocumentArray<{
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }, Types.Subdocument<import("bson").ObjectId, unknown, {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }> & {
                default: any[];
                optionId: Types.ObjectId;
                optionText: string;
                _id?: unknown;
            }>;
            questionId: Types.ObjectId;
            question: string;
            correctAnswer: Types.ObjectId;
            points: number;
            _id?: unknown;
        }>;
        description?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    isActive: boolean;
    subSectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    title: string;
    questions: Types.DocumentArray<{
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }> & ({
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        })>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    }, Types.Subdocument<{}, unknown, {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }> & ({
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        })>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    }> & ({
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }> & ({
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        })>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    })>;
    description?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    isActive: boolean;
    subSectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    title: string;
    questions: Types.DocumentArray<{
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }> & ({
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        })>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    }, Types.Subdocument<{}, unknown, {
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }> & ({
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        })>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    }> & ({
        options: Types.DocumentArray<{
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        }> & ({
            default: any[];
            optionId: Types.ObjectId;
            optionText: string;
            _id?: {};
        } | {
            default: any[];
            optionId: string;
            optionText: string;
            _id: {};
        })>;
        questionId: Types.ObjectId;
        question: string;
        correctAnswer: Types.ObjectId;
        points: number;
        _id?: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    } | {
        options: Types.DocumentArray<{
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }, Types.Subdocument<{}, unknown, {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }> & {
            default: any[];
            optionId: string;
            optionText: string;
            _id?: {};
        }>;
        questionId: string;
        question: string;
        correctAnswer: string;
        points: number;
        _id: {};
    })>;
    description?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=QuizModel.d.ts.map