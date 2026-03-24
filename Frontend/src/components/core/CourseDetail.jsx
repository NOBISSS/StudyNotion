import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from './Footer';
import {
    fetchSubSections,
    selectSubSections,
    selectSectionStatus,
    selectSectionError,
} from '../../slices/sectionSlice';

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating = 4.5, size = 14 }) {
    const clamped = Math.min(5, Math.max(0, rating));
    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => {
                const filled = clamped >= s;
                const half   = !filled && clamped >= s - 0.5;
                const gradId = `half-${size}-${s}`;
                return (
                    <svg key={s} width={size} height={size} viewBox="0 0 20 20"
                        fill={filled ? '#E7C009' : half ? `url(#${gradId})` : 'none'}
                        stroke="#E7C009" strokeWidth="1.5"
                    >
                        <defs>
                            <linearGradient id={gradId}>
                                <stop offset="50%" stopColor="#E7C009" />
                                <stop offset="50%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        <polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7" />
                    </svg>
                );
            })}
        </span>
    );
}

// ─── Accordion Section ────────────────────────────────────────────────────────
function AccordionSection({ section, forceOpen }) {
    const dispatch  = useDispatch();
    const sectionId = section._id;

    const subSections = useSelector(selectSubSections(sectionId));
    const status      = useSelector(selectSectionStatus(sectionId));
    const fetchError  = useSelector(selectSectionError(sectionId));

    const manualOverride = useRef(null);
    const [localOpen, setLocalOpen] = useState(section.defaultOpen || false);

    useEffect(() => {
        if (forceOpen !== undefined) {
            manualOverride.current = null;
            setLocalOpen(forceOpen);
        }
    }, [forceOpen]);

    useEffect(() => {
        if (localOpen && sectionId) {
            dispatch(fetchSubSections(sectionId));
        }
    }, [localOpen, sectionId, dispatch]);

    const handleToggle = () => {
        manualOverride.current = !localOpen;
        setLocalOpen((prev) => !prev);
    };

    const isLoading = status === 'loading';

    return (
        <div style={{ borderBottom: '1px solid #2C3244' }}>
            {/* Header */}
            <div
                onClick={handleToggle}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 20px',
                    cursor: 'pointer',
                    background: localOpen ? '#1C2333' : '#161D29',
                    transition: 'background 0.15s',
                    userSelect: 'none',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Chevron */}
                    <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#AFB2BF" strokeWidth="2.5" strokeLinecap="round"
                        style={{
                            transform: localOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            flexShrink: 0,
                        }}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                    <span style={{ color: '#F1F2FF', fontWeight: 600, fontSize: 14 }}>
                        {section.sectionName || section.name}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#FFD60A', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {subSections != null
                            ? `${subSections.length} lectures`
                            : section.subSectionCount != null
                                ? `${section.subSectionCount} lectures`
                                : ''}
                        {section.totalDuration ? `  ${section.totalDuration}` : ''}
                    </span>
                    {isLoading && (
                        <div style={{
                            width: 12, height: 12,
                            border: '2px solid #2C3244', borderTop: '2px solid #FFD60A',
                            borderRadius: '50%', animation: 'sectionSpin 0.7s linear infinite',
                        }} />
                    )}
                </div>
            </div>

            {/* Content */}
            {localOpen && (
                <div style={{ background: '#0D1117' }}>
                    {/* Loading skeleton */}
                    {isLoading && (
                        <div style={{ padding: '14px 20px 14px 48px' }}>
                            {[85, 70, 55].map((w, n) => (
                                <div key={n} style={{
                                    height: 12, borderRadius: 4, marginBottom: 12,
                                    width: `${w}%`,
                                    background: 'linear-gradient(90deg,#1C2333 25%,#2C3244 50%,#1C2333 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.2s infinite',
                                }} />
                            ))}
                            <style>{`
                                @keyframes shimmer     { to { background-position: -200% 0; } }
                                @keyframes sectionSpin { to { transform: rotate(360deg); } }
                            `}</style>
                        </div>
                    )}

                    {/* Error */}
                    {!isLoading && fetchError && (
                        <div style={{ padding: '12px 20px 12px 48px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ color: '#FC8181', fontSize: 12 }}>Failed to load lectures.</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); dispatch(fetchSubSections(sectionId)); }}
                                style={{ background: 'none', border: 'none', color: '#FFD60A', fontSize: 12, cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }}
                            >Retry</button>
                        </div>
                    )}

                    {/* Subsection rows */}
                    {!isLoading && !fetchError && subSections?.map((lecture, i) => (
                        <div
                            key={lecture._id || i}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                padding: '10px 20px 10px 48px',
                                borderBottom: i < subSections.length - 1 ? '1px solid #1C2333' : 'none',
                            }}
                        >
                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
                                {/* Video/lock icon */}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                    stroke="#AFB2BF" strokeWidth="1.8"
                                    style={{ marginTop: 2, flexShrink: 0 }}>
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                <div>
                                    <p style={{ color: '#AFB2BF', fontSize: 13, marginBottom: lecture.description ? 3 : 0, lineHeight: 1.5 }}>
                                        {lecture.title || lecture.subSectionName}
                                    </p>
                                    {lecture.description && (
                                        <p style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.5 }}>
                                            {lecture.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span style={{ color: '#6B7280', fontSize: 12, flexShrink: 0, marginLeft: 16 }}>
                                {lecture.timeDuration || ''}
                            </span>
                        </div>
                    ))}

                    {/* Empty */}
                    {!isLoading && !fetchError && subSections?.length === 0 && (
                        <div style={{ padding: '14px 48px', color: '#6B7280', fontSize: 13 }}>
                            No lectures in this section yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
    const name    = review?.user?.firstName
        ? `${review.user.firstName} ${review.user.lastName}`
        : review?.name || 'Student';
    const initial = name.charAt(0).toUpperCase();
    const avatar  = review?.user?.image || null;
    const text    = review?.review || review?.comment || 'Great course!';
    const rating  = Number(review?.rating) || 4.5;

    return (
        <div style={{
            background: '#161D29',
            border: '1px solid #2C3244',
            borderRadius: 10,
            padding: '20px',
            minWidth: 240,
            maxWidth: 280,
            flex: '0 0 auto',
            transition: 'border-color 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#FFD60A'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2C3244'}
        >
            {/* Reviewer info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                {avatar
                    ? <img src={avatar} alt={name}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: `hsl(${name.charCodeAt(0) * 7 % 360},60%,50%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{initial}</span>
                      </div>
                }
                <div>
                    <p style={{ color: '#F1F2FF', fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{name}</p>
                    <p style={{ color: '#6B7280', fontSize: 11 }}>{review?.user?.accountType || 'Student'}</p>
                </div>
            </div>

            {/* Review text */}
            <p style={{ color: '#AFB2BF', fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>
                {text.length > 130 ? text.slice(0, 127) + '…' : text}
            </p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#E7C009', fontWeight: 700, fontSize: 13 }}>{rating.toFixed(1)}</span>
                <StarRating rating={rating} size={13} />
            </div>
        </div>
    );
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function Loader() {
    return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: 40, height: 40,
                border: '4px solid #2C3244', borderTop: '4px solid #FFD60A',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// ─── Purchase Card (sticky right) ─────────────────────────────────────────────
function PurchaseCard({ course, courseData, price, originalPrice, hasDiscount, thumbnail, title, INCLUDES }) {
    const [addedToCart, setAddedToCart] = useState(false);

    return (
        <div style={{
            width: 340,
            flexShrink: 0,
            position: 'sticky',
            top: 80,
            alignSelf: 'flex-start',
        }}>
            <div style={{
                background: '#161D29',
                border: '1px solid #2C3244',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            }}>
                {/* Thumbnail */}
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img
                        src={thumbnail}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Play overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)',
                        opacity: 0, transition: 'opacity 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: 'rgba(255,214,10,0.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 22px 24px' }}>
                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: '#F1F2FF', letterSpacing: -1 }}>
                            Rs. {Number(price).toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <>
                                <span style={{ fontSize: 16, color: '#6B7280', textDecoration: 'line-through' }}>
                                    Rs. {Number(originalPrice).toLocaleString()}
                                </span>
                                <span style={{
                                    fontSize: 12, fontWeight: 700, color: '#47A992',
                                    background: 'rgba(71,169,146,0.12)', padding: '2px 8px', borderRadius: 99,
                                }}>
                                    {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
                                </span>
                            </>
                        )}
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={() => setAddedToCart(true)}
                        style={{
                            width: '100%', padding: '13px', borderRadius: 6, border: 'none',
                            background: addedToCart ? '#47A992' : '#FFD60A',
                            color: addedToCart ? '#fff' : '#000',
                            fontWeight: 700, fontSize: 15, cursor: 'pointer',
                            marginBottom: 10, transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}
                    >
                        {addedToCart ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Added to Cart
                            </>
                        ) : 'Add to Cart'}
                    </button>

                    {/* Buy Now */}
                    <button
                        style={{
                            width: '100%', padding: '13px', borderRadius: 6,
                            border: '1px solid #2C3244', background: 'transparent',
                            color: '#F1F2FF', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                            marginBottom: 14, transition: 'background 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1C2333'; e.currentTarget.style.borderColor = '#AFB2BF'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#2C3244'; }}
                    >
                        Buy now
                    </button>

                    {/* Guarantee */}
                    <p style={{ color: '#6B7280', fontSize: 12, textAlign: 'center', marginBottom: 18 }}>
                        30-Day Money-Back Guarantee
                    </p>

                    {/* Includes */}
                    <p style={{ color: '#F1F2FF', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                        This course includes:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {INCLUDES.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                                <span style={{ color: '#47A992', fontSize: 13 }}>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Share */}
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        margin: '18px auto 0',
                        background: 'none', border: 'none', color: '#FFD60A',
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate     = useNavigate();

    const [course, setCourse]                   = useState(null);
    const [isLoading, setIsLoading]             = useState(true);
    const [error, setError]                     = useState(null);
    const [allSectionsOpen, setAllSectionsOpen] = useState(false);
    const [forceOpen, setForceOpen]             = useState(undefined);

    useEffect(() => {
        if (!courseId) return;
        let cancelled = false;
        const fetchCourse = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get(
                    `http://localhost:3000/api/v1/courses/getDetails/${courseId}`
                );
                if (!cancelled) setCourse(response.data?.data ?? response.data);
            } catch (err) {
                if (!cancelled) setError('Failed to load course. Please try again.');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        fetchCourse();
        return () => { cancelled = true; };
    }, [courseId]);

    // ── Derived ─────────────────────────────────────────────────────────────
    const courseData     = course?.course ?? {};
    const title          = courseData.courseName    || 'Course Title';
    const description    = courseData.description   || '';
    const instructorName = courseData.instructorName || 'Instructor Name';
    const instructorBio  = courseData.instructorBio  || '';
    const instructorImg  = courseData.instructorImg  || null;
    const price          = courseData.discountPrice ?? courseData.originalPrice ?? 1200;
    const originalPrice  = courseData.originalPrice ?? 0;
    const hasDiscount    = courseData.discountPrice > 0 && courseData.discountPrice < originalPrice;
    const thumbnail      = courseData.thumbnailUrl
        || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80';
    const language       = courseData.language    || 'English';
    const level          = courseData.level        || '';
    const tags           = courseData.tag          || [];
    const createdAt      = courseData.createdAt
        ? new Date(courseData.createdAt).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })
        : '02/2020';
    const studentsCount  = course?.enrollmentsCount ?? 332402;
    const reviews        = course?.reviews || [];
    const avgRating      = reviews.length
        ? reviews.reduce((a, r) => a + Number(r.rating), 0) / reviews.length
        : 4.5;
    const sections       = course?.sections || [];
    const totalLectures  = sections.reduce((a, s) => a + (s.subSectionCount ?? s.subSection?.length ?? 0), 0);

    const whatYouLearn = (() => {
        if (!courseData.whatYouLearn) return [
            'Introduction to Python and Python 3',
            'Understand the basics: Data types, Loops, Conditional statements, Functions and Modules',
            'Learn object oriented programming in Python',
            'Learn how to make your own web-scraping tool using Python',
            'Know how to Read and Parse JSON and XML files',
        ];
        if (Array.isArray(courseData.whatYouLearn)) return courseData.whatYouLearn;
        return courseData.whatYouLearn.split(/\\n|\n/).map(s => s.trim()).filter(Boolean);
    })();

    const INCLUDES = [
        { icon: '⏱️', text: `${courseData.totalDuration || '8'} hours on-demand video` },
        { icon: '♾️',  text: 'Full Lifetime access' },
        { icon: '📱', text: 'Access on Mobile and TV' },
        { icon: '🏆', text: 'Certificate of completion' },
    ];

    const handleToggleAllSections = () => {
        const next = !allSectionsOpen;
        setAllSectionsOpen(next);
        setForceOpen(next);
    };

    // ── Render ──────────────────────────────────────────────────────────────
    if (isLoading) return <Loader />;

    if (error) return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <p style={{ color: '#FC8181', fontSize: 15 }}>{error}</p>
            <button
                onClick={() => window.location.reload()}
                style={{
                    padding: '10px 28px', borderRadius: 6, border: 'none',
                    background: '#FFD60A', color: '#000', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}
            >Retry</button>
        </div>
    );

    return (
        <div style={{
            background: '#0A0F1C', minHeight: '100vh',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            color: '#F1F2FF',
        }}>

            <div style={{ background: '#161D29', borderBottom: '1px solid #2C3244' }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto',
                    padding: '28px 40px 36px',
                    display: 'flex',
                    gap: 40,
                    alignItems: 'flex-start',
                }}>

                    {/* ── Left col ── */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                        {/* Breadcrumb */}
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16, fontSize: 13 }}>
                            <span
                                style={{ color: '#AFB2BF', cursor: 'pointer' }}
                                onClick={() => navigate('/')}
                            >Home</span>
                            <span style={{ color: '#6B7280' }}>/</span>
                            <span
                                style={{ color: '#AFB2BF', cursor: 'pointer' }}
                                onClick={() => navigate(-1)}
                            >Learning</span>
                            <span style={{ color: '#6B7280' }}>/</span>
                            <span style={{ color: '#FFD60A', fontWeight: 600 }}>
                                {courseData.categoryId.name || 'Python'}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: 30, fontWeight: 800, color: '#F1F2FF',
                            lineHeight: 1.3, marginBottom: 14, letterSpacing: -0.3,
                        }}>
                            {title}
                        </h1>

                        {/* Description */}
                        <p style={{
                            color: '#AFB2BF', fontSize: 14, lineHeight: 1.7,
                            marginBottom: 16, maxWidth: 600,
                        }}>
                            {description}
                        </p>

                        {/* Rating row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                            <span style={{ color: '#E7C009', fontWeight: 800, fontSize: 15 }}>
                                {avgRating.toFixed(1)}
                            </span>
                            <StarRating rating={avgRating} size={15} />
                            <span style={{ color: '#AFB2BF', fontSize: 13 }}>
                                ({reviews.length.toLocaleString() || '650'} ratings)
                            </span>
                            <span style={{ color: '#6B7280', fontSize: 13 }}>·</span>
                            <span style={{ color: '#AFB2BF', fontSize: 13 }}>
                                {Number(studentsCount).toLocaleString()} students
                            </span>
                        </div>

                        {/* Instructor */}
                        <p style={{ color: '#AFB2BF', fontSize: 13, marginBottom: 12 }}>
                            Created by{' '}
                            <span style={{ color: '#FFD60A', fontWeight: 600, cursor: 'pointer' }}>
                                {instructorName}
                            </span>
                        </p>

                        {/* Meta row */}
                        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                            {createdAt && (
                                <span style={{ color: '#AFB2BF', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    Created at {createdAt}
                                </span>
                            )}
                            <span style={{ color: '#AFB2BF', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                                {language}
                            </span>
                            {level && (
                                <span style={{ color: '#AFB2BF', fontSize: 13 }}>📶 {level}</span>
                            )}
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                                {tags.map(tag => (
                                    <span key={tag} style={{
                                        fontSize: 12, padding: '3px 10px', borderRadius: 99,
                                        background: '#0A0F1C', border: '1px solid #2C3244',
                                        color: '#AFB2BF',
                                    }}>{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right col: Purchase card ── */}
                    <PurchaseCard
                        courseData={courseData}
                        price={price}
                        originalPrice={originalPrice}
                        hasDiscount={hasDiscount}
                        thumbnail={thumbnail}
                        title={title}
                        INCLUDES={INCLUDES}
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                BODY
            ═══════════════════════════════════════════════════════════════ */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 60px' }}>

                {/* ── What You'll Learn ── */}
                {whatYouLearn.length > 0 && (
                    <section style={{
                        border: '1px solid #2C3244', borderRadius: 10,
                        padding: '28px 32px', marginBottom: 48,
                        background: '#161D29',
                    }}>
                        <h2 style={{ color: '#F1F2FF', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                            What you'll learn
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px 40px',
                        }}>
                            {whatYouLearn.map((point, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="#47A992" strokeWidth="2.5"
                                        style={{ flexShrink: 0, marginTop: 3 }}>
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span style={{ color: '#AFB2BF', fontSize: 13.5, lineHeight: 1.6 }}>{point}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Course Content ── */}
                <section style={{ marginBottom: 52 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <h2 style={{ color: '#F1F2FF', fontSize: 20, fontWeight: 700 }}>Course content</h2>
                        <button
                            onClick={handleToggleAllSections}
                            style={{
                                background: 'none', border: 'none', color: '#FFD60A',
                                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                padding: '4px 0',
                            }}
                        >
                            {allSectionsOpen ? 'Collapse all sections' : 'Expand all sections'}
                        </button>
                    </div>

                    <p style={{ color: '#AFB2BF', fontSize: 13, marginBottom: 18 }}>
                        {sections.length} sections
                        {totalLectures > 0 ? ` • ${totalLectures} lectures` : ''}
                        {courseData.totalDuration ? ` • ${courseData.totalDuration} total length` : ''}
                    </p>

                    <div style={{
                        border: '1px solid #2C3244', borderRadius: 8, overflow: 'hidden',
                    }}>
                        {sections.length > 0
                            ? sections.map((section, i) => (
                                <AccordionSection
                                    key={section._id || i}
                                    section={{ ...section, defaultOpen: i === 0 }}
                                    forceOpen={forceOpen}
                                />
                            ))
                            : (
                                <div style={{ padding: '28px', color: '#6B7280', fontSize: 14, textAlign: 'center' }}>
                                    No course content available yet.
                                </div>
                            )
                        }
                    </div>
                </section>

                {/* ── Author ── */}
                <section style={{ marginBottom: 52 }}>
                    <h2 style={{ color: '#F1F2FF', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Author</h2>
                    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                        {instructorImg
                            ? <img src={instructorImg} alt={instructorName}
                                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                            : (
                                <div style={{
                                    width: 64, height: 64, borderRadius: '50%',
                                    background: `hsl(${instructorName.charCodeAt(0) * 7 % 360},55%,50%)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 22 }}>
                                        {instructorName.charAt(0)}
                                    </span>
                                </div>
                            )
                        }
                        <div>
                            <p style={{ color: '#F1F2FF', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                                {instructorName}
                            </p>
                            {instructorBio && (
                                <p style={{ color: '#AFB2BF', fontSize: 14, lineHeight: 1.7, maxWidth: 680 }}>
                                    {instructorBio}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Reviews ── */}
                {reviews.length > 0 && (
                    <section style={{ marginBottom: 40 }}>
                        <h2 style={{
                            color: '#F1F2FF', fontSize: 24, fontWeight: 700,
                            textAlign: 'center', marginBottom: 32,
                        }}>
                            Reviews from other learners
                        </h2>
                        <div style={{
                            display: 'flex', gap: 16,
                            overflowX: 'auto', paddingBottom: 10,
                            /* hide scrollbar */
                            scrollbarWidth: 'none', msOverflowStyle: 'none',
                        }}>
                            {reviews.map((review, i) => (
                                <ReviewCard key={review._id || i} review={review} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CourseDetail;