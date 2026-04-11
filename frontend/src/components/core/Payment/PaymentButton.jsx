// frontend/src/components/core/Payment/PaymentButton.jsx
//
// Drop-in "Buy Now" button — use this anywhere (CourseDetail, Wishlist, etc.)
// Just pass courseId and optionally a label/style override.
//
// Usage:
//   <PaymentButton courseId={courseId} />
//   <PaymentButton courseId={courseId} label="Enroll Now" fullWidth />

import { useRazorpay } from "../../../hooks/UseRazorpay"

const PaymentButton = ({
  courseId,
  label = "Buy Now",
  fullWidth = false,
  className = "",
}) => {
  const { initiatePayment, paying } = useRazorpay()

  return (
    <button
      onClick={() => initiatePayment(courseId)}
      disabled={paying}
      className={`
        flex items-center justify-center gap-2
        bg-[#FFD60A] hover:bg-yellow-300
        text-black font-bold text-sm
        px-6 py-3 rounded-lg
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {paying ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
          Processing...
        </>
      ) : label}
    </button>
  )
}

export default PaymentButton