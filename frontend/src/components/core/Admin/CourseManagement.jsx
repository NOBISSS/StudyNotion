// components/core/Admin/CourseManagement.jsx
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiSearch, FiToggleLeft, FiToggleRight, FiBookOpen } from "react-icons/fi"
import { getAllCoursesAdmin, toggleCourseStatus } from "../../../services/operations/adminAPI"

const LEVEL_COLORS = {
  Beginner: "text-[#22C55E] bg-[#22C55E]/10",
  Intermediate: "text-[#F59E0B] bg-[#F59E0B]/10",
  Advance: "text-[#EF4444] bg-[#EF4444]/10",
  "Beginner-to-Advance": "text-[#60A5FA] bg-[#60A5FA]/10",
}

const CourseManagement = () => {
  const { token } = useSelector((state) => state.auth)

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const data = await getAllCoursesAdmin(token)
    setCourses(data.courses || [])
    setLoading(false)
  }

  const handleToggle = async (courseId) => {
    setActionLoading(courseId)
    const ok = await toggleCourseStatus(token, courseId)
    if (ok)
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId
            ? { ...c, isActive: !c.isActive }
            : c
        )
      )
    setActionLoading(null)
  }

  const filtered = courses.filter((c) => {
    const matchSearch = c.courseName
      ?.toLowerCase()
      .includes(search.toLowerCase())
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && c.isActive) ||
      (filterStatus === "inactive" && !c.isActive)
    const matchLevel =
      filterLevel === "all" || c.level === filterLevel
    return matchSearch && matchStatus && matchLevel
  })

  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.isActive && c.status === "Published").length,
    draft: courses.filter((c) => c.isActive && c.status === "Draft").length,
    inactive: courses.filter((c) => !c.isActive).length,
  }

  return (
    <div className="min-h-screen bg-[#161D29] text-white px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Course Management</h1>
        <p className="text-[#6E727F] text-sm mt-0.5">
          Manage and monitor all platform courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Courses", value: stats.total, color: "#60A5FA" },
          { label: "Published", value: stats.published, color: "#22C55E" },
          { label: "Draft", value: stats.draft, color: "#F59E0B" },
          { label: "Inactive", value: stats.inactive, color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1E2735] rounded-xl border border-[#2C333F] p-4">
            <p className="text-[#6E727F] text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {loading ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E727F]" size={15} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#2C333F] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-white placeholder-[#6E727F] text-sm rounded-lg pl-9 pr-4 py-2.5 transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#2C333F] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-[#AFB2BF] text-sm rounded-lg px-4 py-2.5 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="bg-[#2C333F] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-[#AFB2BF] text-sm rounded-lg px-4 py-2.5 cursor-pointer"
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advance">Advance</option>
          <option value="Beginner-to-Advance">Beginner to Advance</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1E2735] rounded-xl border border-[#2C333F] overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#2C333F]">
          {["Course", "Instructor", "Level", "Status", "Price", "Active"].map((h) => (
            <p key={h} className="text-[#6E727F] text-xs font-semibold uppercase tracking-wider">
              {h}
            </p>
          ))}
        </div>

        {loading ? (
          <div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-[#2C333F] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2C333F]" />
                  <div className="h-3 bg-[#2C333F] rounded w-28" />
                </div>
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-5 bg-[#2C333F] rounded self-center" />
                ))}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <FiBookOpen size={40} className="text-[#2C333F]" />
            <p className="text-[#6E727F]">No courses found</p>
          </div>
        ) : (
          filtered.map((course, index) => (
            <div
              key={course._id}
              className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 transition-colors hover:bg-[#2C333F]/30 ${
                index < filtered.length - 1 ? "border-b border-[#2C333F]" : ""
              } ${!course.isActive ? "opacity-50" : ""}`}
            >
              {/* Course */}
              <div className="flex items-center gap-3 min-w-0">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.courseName}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#2C333F] flex items-center justify-center shrink-0">
                    <FiBookOpen size={16} className="text-[#6E727F]" />
                  </div>
                )}
                <p className="text-white text-sm font-medium truncate">
                  {course.courseName}
                </p>
              </div>

              {/* Instructor */}
              <p className="text-[#AFB2BF] text-sm truncate">
                {course.instructorName || "—"}
              </p>

              {/* Level */}
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
                  LEVEL_COLORS[course.level] || "text-[#6E727F] bg-[#2C333F]"
                }`}
              >
                {course.level}
              </span>

              {/* Publish Status */}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                  course.status === "Published"
                    ? "text-[#22C55E]"
                    : "text-[#F59E0B]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    course.status === "Published"
                      ? "bg-[#22C55E]"
                      : "bg-[#F59E0B]"
                  }`}
                />
                {course.status}
              </span>

              {/* Price */}
              <p className="text-[#FFD60A] text-sm font-semibold">
                {course.discountPrice === 0
                  ? "Free"
                  : `₹${course.discountPrice?.toLocaleString("en-IN")}`}
              </p>

              {/* Toggle active */}
              <button
                disabled={actionLoading === course._id}
                onClick={() => handleToggle(course._id)}
                className="transition-colors disabled:opacity-50"
                title={course.isActive ? "Deactivate" : "Activate"}
              >
                {course.isActive ? (
                  <FiToggleRight size={24} className="text-[#22C55E]" />
                ) : (
                  <FiToggleLeft size={24} className="text-[#6E727F]" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CourseManagement