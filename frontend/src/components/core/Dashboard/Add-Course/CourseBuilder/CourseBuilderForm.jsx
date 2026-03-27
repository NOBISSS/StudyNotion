import React from 'react'
import { CTAButton } from '../../../HomePage/Button'
import { IconBtn } from '../../../../common/IconBtn'
import { VscAdd } from "react-icons/vsc";
const CourseBuilder = () => {

  return (
    <div className='w-[40vw]  bg-gray-900 rounded-lg'>
      <div className='p-5 flex flex-col gap-2'>
        <h1 className='text-1xl font-bold'>Course Builder</h1>
        <label htmlFor='sectionTitle'>Section Name<sup className='text-red-600'>*</sup></label>
        <input type='text' placeholder='Add a section to build your course'
        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
        />
        <button className='border-2 w-fit flex justify-center align-center gap-2 border-amber-400 bg-transparent text-amber-400 p-3 rounded-lg'>Create Section <VscAdd />
</button>

      </div>
      <div className='flex gap-10 justify-end'>
          <CTAButton active={false}>
            Back
          </CTAButton>
          <IconBtn text={"Next"} active={true} iconName={"VscChevronRight"}/>
      </div>
    </div>
  )
}

export default CourseBuilder