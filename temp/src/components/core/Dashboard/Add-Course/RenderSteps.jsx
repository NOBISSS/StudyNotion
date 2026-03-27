import React from 'react'
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import CourseInformationForm from './CourseInformationForm';
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm';

const RenderSteps = () => {
    const {step}=useSelector((state)=>state.course);
    console.log("CURRENT STEP::",step)
    const steps=[
        {
            id:1,
            title:"Course Information"
        },
        {
            id:2,
            title:"Course Builder"
        },
        {
            id:3,
            title:"Publish"
        },
]
    
  return (
    <>
    <div className='text-white w-[100%]'>
        {
            steps.map((item,index)=>(
                
                <div key={index}>
                    <div className='bg-amber-200 w-fit'>
                        <div className={`${step===item.id ? "bg-yellow-900 border-yellow-50 text-yellow-50" : "border-[#000917] bg-[#000998] text-white"}`}>
                        {
                            step > item.id ? (<FaCheck/>) : (item.id)
                        }
                        </div>
                    </div>
                    {
                        item.id !==steps.length 
                    }
                </div>
            ))}
        </div>
        <div>
            {
                steps.map((item,index)=>(
                    <div key={index}>
                        <div>
                            <p>{item.title}</p>
                        </div>
                    </div>
                ))
            }
        </div>
        {step===1 && <CourseInformationForm/>}
        {step===2 && <CourseBuilderForm/>}
        {/* {step===3 && <CourseBuilderForm/>} */}
    </>
  )
}

export default RenderSteps