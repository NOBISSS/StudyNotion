import React from 'react'

import Logo1 from "../../../assets/Logo1.svg"
import Logo2 from "../../../assets/Logo2.svg"
import Logo3 from "../../../assets/Logo3.svg"
import Logo4 from "../../../assets/Logo4.svg"
import Line3 from "../../../assets/Line 3.png"
import TimeLineImage from "../../../assets/TimeLineImage.png"
const timelineData=[
    {
        logo:Logo1,
        heading:"Leadership",
        description:"Fully committed to the success company"
    },
    {
        logo:Logo2,
        heading:"Responsibility",
        description:"Students will always be our top priority"
    },
    {
        logo:Logo3,
        heading:"Flexibility",
        description:"The ability to switch is an important skills"
    },
    {
        logo:Logo4,
        heading:"Solve the problem",
        description:"Code your way to a solution"
    }
]
export const TimeLineSection = () => {
  return (
    <div>
        <div className='flex flex-row gap-15 items-center'>
            <div className="w-[45%] flex flex-col gap-1">
                {
                    timelineData.map((element,index)=>{
                        return (
                            <div key={index}>
                <div className='flex flex-row gap-6' >
                                <div className='w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center'>
                                    <img src={element.logo} alt="Logo1" />
                                </div>

                                <div>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.description}</p>
                                </div>
                                
                                </div>
                            {
                            index!=timelineData.length-1 &&
                            <div className='ml-6 mt-3'>
                                <img src={Line3} alt="" />
                            </div>
                            }
                </div>
                        )   
                    })
                }
            </div>
            <div className='relative shadow-blue-500' >
                <img src={TimeLineImage} alt="TimeLineimg"
                className='shadow-white object-cover h-fit'/>
                <div
                 className="absolute flex flex-row text-white bg-[#014A32] uppercase py-6
                 left-[50%] translate-x-[-50%] translate-y-[-50%]
                 ">
                    <div className='flex flex-row gap-5 items-center border-r border-[#037957] px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-[#05A77B] text-sm'>Years of Experience</p>
                    </div>
                    <div className='flex gap-5 items-center px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-[#05A77B] text-sm'>Types of Courses</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
