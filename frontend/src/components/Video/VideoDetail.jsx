// components/Video/VideoDetail.jsx
//
// Route (standalone, NOT inside Dashboard):
//   /courses/:courseId/learn
//   /courses/:courseId/learn/:subSectionId
//
// Data flow:
//   1. Mount → GET /courses/getdetails/:courseId  → get course + sections[]
//   2. Click section accordion → GET /subsections/getall/:sectionId  (lazy, cached)
//   3. Click subsection → GET /subsections/video/getone/:subSectionId → video URL
//   4. Video ends → (progress ignored for now per instructions)
//   5. All done → "Add Review" appears → modal → POST /reviews/add

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Footer from "../core/Footer";
import { addCourseReview } from "../../services/operations/progressAPI";
import PlyrPlayer from "./PlyrPlayer";
import { BACKEND_URL } from "../../utils/constants";
import { getCourseProgress } from "../../services/operations/courseDetailsAPI";
import { markSubsectionAsCompleted } from "../../services/operations/subsectionAPI";
import toast from "react-hot-toast";


const COURSE_DETAIL_API = (id) => `${BACKEND_URL}/courses/getdetails/${id}`;
const SUBSECTIONS_API = (id) => `${BACKEND_URL}/subsections/getall/${id}`;
const VIDEO_API = (id) => `${BACKEND_URL}/subsections/video/getone/${id}`;

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
        >
          <svg width="28" height="28" viewBox="0 0 20 20"
            fill={(hover || value) >= s ? "#FFD60A" : "none"}
            stroke="#FFD60A" strokeWidth="1.5">
            <polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ courseId, user, token, onClose }) {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!review.trim()) return;
    setSaving(true);
    const data=await addCourseReview(token, courseId, rating, review);
    console.log(data);
    setSaving(false);
    data && onClose();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: "#1F2937", borderRadius: 12, width: 440, maxWidth: "95vw",
        boxShadow: "0 24px 64px rgba(0,0,0,0.7)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 22px", borderBottom: "1px solid #2C333F",
        }}>
          <p style={{ color: "#F1F2FF", fontWeight: 700, fontSize: 16 }}>Add Review</p>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#6B7280", fontSize: 22, lineHeight: 1,
            transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#F1F2FF"}
            onMouseLeave={e => e.currentTarget.style.color = "#6B7280"}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 24px 22px" }}>
          {/* User info */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 20 }}>
            {user?.additionalDetails?.profilePicture
              ? <img src={user.additionalDetails.profilePicture} alt={user.firstName}
                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
              : <div style={{
                width: 48, height: 48, borderRadius: "50%", background: "#FFD60A",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 20, color: "#000",
              }}>
                {user?.firstName?.charAt(0).toUpperCase() || "U"}
              </div>
            }
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#F1F2FF", fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ color: "#6B7280", fontSize: 12 }}>Posting Publicly</p>
            </div>
          </div>

          {/* Stars */}
          <div style={{ marginBottom: 20 }}>
            <StarInput value={rating} onChange={setRating} />
          </div>

          {/* Textarea */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: "#AFB2BF", fontSize: 13, display: "block", marginBottom: 8 }}>
              Add Your Experience <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Share Details of your own experience for this course"
              rows={4}
              style={{
                width: "100%", background: "#2C333F",
                border: "1px solid #374151", borderRadius: 8,
                padding: "12px 14px", color: "#F1F2FF",
                fontSize: 13, lineHeight: 1.6, resize: "vertical",
                outline: "none", fontFamily: "inherit",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#FFD60A"}
              onBlur={e => e.currentTarget.style.borderColor = "#374151"}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={onClose} style={{
              padding: "9px 22px", borderRadius: 6,
              border: "1px solid #374151", background: "transparent",
              color: "#AFB2BF", fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#AFB2BF"; e.currentTarget.style.color = "#F1F2FF"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#AFB2BF"; }}
            >Cancel</button>
            <button onClick={handleSave}
              disabled={saving || !review.trim()}
              style={{
                padding: "9px 22px", borderRadius: 6, border: "none",
                background: saving || !review.trim() ? "#9CA3AF" : "#FFD60A",
                color: "#000", fontWeight: 700, fontSize: 14,
                cursor: saving || !review.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >{saving ? "Saving..." : "Save Edits"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Section (lazy subsection fetch, cached) ─────────────────────────
function SidebarSection({ section, activeSubId, completedIds, setCompletedIds, onSelectSub, defaultOpen, token }) {
  const [open, setOpen] = useState(defaultOpen);
  const [subs, setSubs] = useState(null);   // null = not yet fetched
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);     // cache flag — never re-fetches

  const toggle = () => setOpen(o => !o);
  const markAsCompleted = async (subsectionId) => {
    const res = await markSubsectionAsCompleted(subsectionId);
    if (res) {
      if(completedIds.has(subsectionId)){ 
        setCompletedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(subsectionId);
        return newSet;
      });
      toast.success("Subsection marked as incomplete");
    }
      else{
      setCompletedIds(prev => new Set([...prev, subsectionId]));
      toast.success("Subsection marked as completed");
    }
    }
  }
  // Lazy fetch: only on first open, never again
  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(SUBSECTIONS_API(section._id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        // Response: { data: { subsections: [...] } }
        const data = res.data?.data ?? res.data;
        setSubs(Array.isArray(data?.subsections) ? data.subsections : []);
      } catch (err) {
        console.error("SUBSECTIONS FETCH ERROR:", err);
        setSubs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [open, section._id, token]);
  // useEffect(() => {
  //   const setProgress = async () => {
  //     const res = await getCourseProgress(section.courseId);
  //     setCompletedIds(new Set(res?.courseProgress?.completedSubsections || []));
  //   };
  //   setProgress();
  // }, []);

  // Count to show in header (use subSectionIds length before fetch)
  const subsCount = subs !== null ? subs.length : (section.subSectionIds?.length ?? 0);

  return (
    <div style={{ borderBottom: "1px solid #1C2333" }}>
      {/* Section header */}
      <div
        onClick={toggle}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 14px", cursor: "pointer", userSelect: "none",
          background: "#161D29", transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#1A2233"}
        onMouseLeave={e => e.currentTarget.style.background = "#161D29"}
      >
        <span style={{
          color: "#F1F2FF", fontWeight: 600,
          fontSize: 12.5, lineHeight: 1.4,
          flex: 1, paddingRight: 6,
        }}>
          {section.name || section.sectionName}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {/* <span style={{ color: "#6B7280", fontSize: 10.5, whiteSpace: "nowrap" }}>
            {subsCount > 0 ? `${subsCount * 5}min` : ""}
          </span> */}
          {/* Chevron */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Subsections */}
      {open && (
        <div style={{ background: "#0D1117" }}>
          {/* Loading skeleton */}
          {loading && (
            <div style={{ padding: "10px 14px" }}>
              {[75, 88, 62].map((w, i) => (
                <div key={i} style={{
                  height: 10, borderRadius: 3, marginBottom: 8,
                  width: `${w}%`, background: "#1C2333",
                }} />
              ))}
            </div>
          )}

          {/* Subsection rows */}
          {!loading && subs?.map((sub) => {
            const isActive = sub._id === activeSubId;
            const isCompleted = completedIds.has(sub._id);
            return (
              <div
                key={sub._id}
                onClick={(e) => {
                  if(e.target.className.includes("checkbox"))
                    return;
                  onSelectSub(sub)
                }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 9,
                  padding: "9px 14px 9px 10px", cursor: "pointer",
                  background: isActive ? "rgba(6,182,212,0.1)" : "transparent",
                  borderLeft: `3px solid ${isActive ? "#06B6D4" : "transparent"}`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 14, height: 14, borderRadius: 3, flexShrink: 0, marginTop: 1,
                  border: `1.5px solid ${isCompleted ? "#06B6D4" : "#374151"}`,
                  background: isCompleted ? "#06B6D4" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                className="checkbox"
                onClick={()=>markAsCompleted(sub._id)}
                >
                  {isCompleted && (
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" className="checkbox">
                      <polyline points="2,6 5,9 10,3" className="checkbox" />
                    </svg>
                  )}
                </div>

                <span style={{
                  color: isActive ? "#F1F2FF" : "#9CA3AF",
                  fontSize: 12, lineHeight: 1.4, flex: 1,
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {sub.title || sub.subSectionName || "Untitled"}
                </span>

                {/* Video icon */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={isActive ? "#06B6D4" : "#374151"} strokeWidth="1.8"
                  style={{ flexShrink: 0, marginTop: 1 }}>
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
            );
          })}

          {/* Empty */}
          {!loading && subs?.length === 0 && (
            <p style={{ padding: "10px 14px 10px 24px", color: "#4B5563", fontSize: 11 }}>
              No lectures yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VideoDetail() {
  const { courseId, subSectionId: paramSubId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [completedIds,setCompletedIds] = useState(new Set()); // future: load from backend
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalSubs, setTotalSubs] = useState(0);

  // ── 1. Fetch course details (sections come with it) ───────────────────────
  useEffect(() => {
    if (!courseId || !token) return;
    let cancelled = false;

    const load = async () => {
      setLoadingCourse(true);
      try {
        const res = await axios.get(COURSE_DETAIL_API(courseId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;

        const data = res.data?.data ?? res.data;
        const courseObj = data?.course ?? {};
        const secs = data?.sections ?? [];

        setCourse(courseObj);

        // Filter out soft-deleted sections (isRemoved: true), sort by order
        const activeSecs = secs
          .filter(s => !s.isRemoved)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setSections(activeSecs);

        // Total subsection count from subSectionIds arrays
        const total = activeSecs.reduce((acc, s) => acc + (s.subSectionIds?.length ?? 0), 0);
        setTotalSubs(total);

        // If URL has a subSectionId param, we'll load it once subsections are fetched
        // Otherwise do nothing — user clicks to open
        if (paramSubId) {
          // We'll load video directly since we have the ID
          loadVideoById(paramSubId);
        }
      } catch (err) {
        console.error("COURSE DETAIL ERROR:", err);
      } finally {
        if (!cancelled) setLoadingCourse(false);
      }
    };

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, token]);

  const fetchedProgressRef = useRef(false);

useEffect(() => {
  if (fetchedProgressRef.current) return;

  const fetchProgress = async () => {
    if (!courseId || !token) return;

    fetchedProgressRef.current = true;

    const res = await getCourseProgress(courseId);
    setCompletedIds(new Set(res?.courseProgress?.completedSubsections || []));
  };

  fetchProgress();
}, [courseId, token]);

  // ── 2. Load video by subsection ID ────────────────────────────────────────
  const loadVideoById = useCallback(async (sub) => {
    // sub can be a subsection object OR just an ID string
    const subObj = typeof sub === "object" ? sub : { _id: sub };
    const subId = subObj._id;

    setActiveSub(subObj);
    setVideoSrc(null);
    setLoadingVideo(true);

    navigate(`/courses/${courseId}/learn/${subId}`, { replace: true });
    setVideoSrc({subsectionId:subId});
  }, [courseId, navigate, token]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const completedCount = completedIds.size;
  const allDone = totalSubs > 0 && completedCount >= totalSubs;
  const dateStr = activeSub?.createdAt
    ? new Date(activeSub.createdAt).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    })
    : "";

  return (
  <div className="bg-[#0A0F1C] min-h-screen flex flex-col">

    {/* MAIN LAYOUT */}
    <div className="flex flex-1 flex-col lg:flex-row">

  {/* ───────── MOBILE OVERLAY ───────── */}
  {isSidebarOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={() => setIsSidebarOpen(false)}
    />
  )}

  {/* ───────── SIDEBAR ───────── */}
  <aside
    className={`
      fixed lg:static
      top-0 left-0
      h-full lg:h-[calc(100vh-56px)]
      w-[260px] lg:w-[185px]
      bg-[#161D29]
      border-r border-[#1C2333]
      z-50
      transform transition-transform duration-300 ease-in-out

      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0

      flex flex-col
      overflow-y-auto
    `}
  >

    {/* CLOSE BUTTON (MOBILE) */}
    <div className="lg:hidden flex justify-between items-center px-4 py-3 border-b border-[#1C2333]">
      <p className="text-white text-sm font-semibold">Course Content</p>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="text-white text-lg"
      >
        ✕
      </button>
    </div>

    {/* YOUR EXISTING SIDEBAR CONTENT */}
    <div className="flex-1 overflow-y-auto">
      {loadingCourse ? (
        <div className="px-[14px] py-[12px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-[16px]">
              <div className="h-[12px] bg-[#1C2333] rounded mb-[8px] w-[70%]" />
              <div className="h-[9px] bg-[#161D29] rounded mb-[6px] w-[80%]" />
            </div>
          ))}
        </div>
      ) : (
        sections.map((section, i) => (
          <SidebarSection
            key={section._id}
            section={section}
            activeSubId={activeSub?._id}
            completedIds={completedIds}
            setCompletedIds={setCompletedIds}
            onSelectSub={(id) => {
              loadVideoById(id);
              setIsSidebarOpen(false); // 🔥 auto close on mobile
            }}
            defaultOpen={i === 0}
            token={token}
          />
        ))
      )}
    </div>
  </aside>

  {/* ───────── MAIN CONTENT ───────── */}
  <main className="flex-1 min-w-0 flex flex-col">

    {/* 🔥 MOBILE HEADER (TOGGLE BUTTON) */}
    <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1C2333] bg-[#0A0F1C]">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="text-white text-xl"
      >
        ☰
      </button>
      <p className="text-sm text-[#AFB2BF]">Course Content</p>
    </div>

    {/* ───────── VIDEO SECTION ───────── */}
    <div className="
      w-full
      max-w-[900px]
      aspect-video
      relative
      mx-auto
      p-[12px] sm:p-[16px] lg:p-[20px]
    ">

      {/* LOADER */}
      {loadingVideo && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="w-[40px] h-[40px] rounded-full border-[4px] border-[#2C3244] border-t-[#FFD60A] animate-spin"></div>
        </div>
      )}

      {/* PLAYER */}
        <PlyrPlayer setCompletedIds={setCompletedIds} videoSrc={videoSrc} setVideoSrc={setVideoSrc} setLoadingVideo={setLoadingVideo} setActiveSub={setActiveSub} />

      {/* EMPTY */}
      {!loadingVideo && !videoSrc && (
        <div className="absolute inset-0 bg-[#0D1117] flex flex-col items-center justify-center gap-[14px]">
          <p className="text-[#4B5563] text-sm text-center px-4">
            Select a lecture from the sidebar
          </p>
        </div>
      )}
    </div>

    {/* ───────── VIDEO INFO ───────── */}
    <div className="px-[16px] sm:px-[24px] lg:px-[28px] pt-[20px] pb-[32px]">

      {activeSub && (
        <>
          <h2 className="
            text-[#F1F2FF]
            text-[16px] sm:text-[18px] lg:text-[20px]
            font-bold
            mb-[12px]
          ">
            {activeSub.title || activeSub.subSectionName}
          </h2>

          {activeSub.description && (
            <p className="text-[#AFB2BF] text-[13px] leading-[1.7]">
              {activeSub.description}
            </p>
          )}
        </>
      )}
    </div>
    {allDone && (
  <div style={{ padding: "20px" }}>
    <button
      onClick={() => setShowModal(true)}
      style={{
        background: "#FFD60A",
        color: "#000",
        padding: "10px 20px",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      Add Review
    </button>
  </div>
)}
  </main>
</div>



    {showModal && (
      <ReviewModal
        courseId={courseId}
        user={user}
        token={token}
        onClose={() => setShowModal(false)}
      />
    )}
  </div>
);
}