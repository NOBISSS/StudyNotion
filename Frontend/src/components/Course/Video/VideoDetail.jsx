// components/Video/VideoDetail.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../core/Navbar";
import Footer from "../core/Footer";
import { BACKEND_URL } from "../../utils/constants";
import { markSubSectionComplete, addCourseReview } from "../../services/operations/progressAPI";

// ─── API endpoints ────────────────────────────────────────────────────────────
const SECTIONS_API   = (courseId)      => `${BACKEND_URL}/sections/getall/${courseId}`;
const VIDEO_API      = (subSectionId)  => `${BACKEND_URL}/subsections/video/getone/${subSectionId}`;
const SUBSECTION_API = (subSectionId)  => `${BACKEND_URL}/subsections/getone/${subSectionId}`;

// ─── Star Rating (interactive) ────────────────────────────────────────────────
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
        >
          <svg width="26" height="26" viewBox="0 0 20 20"
            fill={(hover || value) >= s ? "#FFD60A" : "none"}
            stroke="#FFD60A" strokeWidth="1.5">
            <polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Add Review Modal ─────────────────────────────────────────────────────────
function ReviewModal({ courseId, user, token, onClose, onSaved }) {
  const [rating, setRating]     = useState(4);
  const [reviewText, setReview] = useState("");
  const [saving, setSaving]     = useState(false);

  const handleSave = async () => {
    if (!reviewText.trim()) return;
    setSaving(true);
    const result = await addCourseReview(token, courseId, rating, reviewText);
    setSaving(false);
    if (result) onSaved();
    onClose();
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#1F2937", borderRadius: 12,
          width: 420, maxWidth: "95vw",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 20px", borderBottom: "1px solid #2C333F",
        }}>
          <p style={{ color: "#F1F2FF", fontWeight: 700, fontSize: 16 }}>Add Review</p>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 20, lineHeight: 1 }}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 24px 20px" }}>
          {/* User info */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20, gap: 8 }}>
            {user?.image
              ? <img src={user.image} alt={user.firstName}
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
              : <div style={{
                  width: 48, height: 48, borderRadius: "50%", background: "#FFD60A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 18, color: "#000",
                }}>
                  {user?.firstName?.charAt(0).toUpperCase() || "U"}
                </div>
            }
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#F1F2FF", fontWeight: 600, fontSize: 14 }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ color: "#6B7280", fontSize: 12 }}>Posting Publicly</p>
            </div>
          </div>

          {/* Stars */}
          <div style={{ marginBottom: 20 }}>
            <StarInput value={rating} onChange={setRating} />
          </div>

          {/* Text */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "#AFB2BF", fontSize: 13, display: "block", marginBottom: 8 }}>
              Add Your Experience <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              value={reviewText}
              onChange={e => setReview(e.target.value)}
              placeholder="Share Details of your own experience for this course"
              rows={4}
              style={{
                width: "100%", background: "#2C333F", border: "1px solid #374151",
                borderRadius: 8, padding: "12px 14px",
                color: "#F1F2FF", fontSize: 13, lineHeight: 1.6,
                resize: "vertical", outline: "none", fontFamily: "inherit",
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 22px", borderRadius: 6,
                border: "1px solid #374151", background: "transparent",
                color: "#AFB2BF", fontSize: 14, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving || !reviewText.trim()}
              style={{
                padding: "9px 22px", borderRadius: 6, border: "none",
                background: saving || !reviewText.trim() ? "#9CA3AF" : "#FFD60A",
                color: "#000", fontWeight: 700, fontSize: 14,
                cursor: saving || !reviewText.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >{saving ? "Saving..." : "Save Edits"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Section Accordion ────────────────────────────────────────────────
function SidebarSection({ section, activeSubId, completedIds, onSelectSub, isFirst }) {
  const [open, setOpen] = useState(isFirst);
  const subSections     = section.subSections || [];

  return (
    <div style={{ borderBottom: "1px solid #1C2333" }}>
      {/* Section header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 16px", cursor: "pointer", userSelect: "none",
          background: "#161D29",
        }}
      >
        <span style={{ color: "#F1F2FF", fontWeight: 600, fontSize: 13 }}>
          {section.name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#6B7280", fontSize: 11, whiteSpace: "nowrap" }}>
            {section.totalDuration || `${subSections.length * 5}min`}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Subsection list */}
      {open && (
        <div style={{ background: "#0D1117" }}>
          {subSections.map((sub) => {
            const isActive    = sub._id === activeSubId;
            const isCompleted = completedIds.has(sub._id);
            return (
              <div
                key={sub._id}
                onClick={() => onSelectSub(sub)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 16px 9px 12px", cursor: "pointer",
                  background: isActive ? "rgba(6,182,212,0.12)" : "transparent",
                  borderLeft: isActive ? "3px solid #06B6D4" : "3px solid transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 15, height: 15, borderRadius: 3, flexShrink: 0,
                  border: `1.5px solid ${isCompleted ? "#06B6D4" : "#374151"}`,
                  background: isCompleted ? "#06B6D4" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isCompleted && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <span style={{
                  color: isActive ? "#F1F2FF" : "#AFB2BF",
                  fontSize: 12, lineHeight: 1.4, flex: 1,
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {sub.title || sub.subSectionName}
                </span>

                {/* Video icon */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={isActive ? "#06B6D4" : "#374151"} strokeWidth="1.8" style={{ flexShrink: 0 }}>
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VideoDetail() {
  const { courseId, subSectionId: paramSubId } = useParams();
  const navigate  = useNavigate();
  const { token } = useSelector(state => state.auth);
  const { user }  = useSelector(state => state.profile);

  // ── State ─────────────────────────────────────────────────────────────────
  const [sections, setSections]         = useState([]);       // all sections with subSections[]
  const [activeSub, setActiveSub]       = useState(null);     // current subsection object
  const [videoUrl, setVideoUrl]         = useState(null);     // presigned S3 URL
  const [completedIds, setCompletedIds] = useState(new Set());// set of completed subSection IDs
  const [totalSubs, setTotalSubs]       = useState(0);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [courseName, setCourseName]     = useState("Course");
  const videoRef = useRef(null);
  const progressMarked = useRef(new Set()); // avoid double-marking per session

  // ── 1. Fetch all sections + subsections for this course ───────────────────
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    const load = async () => {
      setLoadingSections(true);
      try {
        const res = await axios.get(SECTIONS_API(courseId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;

        // Expected: { data: { sections: [ { _id, name, order, totalDuration,
        //   subSections: [{ _id, title, timeDuration, description, completedByUser }] } ] } }
        const raw      = res.data?.data ?? res.data;
        const secs     = raw?.sections ?? raw ?? [];
        const sortedSecs = [...secs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setSections(sortedSecs);

        // Derive course name (may come from res.data.data.courseName)
        if (raw?.courseName) setCourseName(raw.courseName);

        // Count total subs + build completed set from backend flags
        let total = 0;
        const doneSet = new Set();
        sortedSecs.forEach(sec => {
          (sec.subSections || []).forEach(sub => {
            total++;
            if (sub.completedByUser) doneSet.add(sub._id);
          });
        });
        setTotalSubs(total);
        setCompletedIds(doneSet);

        // Auto-select: URL param first, then first subsection
        const allSubs = sortedSecs.flatMap(s => s.subSections || []);
        const target  = paramSubId
          ? allSubs.find(s => s._id === paramSubId) ?? allSubs[0]
          : allSubs[0];
        if (target) selectSubSection(target);
      } catch (err) {
        console.error("SECTIONS FETCH ERROR:", err);
      } finally {
        if (!cancelled) setLoadingSections(false);
      }
    };

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // ── 2. Fetch video URL for a subsection ───────────────────────────────────
  const selectSubSection = useCallback(async (sub) => {
    setActiveSub(sub);
    setVideoUrl(null);
    setLoadingVideo(true);

    // Update URL without full navigation
    navigate(`/courses/${courseId}/learn/${sub._id}`, { replace: true });

    try {
      const res = await axios.get(VIDEO_API(sub._id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = res.data?.data?.link ?? res.data?.link ?? res.data?.video?.link ?? null;
      setVideoUrl(url);
    } catch (err) {
      console.error("VIDEO FETCH ERROR:", err);
      setVideoUrl(null);
    } finally {
      setLoadingVideo(false);
    }
  }, [courseId, navigate, token]);

  // ── 3. Mark progress when video ends ─────────────────────────────────────
  const handleVideoEnded = useCallback(async () => {
    if (!activeSub || progressMarked.current.has(activeSub._id)) return;
    progressMarked.current.add(activeSub._id);

    // Optimistically update UI
    setCompletedIds(prev => new Set([...prev, activeSub._id]));

    // Call API
    await markSubSectionComplete(token, courseId, activeSub._id);

    // Auto-advance to next subsection
    const allSubs = sections.flatMap(s => s.subSections || []);
    const idx     = allSubs.findIndex(s => s._id === activeSub._id);
    if (idx >= 0 && idx < allSubs.length - 1) {
      selectSubSection(allSubs[idx + 1]);
    }
  }, [activeSub, token, courseId, sections, selectSubSection]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const completedCount = completedIds.size;
  const allDone        = totalSubs > 0 && completedCount >= totalSubs;

  // Format date
  const dateStr = activeSub?.createdAt
    ? new Date(activeSub.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#0A0F1C", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>

        {/* ══════════════════════════════════════════════════════════════════
            LEFT SIDEBAR
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          width: 185, flexShrink: 0,
          background: "#161D29",
          borderRight: "1px solid #1C2333",
          height: "calc(100vh - 56px)",
          position: "sticky", top: 56,
          overflowY: "auto",
          display: "flex", flexDirection: "column",
          // Custom scrollbar
          scrollbarWidth: "thin",
          scrollbarColor: "#2C333F #161D29",
        }}>

          {/* Course title + progress */}
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #1C2333" }}>
            <p style={{ color: "#F1F2FF", fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.4 }}>
              Learn {courseName}
            </p>
            <p style={{
              fontSize: 11, fontWeight: 600,
              color: allDone ? "#06B6D4" : "#6B7280",
            }}>
              {completedCount}/{totalSubs}
            </p>
          </div>

          {/* Add Review button — only when all done */}
          {allDone && (
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #1C2333" }}>
              <button
                onClick={() => setShowReviewModal(true)}
                style={{
                  width: "100%", padding: "8px 0",
                  background: "#FFD60A", color: "#000",
                  fontWeight: 700, fontSize: 13, borderRadius: 6,
                  border: "none", cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5cc00"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFD60A"}
              >
                Add Review
              </button>
            </div>
          )}

          {/* Sections */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loadingSections ? (
              // Skeleton
              <div style={{ padding: "12px 16px" }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ height: 13, borderRadius: 4, background: "#1C2333", marginBottom: 8, width: "70%" }} />
                    {[1, 2, 3].map(j => (
                      <div key={j} style={{ height: 10, borderRadius: 3, background: "#161D29", marginBottom: 6, marginLeft: 8, width: "85%" }} />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              sections.map((section, i) => (
                <SidebarSection
                  key={section._id || i}
                  section={section}
                  activeSubId={activeSub?._id}
                  completedIds={completedIds}
                  onSelectSub={selectSubSection}
                  isFirst={i === 0}
                />
              ))
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT CONTENT AREA
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>

          {/* Video Player */}
          <div style={{
            background: "#000",
            width: "100%",
            aspectRatio: "16/9",
            position: "relative",
            maxHeight: "calc(100vh - 56px - 200px)",
          }}>
            {loadingVideo ? (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#000",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "4px solid #2C3244", borderTop: "4px solid #FFD60A",
                  animation: "spin 0.8s linear infinite",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : videoUrl ? (
              <video
                ref={videoRef}
                key={videoUrl}           /* remount on URL change */
                controls
                preload="metadata"
                onEnded={handleVideoEnded}
                style={{ width: "100%", height: "100%", display: "block", background: "#000" }}
              >
                <source src={videoUrl} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "#0D1117", gap: 12,
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10,8 16,12 10,16" fill="#374151" stroke="none" />
                </svg>
                <p style={{ color: "#6B7280", fontSize: 13 }}>
                  {activeSub ? "Video unavailable" : "Select a lecture to start watching"}
                </p>
              </div>
            )}
          </div>

          {/* Subsection info */}
          <div style={{ padding: "20px 28px 32px", flex: 1 }}>
            {activeSub ? (
              <>
                <h2 style={{ color: "#F1F2FF", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                  {activeSub.title || activeSub.subSectionName}
                </h2>

                {/* Description lines */}
                {activeSub.description && (
                  <div style={{ marginBottom: 12 }}>
                    {activeSub.description.split("\n").filter(Boolean).map((line, i) => (
                      <p key={i} style={{ color: "#AFB2BF", fontSize: 13, lineHeight: 1.7, marginBottom: 2 }}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                {/* Date */}
                {dateStr && (
                  <p style={{ color: "#6B7280", fontSize: 13, marginTop: 8 }}>{dateStr}</p>
                )}
              </>
            ) : (
              <p style={{ color: "#6B7280", fontSize: 14 }}>Select a lecture from the sidebar to begin.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Add Review Modal ── */}
      {showReviewModal && (
        <ReviewModal
          courseId={courseId}
          user={user}
          token={token}
          onClose={() => setShowReviewModal(false)}
          onSaved={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}