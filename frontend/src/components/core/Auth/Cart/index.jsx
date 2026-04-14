// components/core/Auth/Cart/index.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";
import { getWishListData } from "../../../../services/operations/cartAPI";

export default function Cart() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  // On mount: fetch wishlist from server → sets courseIds[] into Redux
  useEffect(() => {
      getWishListData(token, dispatch);
  }, []);

  return (
    <div className="min-h-screen bg-[#161D29] text-white px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#999DAA] mb-2 flex gap-1 items-center">
        <span className="hover:text-white cursor-pointer">Home</span>
        <span>/</span>
        <span className="hover:text-white cursor-pointer">Dashboard</span>
        <span>/</span>
        <span className="text-[#FFD60A] font-medium">Wishlist</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-1">My Wishlist</h1>
      <p className="text-[#6E727F] text-sm mb-4">
        {totalItems} {totalItems === 1 ? "Course" : "Courses"} in Wishlist
      </p>

      <hr className="border-[#2C333F] mb-6" />

      {totalItems > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: course list */}
          <div className="flex-1">
            <RenderCartCourses />
          </div>
          {/* Right: total panel */}
          <div className="w-full lg:w-[280px] shrink-0">
            <RenderTotalAmount />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-[#6E727F] text-lg">Your Wishlist is Empty</p>
          <p className="text-[#999DAA] text-sm">
            Add courses to your wishlist to get started
          </p>
        </div>
      )}
    </div>
  );
}