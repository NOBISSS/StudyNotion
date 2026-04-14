// components/core/Auth/Cart/RenderCartCourses.jsx
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-stars";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeCourseFromWishList } from "../../../../services/operations/cartAPI";

const RenderCartCourses = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  if (!cart?.length) {
    return <p className="text-[#6E727F]">Nothing in Wishlist</p>;
  }

  const handleRemove = (courseId) => {
    removeCourseFromWishList(token, courseId, dispatch);
  };

  return (
    <div className="flex flex-col">
      {cart.map((course, index) => {
        // API fields: course.originalPrice, course.discountPrice
        const displayPrice = course?.discountPrice ?? course?.price ?? 0;

        // Ratings — may not be in wishlist response; fallback to 0
        const avgRating =
          course?.ratingsAndReviews?.length
            ? (
              course.ratingsAndReviews.reduce((sum, r) => sum + r.rating, 0) /
              course.ratingsAndReviews.length
            ).toFixed(1)
            : "0";

        const reviewCount = course?.ratingsAndReviews?.length ?? 0;

        return (
          <div key={course._id}>
            <div className="flex items-start justify-between py-6 gap-4">

              {/* Left: Thumbnail + Info */}
              <div className="flex gap-4 flex-1">
                {course?.thumbnailUrl ? (
                  <img
                    src={course?.thumbnailUrl || course.thumbnail}
                    alt={course?.courseName}
                    className="w-[220px] h-[130px] object-cover rounded-lg shrink-0"
                  />
                ) : (
                  <div className="w-[220px] h-[130px] bg-[#2C333F] rounded-lg shrink-0 flex items-center justify-center">
                    <span className="text-[#6E727F] text-xs">No Image</span>
                  </div>
                )}

                <div className="flex flex-col gap-1 pt-1">
                  <p className="text-white font-semibold text-base leading-snug">
                    {course?.courseName}
                  </p>
                  <p className="text-[#999DAA] text-sm line-clamp-2 max-w-md">
                    {course?.description}
                  </p>

                  {/* Stars + Review count */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#FFD60A] text-sm font-semibold">
                      {avgRating}
                    </span>
                    <ReactStars
                      count={5}
                      value={parseFloat(avgRating)}
                      size={16}
                      edit={false}
                      color1="#2C333F"
                      color2="#FFD60A"
                    />
                    <span className="text-[#999DAA] text-sm">
                      ({reviewCount} Ratings)
                    </span>
                  </div>

                  {/* Meta */}
                  <p className="text-[#6E727F] text-xs mt-1">
                    {course?.courseContent?.length ?? "—"} Total Courses
                    &bull; Lesson &bull; Beginner
                  </p>
                </div>
              </div>

              {/* Right: Remove + Price */}
              <div className="flex flex-col items-end gap-3 shrink-0 pt-1">
                <button
                  onClick={() => handleRemove(course._id)}
                  className="flex items-center gap-2 bg-[#2C333F] hover:bg-[#3A4452] text-[#EF4444] font-medium text-sm px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <RiDeleteBin6Line size={16} />
                  <span>Remove</span>
                </button>

                {course.typeOfCourse !== "Free" && (
                  <PaymentButton
                    courseId={course._id}
                    label="Buy Now"
                    className="text-xs px-4 py-2"
                  />
                )}

                {/* Discounted price in yellow */}
                <p className="text-[#FFD60A] font-bold text-xl">
                  {displayPrice === 0
                    ? "Free"
                    : `Rs. ${displayPrice.toLocaleString("en-IN")}`}
                </p>

                {/* Original price with strikethrough if discount exists */}
                {course?.originalPrice > displayPrice && (
                  <p className="text-[#6E727F] text-sm line-through -mt-2">
                    Rs. {course.originalPrice.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            {index < cart.length - 1 && <hr className="border-[#2C333F]" />}
          </div>
        );
      })}
    </div>
  );
};

export default RenderCartCourses;