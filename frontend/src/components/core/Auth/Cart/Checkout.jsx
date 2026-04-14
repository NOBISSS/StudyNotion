// components/core/Auth/Cart/Checkout.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactStars from "react-stars";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { resetCart } from "../../../../slices/cartSlice"; // adjust path
import { enrollInCourse, enrollInWishlist } from "../../../../services/operations/enrolledCourseAPI";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, total } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.firstName
        ? `${user.firstName} ${user.lastName ?? ""}`.trim()
        : "",
      email: user?.email ?? "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const courseIds = cart.map((c) => c._id);
      dispatch(enrollInWishlist(navigate));

    } catch (err) {
      console.error("Payment failed:", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161D29] text-white px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#999DAA] mb-2 flex gap-1 items-center">
        <span
          onClick={() => navigate("/")}
          className="hover:text-white cursor-pointer transition-colors"
        >
          Home
        </span>
        <span>/</span>
        <span
          onClick={() => navigate("/dashboard/wishlist")}
          className="hover:text-white cursor-pointer transition-colors"
        >
          Wishlist
        </span>
        <span>/</span>
        <span className="text-[#FFD60A] font-medium">Checkout</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Left: Order Summary ─────────────────────────────────────── */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white mb-5">
            Order Summary
          </h2>

          <div className="flex flex-col">
            {cart.map((course, index) => {
              const displayPrice = course?.discountPrice ?? course?.price ?? 0;

              const avgRating = course?.ratingsAndReviews?.length
                ? (
                    course.ratingsAndReviews.reduce(
                      (sum, r) => sum + r.rating,
                      0,
                    ) / course.ratingsAndReviews.length
                  ).toFixed(1)
                : "0";

              const reviewCount = course?.ratingsAndReviews?.length ?? 0;

              return (
                <div key={course._id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-4">
                    {/* Thumbnail + Info */}
                    <div className="flex gap-4 flex-1">
                      {course?.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course?.courseName}
                          className="w-full sm:w-[160px] h-[180px] sm:h-[100px] object-cover rounded-lg shrink-0"
                        />
                      ) : (
                        <div className="w-[160px] h-[100px] bg-[#2C333F] rounded-lg shrink-0 flex items-center justify-center">
                          <span className="text-[#6E727F] text-xs">
                            No Image
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col gap-1 pt-1">
                        <p className="text-white font-semibold text-base leading-snug">
                          {course?.courseName}
                        </p>
                        <p className="text-[#999DAA] text-sm">
                          {course.description ?? course?.categoryId ?? ""}
                        </p>

                        {/* Stars */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#FFD60A] text-sm font-semibold">
                            {avgRating}
                          </span>
                          <ReactStars
                            count={5}
                            value={parseFloat(avgRating)}
                            size={14}
                            edit={false}
                            color1="#2C333F"
                            color2="#FFD60A"
                          />
                          <span className="text-[#999DAA] text-sm">
                            ({reviewCount} Review Count)
                          </span>
                        </div>

                        {/* Meta */}
                        <p className="text-[#6E727F] text-xs mt-1">
                          {course?.courseContent?.length ?? "—"} Total Courses
                          &bull; Lesson &bull; Beginner
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-[#FFD60A] font-bold text-xl">
                        {displayPrice === 0
                          ? "Free"
                          : `Rs. ${displayPrice.toLocaleString("en-IN")}`}
                      </p>
                      {course?.originalPrice > displayPrice && (
                        <p className="text-[#6E727F] text-sm line-through mt-1">
                          Rs. {course.originalPrice.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>

                  {index < cart.length - 1 && (
                    <hr className="border-[#2C333F]" />
                  )}
                </div>
              );
            })}

            {/* Empty cart fallback */}
            {cart.length === 0 && (
              <p className="text-[#6E727F] py-6">No courses in cart.</p>
            )}
          </div>
        </div>

        {/* ── Right: Payment Details ──────────────────────────────────── */}
        <div className="w-full lg:w-[340px] shrink-0 bg-[#1E2735] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-1">
            Payment Details
          </h2>
          <p className="text-[#6E727F] text-sm mb-6 leading-relaxed">
            Complete your purchase details items and providing your payment
            details to us.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#F1F2FF]">
                Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Full Name"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                className={`bg-[#2C333F] border outline-none text-white placeholder-[#6E727F] text-sm rounded-lg px-4 py-3 transition-colors duration-200
                  ${
                    errors.fullName
                      ? "border-[#EF4444]"
                      : "border-[#2C333F] focus:border-[#FFD60A]"
                  }`}
              />
              {errors.fullName && (
                <span className="text-[#EF4444] text-xs mt-0.5">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email ID */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#F1F2FF]">
                Email ID <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter Email ID"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`bg-[#2C333F] border outline-none text-white placeholder-[#6E727F] text-sm rounded-lg px-4 py-3 transition-colors duration-200
                  ${
                    errors.email
                      ? "border-[#EF4444]"
                      : "border-[#2C333F] focus:border-[#FFD60A]"
                  }`}
              />
              {errors.email && (
                <span className="text-[#EF4444] text-xs mt-0.5">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Total row */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2C333F]">
              <span className="text-[#F1F2FF] text-sm font-medium">Total</span>
              <span className="text-white font-semibold text-sm">
                Rs. {total?.toLocaleString("en-IN")}/-
              </span>
            </div>

            {/* Pay button */}
            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full bg-[#FFD60A] hover:bg-[#FFC800] active:scale-[0.98] text-black font-bold text-sm py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : `Pay Rs. ${total?.toLocaleString("en-IN")}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;