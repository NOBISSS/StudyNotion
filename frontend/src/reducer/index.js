import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice"
import sectionReducer from "../slices/sectionSlice"
import enrollmentReducer from "../slices/enrollmentSlice"
import catalogReducer from "../slices/catalogSlice"

const rootReducer=combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    sections:sectionReducer,
    enrollment:enrollmentReducer,
    catalog:catalogReducer
})

export default rootReducer;