// frontend/src/hooks/useRazorpay.js
//
// Custom hook that:
//   1. Dynamically loads the Razorpay checkout.js SDK
//   2. Calls backend to create an order
//   3. Opens Razorpay payment modal
//   4. On success → calls backend verify endpoint → enroll
//   5. Returns { initiatePayment, paying }

import { useState, useCallback } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { createPaymentOrder, verifyPayment } from "../services/operations/PaymentAPI"

// Loads Razorpay SDK script once and resolves when ready
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

export const useRazorpay = () => {
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)

  const initiatePayment = useCallback(async (courseId) => {
    if (!token) { navigate("/login"); return }

    setPaying(true)

    // ── Load Razorpay SDK ──────────────────────────────────────────────────
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      toast.error("Failed to load payment gateway. Check your internet connection.")
      setPaying(false)
      return
    }

    // ── Step 1: Create order on backend ───────────────────────────────────
    const orderData = await createPaymentOrder(courseId)
    if (!orderData) { setPaying(false); return }

    const { orderId, amount, currency, keyId, courseName, thumbnailUrl } = orderData

    // ── Step 2: Open Razorpay modal ────────────────────────────────────────
    const options = {
      key:         keyId,
      amount,
      currency,
      name:        "StudyNotion",
      description: courseName,
      image:       thumbnailUrl || "/favicon.ico",
      order_id:    orderId,

      // Prefill student details from Redux profile
      prefill: {
        name:    `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        email:   user?.email || "",
        contact: user?.additionalDetails?.contactNumber || "",
      },

      // Razorpay theme
      theme: { color: "#FFD60A" },

      // ── SUCCESS HANDLER ──────────────────────────────────────────────────
      handler: async (response) => {
        // response = { razorpay_order_id, razorpay_payment_id, razorpay_signature }
        const result = await verifyPayment({
          razorpayOrderId:   response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          courseId,
        })

        setPaying(false)

        if (result?.enrolled) {
          toast.success("Payment successful! You're now enrolled. 🎉")
          // Navigate to the course learn page
          navigate(`/courses/${courseId}/learn`)
        }
      },

      // ── MODAL CLOSE (user dismissed without paying) ──────────────────────
      modal: {
        ondismiss: () => {
          setPaying(false)
          toast("Payment cancelled.", { icon: "ℹ️" })
        },
      },
    }

    const rzp = new window.Razorpay(options)

    // Handle payment failure (insufficient funds, card declined, etc.)
    rzp.on("payment.failed", (response) => {
      setPaying(false)
      toast.error(
        response.error?.description || "Payment failed. Please try again."
      )
    })

    rzp.open()
  }, [token, user, navigate])

  return { initiatePayment, paying }
}