import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast";

const initialState={
    cart:localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    total:localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0,
    totalItems:localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
}

const cartSlice=createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        addToCart:(state,action)=>{
            const course=action.payload
            const index=state.cart.findIndex((item)=>item._id===course._id)
            if(index>=0){
                //If the Course is already in the cart,do not modify the quantity
                toast.error("Course Already in Cart");
                return
            }
            //if the course is not in the cart then add it to cart
            state.cart.push(course);
            //update the total quantity and price
            state.totalItems++;
            state.toatal+=course.price;
            //update to localStorage
            localStorage.setItem("cart",JSON.stringify(state.cart));
            localStorage.setItem("total",JSON.stringify(state.total))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))

            //show toast
            toast.success("Course Added to Cart");
        },
        removeFromCart:(state,action)=>{
            const courseId=action.payload;
            const index=state.cart.findIndex((item)=>item._id === courseId);
            if(index>=0){
                //if the course is found in the cart,remove it
                state.totalItems--;
                state.total-=state.cart[index].price
                state.cart.splice(index,1);
                //update to localStorage
                localStorage.setItem("cart",JSON.stringify(state.cart));
            localStorage.setItem("total",JSON.stringify(state.total))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))
            toast.success("Course Removed from the Cart successfully");
            }else{
                toast.error("Course is already removed from the Cart");
            }
            
        },
        setTotalItems(state,value){
            state.token=value.payload;
        },
        setLoading(state,value){
            state.loading=value.payload
        },
        setAddToCart(state,value){
            state.addToCart=value.payload
        },
        //H.W FUNCTIONS: ADD TO CART, REMOVE FROM CART, RESET CART
    },
});

export const {setTotalItems,setLoading,removeFromCart,addToCart} =cartSlice.actions;
export default cartSlice.reducer;
