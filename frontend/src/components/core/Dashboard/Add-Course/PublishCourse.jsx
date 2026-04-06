import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { VscChevronLeft } from 'react-icons/vsc'
import { BsCalendar3 } from 'react-icons/bs'
import { setStep, setCourse } from '../../../../slices/courseSlice'
import {
  draftCourse,
  publishCourse,
  scheduleCourse,
} from '../../../../services/operations/courseDetailsAPI'
import ScheduleModal from './ScheduleModal'

const PublishCourse = ({ courseId }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { course }  = useSelector((state) => state.course)

  const [isPublic, setIsPublic]           = useState(course?.status === 'Published')
  const [loading, setLoading]             = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // Guard — if courseId disappeared (e.g. refresh) go back to step 1
  useEffect(() => {
    if (!courseId) dispatch(setStep(1))
  }, [courseId])

  // ── Publish now ────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    setLoading(true)
    const result = await publishCourse(courseId)
    setLoading(false)
    if (result) {
      dispatch(setCourse(result))
      navigate('/dashboard/my-courses')
    }
  }

  // ── Save as draft ──────────────────────────────────────────────────────────
  const handleDraft = async () => {
    setLoading(true)
    const result = await draftCourse(courseId)
    setLoading(false)
    if (result) {
      dispatch(setCourse(result))
      navigate('/dashboard/my-courses')
    }
  }

  // ── Schedule — called from ScheduleModal with ISO string ───────────────────
  // scheduledPublishAt: "2026-04-20T10:30:00.000Z"
  // Backend: POST /courses/schedule/:courseId  body: { scheduledPublishAt }
  const handleScheduleConfirm = async (scheduledPublishAt) => {
    setLoading(true)
    const result = await scheduleCourse(courseId, { scheduledPublishAt })
    setLoading(false)
    if (result) {
      dispatch(setCourse(result))
      setShowScheduleModal(false)
      navigate('/dashboard/my-courses')
    }
  }

  return (
    <>
      {/* Publish Settings Card */}
      <div className="bg-[#161D29] rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">Publish Settings</h2>

        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 rounded border-[#424854] accent-[#FFD60A] cursor-pointer"
          />
          <span className="text-[#AFB2BF] text-sm">Make this Course Public</span>
        </label>

        {/* Scheduled badge — show if course is already scheduled */}
        {course?.isScheduled && course?.scheduledPublishAt && (
          <div className="flex items-center gap-2.5 bg-[#FFD60A]/5 border border-[#FFD60A]/20 rounded-xl px-4 py-3 w-fit">
            <BsCalendar3 className="text-[#FFD60A] text-sm flex-shrink-0" />
            <div>
              <p className="text-[#FFD60A] text-xs font-semibold">Scheduled to publish</p>
              <p className="text-[#AFB2BF] text-xs mt-0.5">
                {new Date(course.scheduledPublishAt).toLocaleDateString('en-IN', {
                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                })}{' '}
                at{' '}
                {new Date(course.scheduledPublishAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            {/* Cancel schedule */}
            <button
              onClick={() => handleScheduleConfirm(null)}
              className="ml-3 text-xs text-red-400 hover:text-red-300 transition-colors underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
        <button
          onClick={() => dispatch(setStep(2))}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#424854]
                     text-white bg-[#1D2532] hover:bg-[#2C333F] transition-colors text-sm font-medium
                     disabled:opacity-50"
        >
          <VscChevronLeft />
          Back
        </button>

        <button
          onClick={handleDraft}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#1D2532] border border-[#424854]
                     text-white text-sm font-medium hover:bg-[#2C333F] transition-colors
                     disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save as Draft'}
        </button>

        <button
          onClick={() => setShowScheduleModal(true)}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#FFD60A]
                     text-[#FFD60A] text-sm font-semibold hover:bg-[#FFD60A] hover:text-black
                     transition-all disabled:opacity-50"
        >
          <BsCalendar3 className="text-sm" />
          {course?.isScheduled ? 'Reschedule' : 'Schedule'}
        </button>

        <button
          onClick={handlePublish}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#FFD60A] text-black text-sm font-semibold
                     hover:bg-yellow-300 transition-colors disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Save and Publish'}
        </button>
      </div>

      {/* Schedule Date Picker Modal */}
      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          onConfirm={handleScheduleConfirm}
          loading={loading}
        />
      )}
    </>
  )
}

export default PublishCourse