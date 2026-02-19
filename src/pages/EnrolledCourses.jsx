import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { ExploreMore } from '../components/core/HomePage/ExploreMore';
import { BsThreeDotsVertical } from "react-icons/bs";
const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth);
    //const [course,setCourse]=useState();
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            console.log("COURSES....", response);
            setEnrolledCourses(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fontStyle={
        title:{
            "font-weight":"Bold",
            "font-size":"2.5vw"
        },
        medium:{
            "font-weight":"300",
            "text-decoration":""
        },
        greyText:{
            "color":"#C5C7D4"
        }
    }

    useEffect(() => {
        getEnrolledCourses();
    }, [])
    return (
        <div className='text-white p-10 w-[100%] h-full'>
            <div className='text-2xl font-semibold w-full' style={fontStyle.title}>Enrolled Courses</div>
            {
                !enrolledCourses ? (<div >Loading</div>) :
                    !enrolledCourses.length ? (<p>You Have not Enrolled in any Course yet</p>) : (
                        <div >
                            <div className='w-fit'>
                            <ExploreMore element={["All","Pending","Cancelled"]}/>
                            </div>
                            <div className='border-1 border-[#2C333F]'>
                            <div className='w-[100%] justify-between flex bg-[#2C333F] p-4 rounded-md border-1 border-[#2C333F] px-30' style={fontStyle.greyText}>
                                <p className='w-1/2 '>Course Name</p> 
                                <p className='w-1/6'>Durations</p>
                                <p>Progress</p>
                            </div>
                            {/*Cards Data*/}
                            {
                                enrolledCourses.map((course, index) => (
                                    <div className='flex gap-10 p-2 items-center justify-evenly'>
                                        <div className=' flex gap-3 p-0 items-center w-1/2' style={fontStyle.greyText}>
                                            <img src={course.thumbnail} className='w-[80px] h-[70px] object-cover'/>
                                            <div>
                                                <p>{course.courseName}</p>
                                                <p className='w-1/1'>{course.courseDescription }</p>
                                            </div>
                                        </div>
                                    <div className='p-0'>
                                        <p className='text-[15px]' style={fontStyle.greyText}>{course?.totalDuration || "2hr 30 Mins"}</p>
                                    </div>
                                    <div style={fontStyle.greyText} className='flex flex-col gap-1 w-1/8'>
                                        <p className='text-[15px]'>Progress {course.progressPercentage || 0}%</p>
                                        
                                        <ProgressBar completed={course.progressPercentage || 70} className='w-full' height='8px' isLabelVisible={false}/>
                                        
                                    </div>
                                    <div style={fontStyle.greyText}>
                                        <p><BsThreeDotsVertical /></p>
                                    </div>
                                    </div>
                                ))
                            }
                        </div>
                        </div>
                    )
            }
        </div>
    )
}

export default EnrolledCourses