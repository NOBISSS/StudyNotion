import { createSlice } from "@reduxjs/toolkit";

const initialState={
    signupData:null,
    loading:false,
    //token:localStorage.getItem("accessToken") ? JSON.parse(localStorage.getItem("accessToken")) : null,
    token:localStorage.getItem("accessToken") || null,
}

const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignUpData(state,value){
            console.log(value);
            state.signupData=value.payload;
        },
        setLoading(state,value){
            state.loading=value.payload
        },
        setToken(state,value){
            state.token=value.payload;
            if(value.payload){
                localStorage.setItem("accessToken",value.payload);
            }else{
                localStorage.removeItem("accessToken");
            }
                
        }
    },
});

export const {setToken,setLoading,setSignUpData} =authSlice.actions;
export default authSlice.reducer;