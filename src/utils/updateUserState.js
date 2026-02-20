import { setUser } from "../slices/profileSlice";

export const updateUserState=(user)=>(dispatch)=>{
    dispatch(setUser(user));
    localStorage.setItem("user",JSON.stringify(user))
}