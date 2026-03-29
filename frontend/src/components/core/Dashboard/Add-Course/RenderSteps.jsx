import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import CourseInformationForm from './CourseInformationForm'
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm'
import PublishCourse from './PublishCourse'

const steps = [
  { id: 1, title: 'Course Information' },
  { id: 2, title: 'Course Builder' },
  { id: 3, title: 'Publish' },
]

const RenderSteps = ({courseId}) => {
  const { step } = useSelector((state) => state.course)

  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="flex items-start mb-8">
        {steps.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step > item.id
                  ? 'bg-[#FFD60A] border-[#FFD60A] text-black'
                  : step === item.id
                  ? 'bg-transparent border-[#FFD60A] text-[#FFD60A]'
                  : 'bg-transparent border-[#424854] text-[#838894]'
              }`}>
                {step > item.id ? <FaCheck className="text-xs" /> : item.id}
              </div>
              <p className={`text-xs font-medium whitespace-nowrap ${step >= item.id ? 'text-white' : 'text-[#838894]'}`}>
                {item.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mt-[18px] mx-2">
                <div className={`w-full border-t-2 border-dashed ${step > item.id ? 'border-[#FFD60A]' : 'border-[#424854]'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && <CourseInformationForm courseId={courseId} />}
      {step === 2 && <CourseBuilderForm courseId={courseId} />}
      {step === 3 && <PublishCourse courseId={courseId} />}
    </div>
  )
}

export default RenderSteps