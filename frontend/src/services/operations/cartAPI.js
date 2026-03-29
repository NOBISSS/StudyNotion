// services/operations/wishlistAPI.js
import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { cartEndPoints } from "../apis";
import { setCart, addToCart, removeFromCart, resetCart } from "../../slices/cartSlice";

const {
  GET_WISHLIST_API,
  ADD_WISHLIST_API,
  REMOVE_WISHLIST_API,
  REMOVE_ALL_WISHLIST_API,
} = cartEndPoints;

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET — fetch wishlist and sync courseIds[] into Redux
//    Response path: response.data.data.wishlist.courseIds
// ─────────────────────────────────────────────────────────────────────────────
export const getWishListData = async (token, dispatch) => {
  const toastId = toast.loading("Fetching wishlist...");
  try {
    const response = await apiConnector("GET", GET_WISHLIST_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log("GET_WISHLIST API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch wishlist");
    }

    // Extract courseIds array from nested response
    const courses = response?.data?.data?.wishlist?.courseIds ?? [];
    dispatch(setCart(courses));

  } catch (error) {
    console.error("GET_WISHLIST API ERROR:", error);
    toast.error(error.response.data.message);
  } finally {
    toast.dismiss(toastId);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ADD — add course to wishlist on server + push to Redux
//    Pass the full course object so Redux/localStorage has all fields
// ─────────────────────────────────────────────────────────────────────────────
export const addCourseToWishList = async (course, dispatch) => {
  const toastId = toast.loading("Adding to wishlist...");
  try {
    const response = await apiConnector(
      "POST",
      ADD_WISHLIST_API,
      { courseId: course },
    );

    console.log("ADD_WISHLIST API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not add to wishlist");
    }

    dispatch(addToCart(course));
    toast.success("Added to wishlist");
  } catch (error) {
    console.error("ADD_WISHLIST API ERROR:", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. REMOVE ONE — remove single course from server + Redux
// ─────────────────────────────────────────────────────────────────────────────
export const removeCourseFromWishList = async (token, courseId, dispatch) => {
  const toastId = toast.loading("Removing from wishlist...");
  try {
    const response = await apiConnector(
      "DELETE",
      REMOVE_WISHLIST_API+courseId,
      { Authorization: `Bearer ${token}` }
    );

    console.log("REMOVE_WISHLIST API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not remove from wishlist");
    }

    dispatch(removeFromCart(courseId));
    toast.success("Removed from wishlist");
  } catch (error) {
    console.error("REMOVE_WISHLIST API ERROR:", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. REMOVE ALL — clear entire wishlist on server + Redux
// ─────────────────────────────────────────────────────────────────────────────
export const removeAllCoursesFromWishList = async (token, dispatch) => {
  const toastId = toast.loading("Clearing wishlist...");
  try {
    const response = await apiConnector(
      "DELETE",
      REMOVE_ALL_WISHLIST_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    console.log("REMOVE_ALL_WISHLIST API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not clear wishlist");
    }

    dispatch(resetCart());
    toast.success("Wishlist cleared");
  } catch (error) {
    console.error("REMOVE_ALL_WISHLIST API ERROR:", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
};