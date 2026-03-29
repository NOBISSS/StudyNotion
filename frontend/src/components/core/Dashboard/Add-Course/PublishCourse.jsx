import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { VscChevronLeft } from 'react-icons/vsc'
import { setStep, setCourse } from '../../../../slices/courseSlice'
import { draftCourse, editCourseDetails, publishCourse } from '../../../../services/operations/courseDetailsAPI'
import { COURSE_STATUS } from '../../../../utils/constants'

const PublishCourse = ({courseId}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { course } = useSelector((state) => state.course)
  const [isPublic, setIsPublic] = useState(course?.status === 'Published')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
      if (!courseId) {
        dispatch(setStep(1))
      }
      }, [courseId])
  const handleSave = async (status) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('courseId', course._id)
    formData.append('status', status)
    let result;
    if (isPublic)
    result = await publishCourse(courseId)
    setLoading(false)
    if (result) {
      dispatch(setCourse(result))
      navigate('/dashboard/my-courses')
    }
  }
  const handleSaveDraft = async () => {
    setLoading(true)
    let result;
    if (!isPublic)
    result = await draftCourse(courseId)
    setLoading(false)
    if (result) {
      dispatch(setCourse(result))
      navigate('/dashboard/my-courses')
    }
  }

  return (
    <>
      {/* Publish Settings Card */}
      <div className="bg-[#161D29] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-5">Publish Settings</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 rounded border-[#424854] accent-[#FFD60A] cursor-pointer"
          />
          <span className="text-[#AFB2BF] text-sm">Make this Course Public</span>
        </label>
      </div>

      {/* Back / Save as Draft / Save and Publish — outside card, centered at bottom */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => dispatch(setStep(2))}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#424854] text-white bg-[#1D2532] hover:bg-[#2C333F] transition-colors text-sm font-medium"
        >
          <VscChevronLeft />
          Back
        </button>
        <button
          onClick={() => handleSaveDraft(COURSE_STATUS.DRAFT)}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#1D2532] border border-[#424854] text-white text-sm font-medium hover:bg-[#2C333F] transition-colors disabled:opacity-50"
        >
          Save as a Draft
        </button>
        <button
          onClick={() => handleSave(COURSE_STATUS.PUBLISHED)}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#FFD60A] text-black text-sm font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save and Publish'}
        </button>
      </div>
    </>
  )
}

export default PublishCourse