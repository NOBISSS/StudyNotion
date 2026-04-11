// frontend/src/services/operations/paymentAPI.js
import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { studentEndpoints } from "../apis"

const { PAYMENT_CREATE_ORDER_API, PAYMENT_VERIFY_API } = studentEndpoints

// ─── Step 1: Create Razorpay order ───────────────────────────────────────────
// POST /payment/create-order
// Returns: { orderId, amount, currency, keyId, courseName, thumbnailUrl }
export const createPaymentOrder = async (courseId) => {
  const toastId = toast.loading("Initialising payment...")
  let result = null
  try {
    const response = await apiConnector("POST", PAYMENT_CREATE_ORDER_API, { courseId })
    if (!response?.data?.success) throw new Error(response?.data?.message || "Could not create order")
    result = response.data.data
  } catch (error) {
    toast.error(error.message || "Payment initialisation failed")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// ─── Step 2: Verify payment after Razorpay success callback ──────────────────
// POST /payment/verify
// Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature, courseId }
export const verifyPayment = async (payload) => {
  const toastId = toast.loading("Verifying payment...")
  let result = null
  try {
    const response = await apiConnector("POST", PAYMENT_VERIFY_API, payload)
    if (!response?.data?.success) throw new Error(response?.data?.message || "Payment verification failed")
    result = response.data.data
  } catch (error) {
    toast.error(error.message || "Payment verification failed")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}