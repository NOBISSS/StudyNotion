import { createSlice } from "@reduxjs/toolkit";

const enrollSlice=createSlice({
    name:"enroll",
    initialState:{
        enrolledCourses:null,
    },
    reducers:{
        setEnrolledCourse(state,action){
                state.enrolledCourses=action.payload;
        }
    }
});
export const {setEnrolledCourse}=enrollSlice.actions;

export default enrollSlice.reducer;