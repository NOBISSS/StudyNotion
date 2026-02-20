import { setUser } from "../slices/profileSlice.js";

export const updateUserState = (user) => (dispatch) => {
  dispatch(setUser(user));
  localStorage.setItem("user", JSON.stringify(user));
};
