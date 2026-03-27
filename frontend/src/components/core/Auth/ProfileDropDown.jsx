// components/core/Auth/ProfileDropDown.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../../../services/operations/authAPI'

// ─── Menu items ───────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    label: 'My Profile',
    path: '/dashboard/my-profile',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Dashboard',
    path: '/dashboard/my-profile',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Enrolled Courses',
    path: '/dashboard/enrolled-courses',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    path: '/dashboard/settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

// ─── Instructor-only items ────────────────────────────────────────────────────
const INSTRUCTOR_ITEMS = [
  {
    label: 'My Courses',
    path: '/dashboard/instructor',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    label: 'Add Course',
    path: '/dashboard/add-course',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
]

const ProfileDropDown = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.profile)

  const isInstructor = user?.accountType === 'Instructor'
  const profilePic   =
    user?.additionalDetails?.profilePicture ||
    user?.image ||
    null
  const fullName  = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User'
  const email     = user?.email || ''
  const initial   = fullName.charAt(0).toUpperCase()

  const menuItems = isInstructor
    ? [...INSTRUCTOR_ITEMS, ...MENU_ITEMS.filter(m => m.label === 'Settings')]
    : MENU_ITEMS

  const handleLogout = () => {
    dispatch(logout(navigate))
  }

  return (
    /*
      Positioning is handled by the PARENT in Navbar.jsx:
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[220px]">
          <ProfileDropDown />
        </div>
      So this component itself uses no absolute positioning.
    */
    <div
      style={{
        background: '#1F2937',
        border: '1px solid #2C333F',
        borderRadius: 12,
        minWidth: 220,
        boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        overflow: 'hidden',
        // Entrance animation
        animation: 'pd-enter 0.15s ease-out',
      }}
    >
      <style>{`
        @keyframes pd-enter {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>

      {/* ── User info header ── */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #2C333F',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {profilePic ? (
            <img
              src={profilePic}
              alt={fullName}
              style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD60A, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 16, color: '#000',
            }}>
              {initial}
            </div>
          )}
          {/* Online dot */}
          <span style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 10, height: 10, borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #1F2937',
          }} />
        </div>

        {/* Name + email */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            color: '#F1F2FF', fontWeight: 600, fontSize: 13,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginBottom: 2,
          }}>
            {fullName}
          </p>
          <p style={{
            color: '#6B7280', fontSize: 11,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {email}
          </p>
        </div>

        {/* Account type badge */}
        <span style={{
          flexShrink: 0,
          fontSize: 10, fontWeight: 600,
          padding: '2px 8px', borderRadius: 99,
          background: isInstructor ? 'rgba(99,102,241,0.15)' : 'rgba(6,182,212,0.12)',
          color: isInstructor ? '#818cf8' : '#06B6D4',
          letterSpacing: '0.03em',
          textTransform: 'capitalize',
        }}>
          {user?.accountType || 'Student'}
        </span>
      </div>

      {/* ── Menu items ── */}
      <div style={{ padding: '6px' }}>
        {menuItems.map((item, i) => (
          <Link key={i} to={item.path} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                color: '#AFB2BF', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#2C333F'
                e.currentTarget.style.color = '#F1F2FF'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#AFB2BF'
              }}
            >
              <span style={{ flexShrink: 0, opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: '#2C333F', margin: '0 6px' }} />

      {/* ── Logout ── */}
      <div style={{ padding: '6px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '9px 12px', borderRadius: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#F87171', fontSize: 13, fontWeight: 500,
            transition: 'background 0.12s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {/* Logout icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  )
}

export default ProfileDropDown