// components/core/Auth/Cart/RenderTotalAmount.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RenderTotalAmount = () => {
  const navigate = useNavigate();
  const { total, originalTotal, cart } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);

  const handleBuyNow = () => {
    setLoading(true);
    // Cart data is already in Redux — Checkout page reads from there
    navigate("/dashboard/checkout");
    setLoading(false);
  };

  return (
    <div className="bg-[#1E2735] rounded-xl p-4 sm:p-6 flex flex-col gap-4">
      <div>
        <p className="text-[#999DAA] text-sm font-medium mb-1">Total:</p>

        {/* Discounted total */}
        <p className="text-[#FFD60A] text-3xl font-bold">
          Rs. {total?.toLocaleString("en-IN")}
        </p>

        {/* Original total with strikethrough — only if there's actually a discount */}
        {originalTotal > total && (
          <p className="text-[#6E727F] text-sm line-through mt-1">
            Rs. {originalTotal?.toLocaleString("en-IN")}
          </p>
        )}
      </div>

      <button
        disabled={loading || cart.length === 0}
        onClick={handleBuyNow}
        className="w-full bg-[#FFD60A] hover:bg-[#FFC800] active:scale-[0.98] text-black font-bold text-sm py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
};

export default RenderTotalAmount;