import React from 'react'
import { useNavigate } from 'react-router-dom'
import { VscChevronLeft } from 'react-icons/vsc'
import RenderSteps from './RenderSteps'

const tips = [
  'Set the Course Price option or make it free.',
  'Standard size for the course thumbnail is 1024×576.',
  'Video section controls the course overview video.',
  'Course Builder is where you create & organize a course.',
  'Add Topics in the Course Builder section to create lessons, quizzes, and assignments.',
  'Information from the Additional Data section shows up on the course single page.',
  'Make Announcements to notify any important updates.',
  'Notes to all enrolled students at once.',
]

const AddCourse = () => {
  const navigate = useNavigate()

  return (
    <div className="text-white min-h-screen w-full bg-[#0F1117] px-6 lg:px-8 py-6">
      <button
        onClick={() => navigate('/dashboard/my-courses')}
        className="flex items-center gap-1 text-[#838894] hover:text-white text-sm mb-6 transition-colors"
      >
        <VscChevronLeft />
        Back to Dashboard
      </button>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left — stepper + form */}
        <div className="flex-1 min-w-0">
          <RenderSteps />
        </div>

        {/* Right — tips panel */}
        <div className="w-full lg:w-[290px] xl:w-[310px] flex-shrink-0 lg:sticky lg:top-6">
          <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-6">
            <h2 className="font-bold text-base text-white mb-4">
              ⚡ Course Upload Tips
            </h2>
            <ul className="flex flex-col gap-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[#AFB2BF] text-sm leading-relaxed">
                  <span className="mt-1 flex-shrink-0 text-[#AFB2BF]">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCourse