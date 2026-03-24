import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { BACKEND_URL } from '../../utils/constants';

// ─── Navbar ───────────────────────────────────────────────────────────────────
const NAV_LINKS = ['Home', 'Catalog', 'About us', 'Contact us'];

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav style={{
            background: '#161D29', borderBottom: '1px solid #2C3244',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 40px', height: 60, position: 'sticky', top: 0, zIndex: 100,
        }}>
            <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <div style={{
                    width: 28, height: 28, background: '#FFD60A', borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: '#000' }}>S</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: 18, color: '#F1F2FF', letterSpacing: -0.5 }}>StudyNotion</span>
            </div>

            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
                {NAV_LINKS.map((l) => (
                    <span key={l} style={{
                        color: l === 'Catalog' ? '#FFD60A' : '#AFB2BF',
                        fontWeight: l === 'Catalog' ? 600 : 400,
                        fontSize: 14, cursor: 'pointer',
                        borderBottom: l === 'Catalog' ? '2px solid #FFD60A' : '2px solid transparent',
                        paddingBottom: 2,
                    }}>{l}{l === 'Catalog' ? ' ▾' : ''}</span>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AFB2BF' }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AFB2BF' }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                </button>
                <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: '#FFD60A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>U</span>
                </div>
            </div>
        </nav>
    );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating = 4.5, size = 14 }) {
    // Clamp rating to [0, 5]
    const clamped = Math.min(5, Math.max(0, rating));
    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => {
                const filled = clamped >= s;
                const half   = !filled && clamped >= s - 0.5;
                // Use a unique gradient id per star to avoid SVG id collisions in the DOM
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
// BUG FIX: Previously, the `defaultOpen` prop was used as the initial value of
// local state, but re-renders from `allSectionsOpen` toggle never propagated
// because useState ignores prop changes after mount.
// Fix: use an imperative ref approach — expose a controlled `open` prop and
// keep a local "manual override" so individual sections can still be toggled.
function AccordionSection({ section, forceOpen }) {
    // manualOverride tracks if user has clicked this specific section header
    const manualOverride = useRef(null); // null | true | false
    const [localOpen, setLocalOpen] = useState(section.defaultOpen || false);

    // Sync to forceOpen when it changes, but only if user hasn't manually overridden
    useEffect(() => {
        if (forceOpen !== undefined) {
            manualOverride.current = null; // reset override when global toggle fires
            setLocalOpen(forceOpen);
        }
    }, [forceOpen]);

    const handleToggle = () => {
        manualOverride.current = !localOpen;
        setLocalOpen(!localOpen);
    };

    const open = localOpen;

    return (
        <div style={{ borderBottom: '1px solid #2C3244' }}>
            <div
                onClick={handleToggle}
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', cursor: 'pointer',
                    background: open ? '#1e2535' : '#1A2130',
                    transition: 'background 0.2s',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                        color: '#AFB2BF', fontSize: 13, display: 'inline-block',
                        transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s',
                    }}>∧</span>
                    <span style={{ color: '#F1F2FF', fontWeight: 600, fontSize: 14 }}>
                        {section.sectionName || section.name}
                    </span>
                </div>
                <span style={{ color: '#FFD60A', fontSize: 12, fontWeight: 500 }}>
                    {section.subSection?.length || 0} lectures &nbsp; {section.totalDuration || ''}
                </span>
            </div>

            {open && (
                <div style={{ background: '#0F1624' }}>
                    {(section.subSection || []).map((lecture, i) => (
                        <div key={lecture._id || i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                            padding: '10px 16px 10px 40px',
                            borderBottom: '1px solid #1e2535',
                        }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="#AFB2BF" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                    <polyline points="8 21 12 17 16 21" />
                                </svg>
                                <div>
                                    <p style={{ color: '#F1F2FF', fontSize: 13, marginBottom: lecture.description ? 4 : 0 }}>
                                        {lecture.title || lecture.subSectionName}
                                    </p>
                                    {lecture.description && (
                                        <p style={{ color: '#AFB2BF', fontSize: 12, lineHeight: 1.5 }}>
                                            {lecture.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span style={{ color: '#AFB2BF', fontSize: 12, flexShrink: 0, marginLeft: 16 }}>
                                {lecture.timeDuration || ''}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
    const name = review?.user?.firstName
        ? `${review.user.firstName} ${review.user.lastName}`
        : review?.name || 'Student';
    const initial = name.charAt(0).toUpperCase();
    const avatar  = review?.user?.image || null;
    const text    = review?.review || review?.comment || 'Great course!';
    const rating  = Number(review?.rating) || 4.5; // ensure number

    return (
        <div style={{
            background: '#1A2130', border: '1px solid #2C3244', borderRadius: 10,
            padding: '18px 16px', minWidth: 220, maxWidth: 280, flex: '0 0 auto',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                {avatar
                    ? <img src={avatar} alt={name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                    : <div style={{
                          width: 38, height: 38, borderRadius: '50%', background: '#FFD60A',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                          <span style={{ fontWeight: 700, color: '#000', fontSize: 15 }}>{initial}</span>
                      </div>
                }
                <div>
                    <p style={{ color: '#F1F2FF', fontWeight: 600, fontSize: 13 }}>{name}</p>
                    <p style={{ color: '#AFB2BF', fontSize: 11 }}>{review?.user?.accountType || 'Student'}</p>
                </div>
            </div>
            <p style={{ color: '#AFB2BF', fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
                {text.length > 120 ? text.slice(0, 117) + '…' : text}
            </p>
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
                width: 40, height: 40, border: '4px solid #2C3244',
                borderTop: '4px solid #FFD60A', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate     = useNavigate();
    const [course, setCourse]             = useState(null);
    const [isLoading, setIsLoading]       = useState(true);
    const [error, setError]               = useState(null);
    const [allSectionsOpen, setAllSectionsOpen] = useState(false);
    // forceOpen cycles through undefined → true → false to let AccordionSection
    // detect the change even when toggling in the same direction twice
    const [forceOpen, setForceOpen]       = useState(undefined);
    const [addedToCart, setAddedToCart]   = useState(false);

    useEffect(() => {
        if (!courseId) return;
        let cancelled = false;

        const fetchCourse = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get(
                    BACKEND_URL+'/courses/getdetails/'+courseId
                );
                if (!cancelled) {
                    setCourse(response.data?.data ?? response.data?.course ?? response.data);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to load course:', err);
                    setError('Failed to load course. Please try again.');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchCourse();
        // Cleanup: ignore response if component unmounts before fetch completes
        return () => { cancelled = true; };
    }, [courseId]);

    // ── Derived values ──────────────────────────────────────────────────────
    const title           = course?.courseName || course?.title || 'Course Title';
    const description     = course?.courseDescription || course?.description || '';
    const instructor      = course?.instructor;
    const instructorName  = instructor?.firstName
        ? `${instructor.firstName} ${instructor.lastName}`
        : 'Instructor Name';
    const instructorBio   = instructor?.additionalDetails?.about || '';
    const instructorImg   = instructor?.image || null;
    const price           = course?.price ?? 1200;
    const thumbnail       = course?.thumbnail
        || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80';
    const language        = course?.language || 'English';
    const createdAt       = course?.createdAt
        ? new Date(course.createdAt).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })
        : '';
    const studentsCount   = course?.studentsEnrolled?.length ?? course?.studentsCount ?? 0;
    const reviews         = course?.ratingAndReviews || [];

    // Keep avgRating as a number throughout — no premature .toFixed() here
    const avgRating = reviews.length
        ? reviews.reduce((a, r) => a + Number(r.rating), 0) / reviews.length
        : Number(course?.rating) || 4.5;

    const sections      = course?.courseContent || course?.sections || [];
    const totalLectures = sections.reduce((a, s) => a + (s.subSection?.length || 0), 0);

    // Handle both array and newline-separated string; trim each entry
    const whatYouLearn = (() => {
        if (!course?.whatYouLearn) return [
            'Introduction to the subject and core concepts',
            'Understand the basics: Data types, Loops, Conditional statements, Functions and Modules',
            'Learn object oriented programming',
            'Build real-world projects from scratch',
            'Know how to Read and Parse JSON and XML files',
        ];
        if (Array.isArray(course.whatYouLearn)) return course.whatYouLearn;
        return course.whatYouLearn
            .split(/\\n|\n/)    // handle both escaped \n and real newlines
            .map((s) => s.trim())
            .filter(Boolean);
    })();

    const INCLUDES = [
        { icon: '🕐', color: '#47A992', text: `${course?.totalDuration || '8'} hours on-demand video` },
        { icon: '♾️',  color: '#47A992', text: 'Full Lifetime access' },
        { icon: '📱', color: '#47A992', text: 'Access on Mobile and TV' },
        { icon: '🏆', color: '#47A992', text: 'Certificate of completion' },
    ];

    const handleToggleAllSections = () => {
        const next = !allSectionsOpen;
        setAllSectionsOpen(next);
        setForceOpen(next);
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div style={{ background: '#0A0F1C', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#F1F2FF' }}>
            {/* <Navbar /> */}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                    <p style={{ color: '#FC8181', fontSize: 15 }}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 24px', borderRadius: 6, border: 'none',
                            background: '#FFD60A', color: '#000', fontWeight: 700,
                            fontSize: 14, cursor: 'pointer',
                        }}
                    >Retry</button>
                </div>
            ) : (
                <>
                    {/* ── HERO ───────────────────────────────────────────── */}
                    <div style={{ background: '#161D29', borderBottom: '1px solid #2C3244', padding: '28px 40px 32px' }}>
                        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 40, alignItems: 'flex-start' }}>

                            {/* Left: Course Info */}
                            <div style={{ flex: 1 }}>
                                {/* Breadcrumb */}
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, fontSize: 13, color: '#AFB2BF' }}>
                                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
                                    <span>/</span>
                                    <span style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>Learning</span>
                                    <span>/</span>
                                    <span style={{ color: '#FFD60A', fontWeight: 600 }}>
                                        {course?.category?.name || 'Course'}
                                    </span>
                                </div>

                                <h1 style={{ fontSize: 30, fontWeight: 800, color: '#F1F2FF', marginBottom: 12, lineHeight: 1.3 }}>
                                    {title}
                                </h1>
                                <p style={{ color: '#AFB2BF', fontSize: 14, lineHeight: 1.7, marginBottom: 14, maxWidth: 640 }}>
                                    {description}
                                </p>

                                {/* Rating row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                                    <span style={{ color: '#E7C009', fontWeight: 700, fontSize: 15 }}>
                                        {avgRating.toFixed(1)}
                                    </span>
                                    <StarRating rating={avgRating} size={15} />
                                    <span style={{ color: '#AFB2BF', fontSize: 13 }}>
                                        ({reviews.length.toLocaleString()} ratings)
                                    </span>
                                    <span style={{ color: '#AFB2BF', fontSize: 13 }}>
                                        {studentsCount.toLocaleString()} students
                                    </span>
                                </div>

                                <p style={{ color: '#AFB2BF', fontSize: 13, marginBottom: 6 }}>
                                    Created by{' '}
                                    <span style={{ color: '#FFD60A', fontWeight: 600 }}>{instructorName}</span>
                                </p>

                                <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {createdAt && (
                                        <span style={{ color: '#AFB2BF', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AFB2BF" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            Created {createdAt}
                                        </span>
                                    )}
                                    <span style={{ color: '#AFB2BF', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AFB2BF" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                        {language}
                                    </span>
                                </div>
                            </div>

                            {/* Right: Purchase Card */}
                            <div style={{
                                width: 320, flexShrink: 0,
                                background: '#1A2130', border: '1px solid #2C3244',
                                borderRadius: 12, overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            }}>
                                <img src={thumbnail} alt={title}
                                    style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                                <div style={{ padding: '20px 20px 24px' }}>
                                    <p style={{ fontSize: 26, fontWeight: 800, color: '#F1F2FF', marginBottom: 16 }}>
                                        Rs. {Number(price).toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() => setAddedToCart(true)}
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: 6, border: 'none',
                                            background: addedToCart ? '#47A992' : '#FFD60A',
                                            color: addedToCart ? '#fff' : '#000',
                                            fontWeight: 700, fontSize: 15, cursor: 'pointer',
                                            marginBottom: 10, transition: 'all 0.2s',
                                        }}
                                    >
                                        {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                                    </button>
                                    <button
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: 6,
                                            border: '1px solid #2C3244', background: '#0F1624',
                                            color: '#F1F2FF', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                                            marginBottom: 14, transition: 'background 0.2s',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#1e2535')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = '#0F1624')}
                                    >
                                        Buy now
                                    </button>

                                    <p style={{ color: '#AFB2BF', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
                                        30-Day Money-Back Guarantee
                                    </p>

                                    <p style={{ color: '#F1F2FF', fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
                                        This course includes:
                                    </p>
                                    {INCLUDES.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                            <span style={{ fontSize: 14 }}>{item.icon}</span>
                                            <span style={{ color: item.color, fontSize: 13 }}>{item.text}</span>
                                        </div>
                                    ))}

                                    <button style={{
                                        display: 'block', margin: '16px auto 0', background: 'none',
                                        border: 'none', color: '#FFD60A', fontWeight: 600, fontSize: 13,
                                        cursor: 'pointer', textDecoration: 'underline',
                                    }}>Share</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── BODY ───────────────────────────────────────────── */}
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px' }}>

                        {/* What You'll Learn */}
                        <section style={{
                            border: '1px solid #2C3244', borderRadius: 10,
                            padding: '28px', marginBottom: 48, background: '#161D29',
                        }}>
                            <h2 style={{ color: '#F1F2FF', fontSize: 20, fontWeight: 700, marginBottom: 18 }}>
                                What you'll learn
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px' }}>
                                {whatYouLearn.map((point, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="#47A992" strokeWidth="2.5"
                                            style={{ flexShrink: 0, marginTop: 2 }}>
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span style={{ color: '#AFB2BF', fontSize: 13, lineHeight: 1.6 }}>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Course Content */}
                        <section style={{ marginBottom: 48 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <h2 style={{ color: '#F1F2FF', fontSize: 20, fontWeight: 700 }}>Course content</h2>
                                <button
                                    onClick={handleToggleAllSections}
                                    style={{
                                        background: 'none', border: 'none', color: '#FFD60A',
                                        fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    {allSectionsOpen ? 'Collapse all sections' : 'Expand all sections'}
                                </button>
                            </div>
                            <p style={{ color: '#AFB2BF', fontSize: 13, marginBottom: 16 }}>
                                {sections.length} sections • {totalLectures} lectures
                                {course?.totalDuration ? ` • ${course.totalDuration} total length` : ''}
                            </p>
                            <div style={{ border: '1px solid #2C3244', borderRadius: 8, overflow: 'hidden' }}>
                                {sections.length > 0
                                    ? sections.map((section, i) => (
                                        <AccordionSection
                                            key={section._id || i}
                                            section={{ ...section, defaultOpen: i === 0 }}
                                            forceOpen={forceOpen}
                                        />
                                    ))
                                    : (
                                        <div style={{ padding: 24, color: '#AFB2BF', fontSize: 14, textAlign: 'center' }}>
                                            No course content available yet.
                                        </div>
                                    )
                                }
                            </div>
                        </section>

                        {/* Author */}
                        <section style={{ marginBottom: 48 }}>
                            <h2 style={{ color: '#F1F2FF', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Author</h2>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                {instructorImg
                                    ? <img src={instructorImg} alt={instructorName}
                                          style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                    : <div style={{
                                          width: 60, height: 60, borderRadius: '50%', background: '#FFD60A',
                                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                      }}>
                                          <span style={{ fontWeight: 700, color: '#000', fontSize: 22 }}>
                                              {instructorName.charAt(0)}
                                          </span>
                                      </div>
                                }
                                <div>
                                    <p style={{ color: '#F1F2FF', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                                        {instructorName}
                                    </p>
                                    {instructorBio && (
                                        <p style={{ color: '#AFB2BF', fontSize: 13, lineHeight: 1.7, maxWidth: 680 }}>
                                            {instructorBio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <section style={{ marginBottom: 48 }}>
                                <h2 style={{ color: '#F1F2FF', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 28 }}>
                                    Reviews from other learners
                                </h2>
                                <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                                    {reviews.map((review, i) => (
                                        <ReviewCard key={review._id || i} review={review} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </>
            )}
            <Footer />
        </div>
    );
};

export default CourseDetail;