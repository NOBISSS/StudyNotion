import { createSlice } from "@reduxjs/toolkit";

const initialState={
    signupData:null,
    loading:false,
    isOTPVerified:false,
    //token:localStorage.getItem("accessToken") ? JSON.parse(localStorage.getItem("accessToken")) : null,
    token:localStorage.getItem("accessToken") || null,
}

const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignUpData(state,value){
            state.signupData=value.payload;
        },
        setLoading(state,value){
            state.loading=value.payload
        },
        setOTPVerified(state,value){
            state.isOTPVerified=value.payload
        },
        setToken(state,value){
            state.token=value.payload
            if(value.payload){
                state.token=value.payload;
                localStorage.setItem("accessToken",JSON.stringify(value.payload));
            }else{
                localStorage.removeItem("accessToken");
            }
                
        }
    },
});

export const {setToken,setLoading,setSignUpData,setOTPVerified} =authSlice.actions;
export default authSlice.reducer;