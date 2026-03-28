import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { VscAdd } from 'react-icons/vsc'
import { fetchInstructorCourses, deleteCourse } from '../../services/operations/courseDetailsAPI'
import { useDispatch } from 'react-redux'
import { setEditCourse, setCourse, setStep } from '../../slices/courseSlice'
import toast from 'react-hot-toast'

const MyCourses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    const result = await fetchInstructorCourses()
    if (result) setCourses(result)
    setLoading(false)
  }

  const handleEdit = (course) => {
    dispatch(setCourse(course))
    dispatch(setEditCourse(true))
    dispatch(setStep(1))
    navigate('/dashboard/add-course')
  }

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    setDeletingId(courseId)
    await deleteCourse({ courseId })
    setCourses((prev) => prev.filter((c) => c._id !== courseId))
    setDeletingId(null)
  }

  return (
    <div className="text-white min-h-screen p-6 lg:p-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-1">
          <p className="text-[#838894] text-sm">
            Home / Dashboard / <span className="text-[#FFD60A]">My Courses</span>
          </p>
          <h1 className="text-3xl lg:text-4xl font-semibold text-white">My Courses</h1>
        </div>
        <button
          onClick={() => {
            dispatch(setEditCourse(false))
            dispatch(setCourse(null))
            dispatch(setStep(1))
            navigate('/dashboard/add-course')
          }}
          className="flex items-center gap-2 bg-[#FFD60A] text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-yellow-300 transition-all duration-200"
        >
          <VscAdd className="text-lg" />
          New
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-[#838894]">
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-[#838894]">
          <p className="text-lg">No courses found.</p>
          <p className="text-sm">Click "+ New" to create your first course.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2C333F]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1D2532] text-left text-[#838894] uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Courses</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C333F]">
              {courses.map((course) => (
                <tr key={course._id} className="bg-[#161D29] hover:bg-[#1a2333] transition-colors">
                  {/* Course Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={course.thumbnailUrl || course.thumbnail}
                        alt={course.courseName}
                        className="w-[130px] h-[80px] object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.style.display = 'none'
                        }}
                      />
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <h2 className="font-semibold text-white text-base lg:text-lg line-clamp-1">
                          {course.courseName}
                        </h2>
                        <p className="text-[#838894] text-xs lg:text-sm line-clamp-2 max-w-md">
                          {course.courseDescription || course.description}
                        </p>
                        <p className="text-[#AFB2BF] text-xs">
                          Created: {new Date(course.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                        <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 text-xs font-medium rounded-full ${
                          course.status === 'Published'
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : 'bg-pink-900/50 text-pink-400 border border-pink-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            course.status === 'Published' ? 'bg-green-400' : 'bg-pink-400'
                          }`} />
                          {course.status}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4 text-[#AFB2BF] whitespace-nowrap">
                    {course.totalDuration || course.duration || '—'}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                    {course.price === 0 || course.originalPrice === 0
                      ? 'Free'
                      : `₹${course.discountPrice || course.price || course.originalPrice}`}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-2 rounded-lg hover:bg-[#2C333F] text-[#AFB2BF] hover:text-blue-400 transition-all"
                        title="Edit course"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        disabled={deletingId === course._id}
                        className="p-2 rounded-lg hover:bg-[#2C333F] text-[#AFB2BF] hover:text-red-400 transition-all disabled:opacity-40"
                        title="Delete course"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyCourses