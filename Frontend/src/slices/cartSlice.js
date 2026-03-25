// slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    console.error("localStorage save failed:", err);
  }
};

// ─── Recalculate totals ───────────────────────────────────────────────────────
// API returns: originalPrice & discountPrice — we use discountPrice as the actual price
const recalculate = (cart) => ({
  total: cart.reduce((sum, c) => sum + (c?.discountPrice ?? c?.price ?? 0), 0),
  originalTotal: cart.reduce((sum, c) => sum + (c?.originalPrice ?? 0), 0),
  totalItems: cart.length,
});

// ─── Initial state ────────────────────────────────────────────────────────────
const persistedCart = loadCartFromStorage();
const { total, originalTotal, totalItems } = recalculate(persistedCart);

const initialState = {
  cart: persistedCart,   // array of course objects from API (courseIds[])
  total,                 // sum of discountPrice
  originalTotal,         // sum of originalPrice (for strikethrough)
  totalItems,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // Called after GET API — sets wishlist.courseIds[] into Redux
    setCart(state, action) {
      state.cart = action.payload ?? [];
      const totals = recalculate(state.cart);
      state.total = totals.total;
      state.originalTotal = totals.originalTotal;
      state.totalItems = totals.totalItems;
      saveCartToStorage(state.cart);
    },

    // Called after ADD API — push one course, block duplicates
    addToCart(state, action) {
      const course = action.payload;
      const exists = state.cart.some((c) => c._id === course._id);
      if (exists) {
        toast.error("Course already in wishlist");
        return;
      }
      state.cart.push(course);
      const totals = recalculate(state.cart);
      state.total = totals.total;
      state.originalTotal = totals.originalTotal;
      state.totalItems = totals.totalItems;
      saveCartToStorage(state.cart);
    },

    // Called after REMOVE API — remove one course by _id
    removeFromCart(state, action) {
      const courseId = action.payload;
      state.cart = state.cart.filter((c) => c._id !== courseId);
      const totals = recalculate(state.cart);
      state.total = totals.total;
      state.originalTotal = totals.originalTotal;
      state.totalItems = totals.totalItems;
      saveCartToStorage(state.cart);
    },

    // Called after REMOVE ALL API or after payment success
    resetCart(state) {
      state.cart = [];
      state.total = 0;
      state.originalTotal = 0;
      state.totalItems = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { setCart, addToCart, removeFromCart, resetCart } =
  cartSlice.actions;

export default cartSlice.reducer;