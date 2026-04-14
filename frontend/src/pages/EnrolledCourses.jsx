import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../services/operations/profileAPI'
import ProgressBar from '@ramonak/react-progress-bar'
import { useNavigate } from 'react-router-dom'

// ─── Filter Tab Bar ────────────────────────────────────────────────────────────
function FilterTabs({ active, onChange }) {
    const tabs = ['All', 'Pending', 'Cancelled']
    return (
        <div style={{
            display: 'flex',
            gap: 4,
            background: '#161D29',
            border: '1px solid #2C333F',
            borderRadius: 8,
            padding: 4,
            width: 'fit-content',
            marginBottom: 24,
        }}>
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    style={{
                        padding: '6px 20px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: active === tab ? 600 : 400,
                        background: active === tab ? '#FFD60A' : 'transparent',
                        color: active === tab ? '#000' : '#AFB2BF',
                        transition: 'all 0.15s',
                    }}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ progress }) {
    const isDone    = progress >= 100
    const isPending = progress > 0 && progress < 100
    const label     = isDone ? 'Completed' : isPending ? 'In Progress' : 'Not Started'
    const colors    = isDone
        ? { bg: 'rgba(71,169,146,0.15)', text: '#47A992', dot: '#47A992' }
        : isPending
        ? { bg: 'rgba(255,214,10,0.12)', text: '#FFD60A', dot: '#FFD60A' }
        : { bg: 'rgba(107,114,128,0.15)', text: '#6B7280', dot: '#6B7280' }

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: colors.bg, color: colors.text,
            fontSize: 11, fontWeight: 600, padding: '3px 10px',
            borderRadius: 99, letterSpacing: 0.3,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
            {label}
        </span>
    )
}

// ─── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #1C2333',
            gap: 16,
            animation: 'pulse 1.5s ease-in-out infinite',
        }}>
            <div style={{ width: 80, height: 56, borderRadius: 6, background: '#1C2333', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 13, width: '55%', borderRadius: 4, background: '#1C2333' }} />
                <div style={{ height: 11, width: '80%', borderRadius: 4, background: '#161D29' }} />
            </div>
            <div style={{ width: 80, height: 13, borderRadius: 4, background: '#1C2333' }} />
            <div style={{ width: 140, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 11, borderRadius: 4, background: '#1C2333' }} />
                <div style={{ height: 7, borderRadius: 99, background: '#1C2333' }} />
            </div>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: '#1C2333', flexShrink: 0 }} />
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
    )
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ navigate }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '64px 20px', gap: 16,
        }}>
            <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#161D29', border: '2px dashed #2C333F',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 8,
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3A4452" strokeWidth="1.5">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            </div>
            <p style={{ color: '#F1F2FF', fontSize: 18, fontWeight: 700, margin: 0 }}>
                No Enrolled Courses Yet
            </p>
            <p style={{ color: '#6B7280', fontSize: 14, margin: 0, textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>
                You haven't enrolled in any courses. Start learning today!
            </p>
            <button
                onClick={() => navigate('/catalog')}
                style={{
                    marginTop: 8, padding: '11px 28px',
                    borderRadius: 6, border: 'none',
                    background: '#FFD60A', color: '#000',
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5cc00'}
                onMouseLeave={e => e.currentTarget.style.background = '#FFD60A'}
            >
                Explore Courses
            </button>
        </div>
    )
}

// ─── Course Row ────────────────────────────────────────────────────────────────
function CourseRow({ course, index, total, onMenuClick, menuOpen }) {
    const navigate   = useNavigate()
    const progress   = course.progress || 0
    const isLast     = index === total - 1

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: isLast ? 'none' : '1px solid #1C2333',
                gap: 16,
                transition: 'background 0.15s',
                cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#0F1624'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
            {/* Thumbnail */}
            <div style={{
                width: 90, height: 60, borderRadius: 6,
                overflow: 'hidden', flexShrink: 0,
                background: '#1C2333',
                border: '1px solid #2C333F',
            }}
                onClick={() => navigate(`/courses/${course._id}`)}
            >
                <img
                    src={course?.thumbnailUrl}
                    alt={course.courseName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentNode.style.background = '#1C2333'
                    }}
                />
            </div>

            {/* Course name + description */}
            <div style={{ flex: 1, minWidth: 0 }}
                onClick={() => navigate(`/courses/${course._id}/learn`)}
            >
                <p style={{
                    color: '#F1F2FF', fontWeight: 600, fontSize: 14,
                    marginBottom: 4, lineHeight: 1.4,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {course.courseName}
                </p>
                <p style={{
                    color: '#6B7280', fontSize: 12, lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {course.courseDescription}
                </p>
            </div>

            {/* Duration */}
            <div style={{ width: 100, flexShrink: 0 }}>
                <p style={{ color: '#AFB2BF', fontSize: 13, whiteSpace: 'nowrap' }}>
                    {course?.totalDuration || '2hr 30min'}
                </p>
            </div>

            {/* Progress */}
            <div style={{ width: 160, flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <StatusBadge progress={progress} />
                    <span style={{ color: '#AFB2BF', fontSize: 12, fontWeight: 600 }}>
                        {progress}%
                    </span>
                </div>
                <ProgressBar
                    completed={progress}
                    height="6px"
                    isLabelVisible={false}
                    baseBgColor="#2C333F"
                    bgColor={progress >= 100 ? '#47A992' : '#FFD60A'}
                    borderRadius="99px"
                />
            </div>

            {/* Three-dot menu */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                    onClick={e => { e.stopPropagation(); onMenuClick(index) }}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#6B7280', padding: '6px',
                        borderRadius: 6, display: 'flex', alignItems: 'center',
                        transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2C333F'; e.currentTarget.style.color = '#F1F2FF' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6B7280' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5"  r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                    </svg>
                </button>

                {/* Dropdown */}
                {menuOpen === index && (
                    <div style={{
                        position: 'absolute', right: 0, top: '110%',
                        background: '#1C2333', border: '1px solid #2C333F',
                        borderRadius: 8, padding: '6px',
                        minWidth: 160, zIndex: 50,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    }}>
                        {[
                            { icon: '▶', label: 'Continue Learning',path:"/course/:courseId/learn" },
                            { icon: '↗', label: 'View Course',path:"/course/:courseId" },
                            { icon: '⋯', label: 'View Details' },
                        ].map(item => (
                            <button
                                key={item.label}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    width: '100%', padding: '8px 12px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#AFB2BF', fontSize: 13, borderRadius: 6,
                                    transition: 'background 0.15s, color 0.15s',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#2C333F'; e.currentTarget.style.color = '#F1F2FF' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#AFB2BF' }}
                            >
                                <span style={{ fontSize: 12 }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Main Component ────────────────────────────────────────────────────────────
const EnrolledCourses = () => {
    const navigate                            = useNavigate()
    const { token }                           = useSelector(state => state.auth)
    const [enrolledCourses, setEnrolledCourses] = useState(null)
    const [activeFilter, setActiveFilter]     = useState('All')
    const [openMenu, setOpenMenu]             = useState(null)

    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response.courseEnrollments)
        } catch (error) {
            console.log(error)
            setEnrolledCourses([])
        }
    }

    useEffect(() => { getEnrolledCourses() }, [])

    // Close menu on outside click
    useEffect(() => {
        const handler = () => setOpenMenu(null)
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [])

    // Filter logic
    const filtered = (() => {
        if (!enrolledCourses) return null
        if (activeFilter === 'All') return enrolledCourses
        if (activeFilter === 'Pending') return enrolledCourses.filter(c => (c.progressPercentage || 0) < 100)
        if (activeFilter === 'Cancelled') return []
        return enrolledCourses
    })()

    // Summary stats
    const totalCourses    = enrolledCourses?.length ?? 0
    const completedCount  = enrolledCourses?.filter(c => (c.progressPercentage || 0) >= 100).length ?? 0
    const inProgressCount = enrolledCourses?.filter(c => {
        const p = c.progressPercentage || 0
        return p > 0 && p < 100
    }).length ?? 0

    return (
        <div style={{
            color: '#F1F2FF',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            minHeight: '100vh',
            padding: '32px 32px 48px',
            background: '#0A0F1C',
        }}>

            {/* ── Page Header ── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F1F2FF', marginBottom: 6, letterSpacing: -0.3 }}>
                    Enrolled Courses
                </h1>
                <p style={{ color: '#6B7280', fontSize: 14 }}>
                    Track your learning progress and continue where you left off
                </p>
            </div>

            {/* ── Stats Row ── */}
            {enrolledCourses && enrolledCourses.length > 0 && (
                <div style={{
                    display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap',
                }}>
                    {[
                        { label: 'Total Enrolled', value: totalCourses,    color: '#FFD60A', icon: '📚' },
                        { label: 'In Progress',    value: inProgressCount, color: '#AFB2BF', icon: '⏳' },
                        { label: 'Completed',      value: completedCount,  color: '#47A992', icon: '✅' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            background: '#161D29', border: '1px solid #2C333F',
                            borderRadius: 10, padding: '16px 24px',
                            display: 'flex', alignItems: 'center', gap: 14,
                            minWidth: 160,
                        }}>
                            <span style={{ fontSize: 22 }}>{stat.icon}</span>
                            <div>
                                <p style={{ color: stat.color, fontSize: 22, fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>
                                    {stat.value}
                                </p>
                                <p style={{ color: '#6B7280', fontSize: 12 }}>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Filter Tabs ── */}
            {enrolledCourses && enrolledCourses.length > 0 && (
                <FilterTabs active={activeFilter} onChange={setActiveFilter} />
            )}

            {/* ── Table ── */}
            {!enrolledCourses ? (
                /* Loading skeleton */
                <div style={{
                    background: '#161D29', border: '1px solid #2C333F',
                    borderRadius: 10, overflow: 'hidden',
                }}>
                    {/* Table header */}
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        padding: '12px 20px', gap: 16,
                        background: '#1C2333', borderBottom: '1px solid #2C333F',
                    }}>
                        {['Course Name', 'Duration', 'Progress', ''].map((h, i) => (
                            <p key={i} style={{
                                color: '#6B7280', fontSize: 12, fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                flex: i === 0 ? 1 : undefined,
                                width: i === 1 ? 100 : i === 2 ? 160 : 30,
                                flexShrink: 0,
                            }}>{h}</p>
                        ))}
                    </div>
                    {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
                </div>
            ) : !enrolledCourses.length ? (
                <div style={{ background: '#161D29', border: '1px solid #2C333F', borderRadius: 10 }}>
                    <EmptyState navigate={navigate} />
                </div>
            ) : (
                <div style={{
                    background: '#161D29', border: '1px solid #2C333F',
                    borderRadius: 10, overflow: 'hidden',
                }}>
                    {/* Table header */}
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        padding: '12px 20px', gap: 16,
                        background: '#1C2333', borderBottom: '1px solid #2C333F',
                    }}>
                        <p style={{ flex: 1, color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Course Name
                        </p>
                        <p style={{ width: 100, flexShrink: 0, color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Duration
                        </p>
                        <p style={{ width: 160, flexShrink: 0, color: '#6B7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Progress
                        </p>
                        <p style={{ width: 30, flexShrink: 0 }} />
                    </div>

                    {/* Rows */}
                    {filtered.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
                            No courses match this filter.
                        </div>
                    ) : (
                        filtered.map((course, index) => (
                            <CourseRow
                                key={course.courseId._id || index}
                                course={course.courseId}
                                index={index}
                                total={filtered.length}
                                onMenuClick={(i) => setOpenMenu(prev => prev === i ? null : i)}
                                menuOpen={openMenu}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default EnrolledCourses