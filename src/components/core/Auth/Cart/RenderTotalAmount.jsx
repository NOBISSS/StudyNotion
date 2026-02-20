import React from 'react'
import { useSelector } from 'react-redux'
import { IconBtn } from '../../../common/IconBtn';

const RenderTotalAmount = () => {
    const {total,cart}=useSelector((state)=>state.cart);
    
     const handleBuyCourse=()=>{
            const course=cart.map((course)=>course._id);
            console.log("Bought These Course",course);
            //TODO:API INTEGRATE => PAYMENT API
     }
  return (
    
    <div>
        <p>Total:</p>
        <p>Rs {total}</p>
        <IconBtn text={"Buy Now"} active={1} onClick={handleBuyCourse} customClasses={"w-full justify-center"}/>
    </div>
  )
}

export default RenderTotalAmount