// components/core/Admin/UserManagement.jsx
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiSearch, FiSlash, FiCheckCircle, FiFilter } from "react-icons/fi"
import { HiOutlineUser, HiOutlineAcademicCap, HiOutlineShieldCheck } from "react-icons/hi"
import { getAllUsers, banUser, unbanUser } from "../../../services/operations/adminAPI"

const ACCOUNT_ICONS = {
  student: <HiOutlineAcademicCap size={14} />,
  instructor: <HiOutlineUser size={14} />,
  admin: <HiOutlineShieldCheck size={14} />,
}

const ACCOUNT_COLORS = {
  student: "text-[#60A5FA] bg-[#60A5FA]/10",
  instructor: "text-[#FFD60A] bg-[#FFD60A]/10",
  admin: "text-[#A78BFA] bg-[#A78BFA]/10",
}

const UserManagement = () => {
  const { token } = useSelector((state) => state.auth)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null) // userId
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const data = await getAllUsers(token)
    setUsers(data || [])
    setLoading(false)
  }

  const handleBan = async (userId) => {
    setActionLoading(userId)
    const ok = await banUser(token, userId)
    if (ok)
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: true } : u))
      )
    setActionLoading(null)
  }

  const handleUnban = async (userId) => {
    setActionLoading(userId)
    const ok = await unbanUser(token, userId)
    if (ok)
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: false } : u))
      )
    setActionLoading(null)
  }

  // Filter
  const filtered = users.filter((u) => {
    const matchSearch =
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchRole = filterRole === "all" || u.accountType === filterRole
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !u.isBanned) ||
      (filterStatus === "banned" && u.isBanned)
    return matchSearch && matchRole && matchStatus
  })

  const stats = {
    total: users.filter(u => u.accountType != "admin" && !u.isDeleted).length,
    students: users.filter((u) => u.accountType === "student" && !u.isDeleted).length,
    instructors: users.filter((u) => u.accountType === "instructor" && !u.isDeleted).length,
    banned: users.filter((u) => u.isBanned).length,
  }

  return (
    <div className="min-h-screen bg-[#161D29] text-white px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-[#6E727F] text-sm mt-0.5">Manage all platform users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Users", value: stats.total, color: "#60A5FA" },
          { label: "Students", value: stats.students, color: "#FFD60A" },
          { label: "Instructors", value: stats.instructors, color: "#A78BFA" },
          { label: "Banned", value: stats.banned, color: "#EF4444" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#1E2735] rounded-xl border border-[#2C333F] p-4"
          >
            <p className="text-[#6E727F] text-xs mb-1">{s.label}</p>
            <p
              className="text-2xl font-bold"
              style={{ color: s.color }}
            >
              {loading ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E727F]"
            size={15}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#2C333F] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-white placeholder-[#6E727F] text-sm rounded-lg pl-9 pr-4 py-2.5 transition-colors"
          />
        </div>

        {/* Role filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-[#2C333F] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-[#AFB2BF] text-sm rounded-lg px-4 py-2.5 transition-colors cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="instructor">Instructors</option>
          <option value="admin">Admins</option>
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#2C333F] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-[#AFB2BF] text-sm rounded-lg px-4 py-2.5 transition-colors cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1E2735] rounded-xl border border-[#2C333F] overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#2C333F]">
          {["User", "Email", "Role", "Status", "Action"].map((h) => (
            <p key={h} className="text-[#6E727F] text-xs font-semibold uppercase tracking-wider">
              {h}
            </p>
          ))}
        </div>

        {loading ? (
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-[#2C333F] animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2C333F]" />
                  <div className="h-3 bg-[#2C333F] rounded w-24" />
                </div>
                <div className="h-3 bg-[#2C333F] rounded w-32 self-center" />
                <div className="h-5 bg-[#2C333F] rounded w-20 self-center" />
                <div className="h-5 bg-[#2C333F] rounded w-16 self-center" />
                <div className="h-8 bg-[#2C333F] rounded w-20 self-center" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <HiOutlineUser size={40} className="text-[#2C333F]" />
            <p className="text-[#6E727F]">No users found</p>
          </div>
        ) : (
          filtered.map((user, index) => (
            <div
              key={user._id}
              className={`grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 transition-colors hover:bg-[#2C333F]/30 ${index < filtered.length - 1 ? "border-b border-[#2C333F]" : ""
                } ${user.isBanned ? "opacity-60" : ""}`}
            >
              {/* User */}
              <div className="flex items-center gap-3 min-w-0">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#FFD60A]/20 flex items-center justify-center text-[#FFD60A] text-xs font-bold shrink-0">
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="text-white text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              {/* Email */}
              <p className="text-[#AFB2BF] text-sm truncate">{user.email}</p>

              {/* Role */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${ACCOUNT_COLORS[user.accountType] || "text-[#6E727F] bg-[#2C333F]"
                  }`}
              >
                {ACCOUNT_ICONS[user.accountType]}
                {user.accountType}
              </span>

              {/* Status */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${user.isBanned
                    ? "text-[#EF4444] bg-[#EF4444]/10"
                    : "text-[#22C55E] bg-[#22C55E]/10"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${user.isBanned ? "bg-[#EF4444]" : "bg-[#22C55E]"
                    }`}
                />
                {user.isBanned ? "Banned" : "Active"}
              </span>

              {/* Action */}
              <button
                disabled={actionLoading === user._id}
                onClick={() =>
                  user.isBanned
                    ? handleUnban(user._id)
                    : handleBan(user._id)
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${user.isBanned
                    ? "bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20"
                    : "bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20"
                  }`}
              >
                {actionLoading === user._id ? (
                  "..."
                ) : user.isBanned ? (
                  <>
                    <FiCheckCircle size={13} /> Unban
                  </>
                ) : (
                  <>
                    <FiSlash size={13} /> Ban
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-[#6E727F] text-xs mt-3 text-right">
          Showing {filtered.length} of {users.length} users
        </p>
      )}
    </div>
  )
}

export default UserManagement