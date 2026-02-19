import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import ReactStars from 'react-stars';
import { IoStarOutline } from "react-icons/io5";
import { IoStarHalfSharp } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { removeFromCart } from '../../../../slices/cartSlice';
const RenderCartCourses = () => {
    const dispatch=useDispatch();
    const { cart } = useSelector((state) => state.cart);
    return (
        <div>
            {
                cart.map((course, index) => (
                    <div>
                        <div>
                            <img src={course?.thumbnail} />
                            <div>
                                <p>{course?.courseName}</p>
                                <p>{course?.category?.name}</p>
                                <div>
                                    <span>4.8</span>
                                    <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<IoStarHalfSharp />}
                                    fullIcon={<IoStarOutline />}
                                    />
                                    <span>{course?.ratingsAndReviews?.length} Ratings</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={()=>dispatch(removeFromCart(course._id))}>
                            <RiDeleteBinLine />
                            <span>Remove</span>
                            </button>
                            <p>Rs. {course?.price}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default RenderCartCourses