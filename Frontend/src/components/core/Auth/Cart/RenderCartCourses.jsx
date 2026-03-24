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
    if (!cart?.length) return <h1>Nothing in Cart</h1>;
    return (
        <div>
            {
                cart.map((course, index) => (

                    <div key={course._id}>
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
                                    fullIcon={<IoStarHalfSharp />}
                                    emptyIcon={<IoStarOutline />}
                                    />
                                    <span>{course?.ratingsAndReviews?.length
    ? (course.ratingsAndReviews.reduce((sum, r) => sum + r.rating, 0) / course.ratingsAndReviews.length).toFixed(1)
    : "No ratings"} Ratings</span>
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