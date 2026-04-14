import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { fetchInstructorCourses, deleteCourse } from '../../services/operations/courseDetailsAPI'
import { setCourse, setEditCourse, setStep } from '../../slices/courseSlice'

const MyCourses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    const result = await fetchInstructorCourses()
    if (result) setCourses(result.courses || [])
    setLoading(false)
  }

  const handleEdit = (course) => {
    dispatch(setCourse(course))
    dispatch(setEditCourse(true))
    dispatch(setStep(1))
    navigate('/dashboard/add-course?courseId=' + course._id)
    // navigate('/dashboard/add-course')
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    setDeletingId(courseId)
    await deleteCourse({ courseId })
    setCourses((prev) => prev.filter((c) => c._id !== courseId))
    setDeletingId(null)
  }

  return (
    <div className="text-white w-full min-h-screen bg-[#0F1117]">
      {/* Header */}
      <div className="flex justify-between items-start px-8 pt-6 pb-4">
        <div>
          <p className="text-sm text-[#838894] mb-1">
            Home / Dashboard / <span className="text-[#FFD60A]">Courses</span>
          </p>
          <h1 className="text-3xl font-bold text-white">My Course</h1>
        </div>
        <button
          onClick={() => {
            dispatch(setEditCourse(false))
            dispatch(setCourse(null))
            dispatch(setStep(1))
            navigate('/dashboard/add-course')
          }}
          className="flex items-center gap-2 bg-[#FFD60A] text-black font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
        >
          <span className="text-base">⊕</span>
          New
        </button>
      </div>

      {/* Table container */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-[#838894]">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#838894] gap-2">
          <p className="text-base">No courses yet.</p>
          <p className="text-sm">Click "+ New" to create your first course.</p>
        </div>
      ) : (
        <div className="mx-6 rounded-xl overflow-hidden border border-[#2C333F]">
          {/* Table Header */}
          <div className="grid bg-[#161D29] border-b border-[#2C333F] px-6 py-4"
            style={{ gridTemplateColumns: '1fr 130px 100px 100px' }}>
            <span className="text-xs font-semibold text-[#838894] uppercase tracking-wider">Courses</span>
            {/* <span className="text-xs font-semibold text-[#838894] uppercase tracking-wider">Duration</span>
            <span className="text-xs font-semibold text-[#838894] uppercase tracking-wider">Price</span> */}
            <span className="text-xs font-semibold text-[#838894] uppercase tracking-wider">Actions</span>
          </div>

          {/* Rows */}
          {courses.length > 0 && courses.map((course, idx) => (
            <div
              key={course._id}
              className={`grid px-6 py-5 items-center bg-[#0F1117] hover:bg-[#161D29] transition-colors ${idx !== courses.length - 1 ? 'border-b border-[#2C333F]' : ''}`}
              style={{ gridTemplateColumns: '1fr 130px 100px 100px' }}
            >
              {/* Course info */}
              <div className="flex gap-4 items-start pr-4">
                <img
                  src={course.thumbnailUrl || course.thumbnail}
                  alt={course.courseName}
                  className="w-[180px] h-[110px] rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none' }}
                />
                <div className="flex flex-col gap-1.5 min-w-0">
                  <h2 className="text-white font-bold text-lg leading-snug">
                    {course.courseName}:
                  </h2>
                  <p className="text-[#838894] text-sm line-clamp-2">
                    {course.courseDescription || course.description}
                  </p>
                  <p className="text-[#AFB2BF] text-xs">
                    Created:{' '}
                    {new Date(course.createdAt).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}{' '}
                    |{' '}
                    {new Date(course.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-medium mt-0.5 ${course.status === 'Published'
                    ? 'bg-[#1C3829] text-[#4ade80]'
                    : 'bg-[#2D1B27] text-[#f472b6]'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'Published' ? 'bg-[#4ade80]' : 'bg-[#f472b6]'}`} />
                    {course.status === 'Published'
                      ? 'Published'
                      : course.scheduledJobId
                        ? 'Scheduled'
                        : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Duration */}
              {/* <span className="text-[#AFB2BF] text-sm">
                {course.totalDuration || course.duration || '—'}
              </span> */}

              {/* Price */}
              <span className="text-[#AFB2BF] text-sm font-medium">
                {course.price === 0 || course.originalPrice === 0
                  ? 'Free'
                  : `₹${course.discountPrice || course.price || course.originalPrice}`}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEdit(course)}
                  className="text-[#838894] hover:text-white transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  disabled={deletingId === course._id}
                  className="text-[#838894] hover:text-red-400 transition-colors disabled:opacity-40"
                  title="Delete"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses