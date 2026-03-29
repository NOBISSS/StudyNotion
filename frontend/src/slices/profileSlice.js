import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading:false
}

const profileSlice=createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser(state,action){
            state.user=action.payload;
            if(action.payload){
            localStorage.setItem("user",action.payload);
            }else{
                localStorage.removeItem("user");
            }
        },
        setLoading(state,value){
            state.loading=value.payload
        },
        setError(state,value){
            state.error=value.payload;
        },
        setProfilePicture(state,value){
            state.user.profilePicture=value.action;
            localStorage.setItem("user", state.user);
        }
    },
});

export const {setUser,setLoading,setError,setProfilePicture} =profileSlice.actions;
export default profileSlice.reducer;