import { createSlice } from "@reduxjs/toolkit";

const initialState={
    signupData:null,
    loading:false,
    //token:localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    token:localStorage.getItem("token") || null,
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
                localStorage.setItem("token",value.payload);
            }else{
                localStorage.removeItem("token");
            }
                
        }
    },
});

export const {setToken,setLoading,setSignUpData} =authSlice.actions;
export default authSlice.reducer;