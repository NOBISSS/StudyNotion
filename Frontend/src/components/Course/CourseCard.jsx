import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    // Use _id for navigation — CourseDetail route is /courses/:courseId
    const handleClick = () => {
        if (course?._id) navigate(`/courses/${course._id}`);
    };

    const isFree = course?.typeOfCourse === 'Free';
    const hasDiscount =
        course?.discountPrice > 0 &&
        course?.originalPrice > 0 &&
        course?.discountPrice < course?.originalPrice;

    return (
        <div
            onClick={handleClick}
            className="bg-[#161D29] border border-[#2C3244] rounded-xl overflow-hidden cursor-pointer
                       hover:border-[#FFD60A]/40 hover:shadow-[0_4px_24px_rgba(255,214,10,0.08)]
                       transition-all duration-200 flex flex-col"
        >
            {/* Thumbnail */}
            <div className="relative w-full h-[180px] bg-[#0A0F1C] flex items-center justify-center overflow-hidden">
                {course?.thumbnail || course?.thumbnailUrl ? (
                    <img
                        src={course.thumbnail || course.thumbnailUrl}
                        alt={course?.courseName || 'Course thumbnail'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                {/* Fallback — always rendered, hidden unless img errors or missing */}
                <div
                    style={{
                        display: course?.thumbnail || course?.thumbnailUrl ? 'none' : 'flex',
                    }}
                    className="absolute inset-0 items-center justify-center text-[#2C3244] text-sm select-none"
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="14" rx="2" />
                        <path d="m10 9 5 3-5 3V9z" fill="currentColor" />
                    </svg>
                </div>

                {/* Free badge overlay */}
                {isFree && (
                    <span className="absolute top-2 left-2 bg-green-500/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        Free
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="text-white font-semibold text-[15px] leading-snug line-clamp-2">
                    {course?.courseName || 'Untitled Course'}
                </h3>

                <p className="text-[#AFB2BF] text-[13px]">
                    {course?.instructorName || 'Unknown Instructor'}
                </p>

                {course?.description && (
                    <p className="text-[#6B7280] text-[12px] leading-relaxed line-clamp-2">
                        {course.description}
                    </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {course?.level && (
                        <span className="text-[11px] bg-[#0A0F1C] text-[#FFD60A] border border-[#FFD60A]/20 px-2 py-0.5 rounded-full">
                            {course.level}
                        </span>
                    )}
                    {course?.typeOfCourse && !isFree && (
                        <span className="text-[11px] bg-[#2C1A00] text-yellow-400 border border-yellow-900/40 px-2 py-0.5 rounded-full">
                            {course.typeOfCourse}
                        </span>
                    )}
                </div>

                {/* Spacer pushes price to bottom */}
                <div className="flex-1" />

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-[#2C3244]">
                    {isFree ? (
                        <span className="text-green-400 font-bold text-[15px]">Free</span>
                    ) : (
                        <>
                            <span className="text-white font-bold text-[16px]">
                                ₹{(course?.discountPrice || course?.originalPrice || 0).toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-[#6B7280] line-through text-[13px]">
                                    ₹{course.originalPrice.toLocaleString()}
                                </span>
                            )}
                            {hasDiscount && (
                                <span className="text-green-400 text-[12px] font-medium ml-auto">
                                    {Math.round(((course.originalPrice - course.discountPrice) / course.originalPrice) * 100)}% off
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;