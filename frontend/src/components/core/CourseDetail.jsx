import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { enrollInCourse, getMyEnrolledCourses } from "../../services/operations/enrolledCourseAPI";
import {
  selectIsEnrolled,
  selectEnrolling,
  selectEnrolledFetched,
} from "../../slices/enrollmentSlice";
import { BACKEND_URL } from "../../utils/constants";
import { addCourseToWishList } from "../../services/operations/cartAPI";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; background: #0A0F1C; color: #F1F2FF; }
  @keyframes spin        { to { transform: rotate(360deg); } }
  @keyframes shimmer     { to { background-position: -200% 0; } }
  @keyframes sectionSpin { to { transform: rotate(360deg); } }
`;

function StarRating({ rating = 0, size = 14 }) {
  const clamped = Math.min(5, Math.max(0, rating));
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = clamped >= s;
        const half = !filled && clamped >= s - 0.5;
        const gradId = `sg-${size}-${s}`;
        return (
          <svg key={s} width={size} height={size} viewBox="0 0 20 20"
            fill={filled ? "#E7C009" : half ? `url(#${gradId})` : "none"}
            stroke="#E7C009" strokeWidth="1.5">
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

// ─── Page Loader ──────────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        border: "4px solid #2C3244", borderTop: "4px solid #FFD60A",
        animation: "spin 0.8s linear infinite",
      }} />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  return (
    <nav style={{
      background: "#161D29", borderBottom: "1px solid #2C3244",
      position: "sticky", top: 0, zIndex: 100,
      height: 56, display: "flex", alignItems: "center", padding: "0 40px",
    }}>
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "flex", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <div onClick={() => navigate("/")} style={{
          display: "flex", alignItems: "center", gap: 8,
          fontWeight: 800, fontSize: 16, color: "#F1F2FF", cursor: "pointer",
        }}>
          <div style={{ width: 30, height: 30, background: "#FFD60A", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7v11h14V7L10 2z" fill="#000" />
              <rect x="7" y="11" width="6" height="7" fill="#FFD60A" />
            </svg>
          </div>
          StudyNotion
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center", marginLeft: 16 }}>
          {[
            { label: "Home", path: "/" },
            { label: "Catalog ▾", path: "/catalog" },
            { label: "About us", path: "/about" },
            { label: "Contact us", path: "/contact" },
          ].map((link, i) => (
            <span key={link.label} onClick={() => navigate(link.path)} style={{
              color: i === 1 ? "#FFD60A" : "#AFB2BF", fontSize: 14, fontWeight: 500, cursor: "pointer",
            }}>{link.label}</span>
          ))}
        </div>

        {/* Right */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 18 }}>
          <button style={{ background: "none", border: "none", color: "#AFB2BF", display: "flex", cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button style={{ background: "none", border: "none", color: "#AFB2BF", display: "flex", cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "#FFD60A",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, color: "#000",
          }}>U</div>
        </div>
      </div>
    </nav>
  );
}

function PurchaseCard({
  courseId,
  thumbnailUrl, courseName, originalPrice, discountPrice,
  typeOfCourse, totalDuration,
  // Enrollment props (passed from CourseDetail)
  isEnrolled, enrolling, onEnroll, onGoToCourse,
}) {
  const [addedToCart, setAddedToCart] = useState(false);

  const isFree = typeOfCourse === "Free" || (!originalPrice && !discountPrice);
  const hasDiscount = !isFree && discountPrice > 0 && discountPrice < originalPrice;
  const displayPrice = isFree ? 0 : (discountPrice > 0 ? discountPrice : originalPrice);

  const INCLUDES = [
    { icon: "⏱️", text: totalDuration ? `${totalDuration}h on-demand video` : "On-demand video" },
    { icon: "♾️", text: "Full Lifetime access" },
    { icon: "📱", text: "Access on Mobile and TV" },
    { icon: "🏆", text: "Certificate of completion" },
  ];


  const dispatch = useDispatch();
  const handleCartClick = () => {

    if (isEnrolled) { onGoToCourse?.(); return; }
    if (isFree) { onEnroll?.(); return; }
    setAddedToCart(true);
    console.log("COURSE ID", courseId);
    dispatch(addCourseToWishList(courseId, dispatch))
  };

  const ctaLabel = () => {
    if (enrolling) return "Enrolling…";
    if (isEnrolled) return "Go to Course";
    if (isFree) return "Enroll for Free";
    if (addedToCart) return "Added to Cart";
    return "Add to Cart";
  };

  const ctaBg = isEnrolled ? "#47A992" : addedToCart ? "#47A992" : "#FFD60A";
  const ctaColor = isEnrolled || addedToCart ? "#fff" : "#000";

  return (
    <div style={{ width: 340, flexShrink: 0, position: "sticky", top: 72, alignSelf: "flex-start" }}>
      <div style={{
        background: "#161D29", border: "1px solid #2C3244", borderRadius: 12,
        overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
      }}>
        {/* Thumbnail */}
        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
          <img
            src={thumbnailUrl || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80"}
            alt={courseName}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div style={{ padding: "20px 22px 24px" }}>
          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {isFree ? (
              <span style={{ fontSize: 28, fontWeight: 800, color: "#47A992", letterSpacing: -1 }}>Free</span>
            ) : (
              <>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#F1F2FF", letterSpacing: -1 }}>
                  Rs. {Number(displayPrice).toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span style={{ fontSize: 16, color: "#6B7280", textDecoration: "line-through" }}>
                      Rs. {Number(originalPrice).toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: "#47A992",
                      background: "rgba(71,169,146,0.12)", padding: "2px 8px", borderRadius: 99,
                    }}>
                      {Math.round(((originalPrice - discountPrice) / originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleCartClick}
            disabled={enrolling}
            style={{
              width: "100%", padding: 13, borderRadius: 6, border: "none",
              background: ctaBg, color: ctaColor,
              fontWeight: 700, fontSize: 15,
              cursor: enrolling ? "not-allowed" : "pointer",
              opacity: enrolling ? 0.75 : 1,
              marginBottom: 10, transition: "all 0.2s", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {enrolling ? (
              <>
                <div style={{
                  width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)",
                  borderTop: "2px solid #000", borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }} />
                Enrolling…
              </>
            ) : (isEnrolled || addedToCart) ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {ctaLabel()}
              </>
            ) : ctaLabel()}
          </button>

          {/* Buy Now — paid & not enrolled only */}
          {!isFree && !isEnrolled && (
            <button
              onClick={() => onEnroll?.()}
              disabled={enrolling}
              style={{
                width: "100%", padding: 13, borderRadius: 6,
                border: "1px solid #2C3244", background: "transparent",
                color: "#F1F2FF", fontWeight: 700, fontSize: 15,
                cursor: enrolling ? "not-allowed" : "pointer",
                marginBottom: 14, fontFamily: "inherit",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1C2333"; e.currentTarget.style.borderColor = "#AFB2BF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#2C3244"; }}
            >Buy now</button>
          )}

          <p style={{ color: "#6B7280", fontSize: 12, textAlign: "center", marginBottom: 18 }}>
            --------------
          </p>

          <p style={{ color: "#F1F2FF", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>This course includes:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {INCLUDES.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>{item.icon}</span>
                <span style={{ color: "#47A992", fontSize: 13 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <button style={{
            display: "flex", alignItems: "center", gap: 6, margin: "18px auto 0",
            background: "none", border: "none", color: "#FFD60A",
            fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
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

// ─── Accordion Section ─────────────────────────────────────────────────────────
// section shape from API: { _id, name, order, subSectionIds: [...], courseId, ... }
// SubSections fetched lazily from: GET /sections/:sectionId/subSections
function AccordionSection({ section, forceOpen }) {
  // Open by default if it's order=1 (first section)
  const [open, setOpen] = useState(section.order === 1);
  const [subSections, setSubSections] = useState(null); // null = not yet fetched
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const prevForce = useRef(undefined);

  // Sync with Collapse/Expand all
  useEffect(() => {
    if (forceOpen !== undefined && forceOpen !== prevForce.current) {
      prevForce.current = forceOpen;
      setOpen(forceOpen);
    }
  }, [forceOpen]);

  const fetchSubSections = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await axios.get(
        `${BACKEND_URL}/subSections/getall/${section._id}`
      );

      const data =
        res?.data?.data?.subsections ?? res?.data?.subsections;

      setSubSections(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError("Failed to load lectures.");
    } finally {
      setLoading(false);
    }
  };

  // Lazy-fetch subsections when accordion opens
  useEffect(() => {
    if (open && subSections === null) {
      fetchSubSections();
    }
  }, [open]);

  const retry = (e) => {
    e.stopPropagation();
    setSubSections(null);
    setFetchError(null);
  };

  // Show count from subSectionIds while subsections are being fetched
  const lectureCount = subSections != null
    ? subSections.length
    : (section.subSectionIds?.length ?? 0);

  return (
    <div style={{ borderBottom: "1px solid #2C3244" }}>
      {/* Header */}
      <div
        onClick={() => {
          setOpen((prev) => {
            if (!prev && subSections === null) {
              fetchSubSections(); // 🔥 trigger manually
            }
            return !prev;
          });
        }}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 20px", cursor: "pointer",
          background: open ? "#1C2333" : "#161D29",
          transition: "background 0.15s", userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#AFB2BF" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {/* section.name from API */}
          <span style={{ color: "#F1F2FF", fontWeight: 600, fontSize: 14 }}>{section.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#FFD60A", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
            {lectureCount} {lectureCount === 1 ? "lecture" : "lectures"}
          </span>
          {loading && (
            <div style={{
              width: 12, height: 12,
              border: "2px solid #2C3244", borderTop: "2px solid #FFD60A",
              borderRadius: "50%", animation: "sectionSpin 0.7s linear infinite",
            }} />
          )}
        </div>
      </div>

      {/* Body */}
      {open && (
        <div style={{ background: "#0D1117" }}>
          {/* Skeleton while loading */}
          {loading && (
            <div style={{ padding: "14px 20px 14px 48px" }}>
              {[85, 70, 55].map((w, n) => (
                <div key={n} style={{
                  height: 12, borderRadius: 4, marginBottom: 12, width: `${w}%`,
                  background: "linear-gradient(90deg,#1C2333 25%,#2C3244 50%,#1C2333 75%)",
                  backgroundSize: "200% 100%", animation: "shimmer 1.2s infinite",
                }} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && fetchError && (
            <div style={{ padding: "12px 20px 12px 48px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#FC8181", fontSize: 12 }}>{fetchError}</span>
              <button onClick={retry} style={{
                background: "none", border: "none", color: "#FFD60A",
                fontSize: 12, cursor: "pointer", fontWeight: 600,
                textDecoration: "underline", padding: 0, fontFamily: "inherit",
              }}>Retry</button>
            </div>
          )}

          {/* Lecture rows */}
          {!loading && !fetchError && subSections?.map((lec, i) => (
            <div key={lec._id || i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "10px 20px 10px 48px",
              borderBottom: i < subSections.length - 1 ? "1px solid #1C2333" : "none",
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="#AFB2BF" strokeWidth="1.8"
                  style={{ marginTop: 2, flexShrink: 0 }}>
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <div>
                  {/* SubSection API fields: title / subSectionName */}
                  <p style={{ color: "#AFB2BF", fontSize: 13, lineHeight: 1.5, marginBottom: lec.description ? 3 : 0 }}>
                    {lec.title || lec.subSectionName || "Untitled Lecture"}
                  </p>
                  {lec.description && (
                    <p style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>{lec.description}</p>
                  )}
                </div>
              </div>
              {/* SubSection API fields: timeDuration / duration */}
              <span style={{ color: "#6B7280", fontSize: 12, flexShrink: 0, marginLeft: 16 }}>
                {lec.timeDuration || lec.duration || ""}
              </span>
            </div>
          ))}

          {/* Empty state */}
          {!loading && !fetchError && subSections?.length === 0 && (
            <div style={{ padding: "14px 48px", color: "#6B7280", fontSize: 13 }}>
              No lectures in this section yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Review Card ───────────────────────────────────────────────────────────────
// review shape from API: { _id, user: { firstName, lastName, image, accountType }, review, rating }
function ReviewCard({ review }) {
  const [hovered, setHovered] = useState(false);

  const firstName = review?.user?.firstName || "";
  const lastName = review?.user?.lastName || "";
  const name = `${firstName} ${lastName}`.trim() || "Student";
  const avatar = review?.user?.image || null;
  const initial = name.charAt(0).toUpperCase();
  const text = review?.review || review?.comment || "";
  const rating = Number(review?.rating) || 0;
  const palette = ["#E67E22", "#8E44AD", "#27AE60", "#2980B9", "#C0392B", "#16A085"];
  const color = palette[name.charCodeAt(0) % palette.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#161D29",
        border: `1px solid ${hovered ? "#FFD60A" : "#2C3244"}`,
        borderRadius: 10, padding: 20,
        minWidth: 240, maxWidth: 280, flex: "0 0 auto",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        {avatar ? (
          <img src={avatar} alt={name}
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: "50%", background: color,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{initial}</span>
          </div>
        )}
        <div>
          <p style={{ color: "#F1F2FF", fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{name}</p>
          <p style={{ color: "#6B7280", fontSize: 11 }}>{review?.user?.accountType || "Student"}</p>
        </div>
      </div>
      <p style={{ color: "#AFB2BF", fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>
        {text.length > 130 ? text.slice(0, 127) + "…" : text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#E7C009", fontWeight: 700, fontSize: 13 }}>{rating.toFixed(1)}</span>
        <StarRating rating={rating} size={13} />
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: "Resources",
      links: ["Articles", "Blog", "Chart Sheet", "Code challenges", "Docs", "Projects", "Videos", "Workspaces"],
      extra: { title: "Support", links: ["Help Center"] },
    },
    {
      title: "Plans",
      links: ["Paid memberships", "For students", "Business solutions"],
      extra: { title: "Community", links: ["Forums", "Chapters", "Events"] },
    },
    {
      title: "Subjects",
      links: ["AI", "Cloud Computing", "Code Foundations", "Computer Science", "Cybersecurity",
        "Data Analytics", "Data Science", "Data Visualization", "Developer Tools", "DevOps",
        "Game Development", "IT", "Machine Learning", "Math", "Mobile Development", "Web Design", "Web Development"],
    },
    {
      title: "Languages",
      links: ["Bash", "C", "C++", "C#", "Go", "HTML & CSS", "Java", "JavaScript", "Kotlin", "PHP", "Python", "R", "Ruby", "SQL", "Swift"],
    },
    {
      title: "Career building",
      links: ["Career paths", "Career services", "Interview prep", "Professional certification"],
      extra: { title: "", links: ["Full Catalog", "Beta Content"] },
    },
  ];

  return (
    <footer style={{ background: "#161D29", borderTop: "1px solid #2C3244", padding: "48px 40px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 60, marginBottom: 40, flexWrap: "wrap" }}>
          {/* Brand */}
          <div style={{ flex: "0 0 160px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, background: "#FFD60A", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 7v11h14V7L10 2z" fill="#000" />
                  <rect x="7" y="11" width="6" height="7" fill="#FFD60A" />
                </svg>
              </div>
              StudyNotion
            </div>
            <p style={{ color: "#AFB2BF", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              Company
            </p>
            {["About", "Careers", "Affiliates"].map(l => (
              <p key={l} style={{ color: "#AFB2BF", fontSize: 13, cursor: "pointer", marginBottom: 7 }}>{l}</p>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#2C3244",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  color: "#AFB2BF", fontSize: 11,
                }}>
                  {["f", "◎", "▶", "t"][i]}
                </div>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div style={{ display: "flex", gap: 48, flex: 1, flexWrap: "wrap" }}>
            {cols.map(col => (
              <div key={col.title} style={{ minWidth: 100 }}>
                <p style={{ color: "#F1F2FF", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{col.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.links.map(l => (
                    <span key={l} style={{ color: "#AFB2BF", fontSize: 13, cursor: "pointer" }}>{l}</span>
                  ))}
                </div>
                {col.extra && (
                  <>
                    <br />
                    {col.extra.title && (
                      <p style={{ color: "#F1F2FF", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{col.extra.title}</p>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {col.extra.links.map(l => (
                        <span key={l} style={{ color: "#AFB2BF", fontSize: 13, cursor: "pointer" }}>{l}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #2C3244", paddingTop: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Cookie Policy", "Terms"].map(l => (
              <span key={l} style={{ color: "#AFB2BF", fontSize: 12, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
          <span style={{ color: "#6B7280", fontSize: 12 }}>Made with ❤️ CodeHelp © 2023 Studynotion</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Redux: auth + enrollment state ───────────────────────────────────────
  const token = useSelector((store) => store.auth.token);
  const isEnrolled = useSelector(selectIsEnrolled(courseId));
  const enrolling = useSelector(selectEnrolling);
  const enrolledFetched = useSelector(selectEnrolledFetched);

  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allOpen, setAllOpen] = useState(true);
  const [forceOpen, setForceOpen] = useState(undefined);

  // ── Fetch: GET /courses/getDetails/:courseId ──────────────────────────────
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BACKEND_URL}/courses/getDetails/${courseId}`);
        // Normalize wrapper: { data: { course, sections, enrollmentsCount, reviews } }
        //                 or: { course, sections, enrollmentsCount, reviews }
        if (!cancelled) setApiData(res.data?.data ?? res.data);
      } catch (err) {
        if (!cancelled) setError("Failed to load course. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCourse();
    return () => { cancelled = true; };
  }, [courseId]);

  // ── Fetch enrolled courses once (cache-aware) so isEnrolled is accurate ──
  // Only fetches if not already in store; skips if already fetched.
  useEffect(() => {
    if (token && !enrolledFetched) {
      dispatch(getMyEnrolledCourses(token));
    }
  }, [token, enrolledFetched, dispatch]);

  // ── Enroll handler ────────────────────────────────────────────────────────
  const handleEnroll = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    // After successful enroll the thunk navigates to /courses/:courseId/learn
    // enrollmentSlice.enrollSuccess invalidates cache → next getmy will re-fetch
    dispatch(enrollInCourse(courseId, token, navigate));
  };

  // ── Go to course (already enrolled) ──────────────────────────────────────
  const handleGoToCourse = () => {
    navigate(`/courses/${courseId}/learn`);
  };

  // ── Map API response fields ───────────────────────────────────────────────
  // Top-level keys: course, sections, enrollmentsCount, reviews
  const courseObj = apiData?.course ?? {};
  const sections = apiData?.sections ?? [];
  const enrollments = apiData?.enrollmentsCount ?? 0;
  const reviews = apiData?.reviews ?? [];

  // courseObj fields (exact field names from your API)
  const courseName = courseObj.courseName || "";
  const description = courseObj.description || "";
  const instructorName = courseObj.instructorName || "";
  const thumbnailUrl = courseObj.thumbnailUrl || "";
  const originalPrice = courseObj.originalPrice ?? 0;
  const discountPrice = courseObj.discountPrice ?? 0;
  const typeOfCourse = courseObj.typeOfCourse || "";
  const totalDuration = courseObj.totalDuration || 0;
  const level = courseObj.level || "";
  const language = courseObj.language || "";
  const tag = courseObj.tag || [];
  const categoryName = courseObj.categoryId?.name || "";
  const createdAt = courseObj.createdAt
    ? new Date(courseObj.createdAt).toLocaleDateString("en-US", { month: "2-digit", year: "numeric" })
    : "";

  // API field is "whatYouWillLearn" (array)
  const whatYouWillLearn = (() => {
    const raw = courseObj.whatYouWillLearn;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return String(raw).split(/\n/).map(s => s.trim()).filter(Boolean);
  })();

  // Sort sections by .order ascending (API returns them in DB order)
  const sortedSections = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Total lectures = sum of subSectionIds array lengths across all sections
  const totalLectures = sections.reduce((acc, s) => acc + (s.subSectionIds?.length ?? 0), 0);

  // Average rating computed from reviews array
  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / reviews.length
    : 0;

  const handleToggleAll = () => {
    const next = !allOpen;
    setAllOpen(next);
    setForceOpen(next);
  };

  // ── Render: Loading ───────────────────────────────────────────────────────
  if (isLoading) return (
    <>
      <style>{globalStyles}</style>
      <div style={{ background: "#0A0F1C", minHeight: "100vh" }}>
        <PageLoader />
      </div>
    </>
  );

  // ── Render: Error ─────────────────────────────────────────────────────────
  if (error) return (
    <>
      <style>{globalStyles}</style>
      <div style={{ background: "#0A0F1C", minHeight: "100vh" }}>
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <p style={{ color: "#FC8181", fontSize: 15 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 28px", borderRadius: 6, border: "none", background: "#FFD60A", color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
          >Retry</button>
        </div>
      </div>
    </>
  );

  // ── Render: Main ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ background: "#0A0F1C", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", color: "#F1F2FF" }}>

        {/* ── Hero Header ── */}
        <div style={{ background: "#161D29", borderBottom: "1px solid #2C3244" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 40px 36px", display: "flex", gap: 40, alignItems: "flex-start" }}>

            {/* Left */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Breadcrumb */}
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 16, fontSize: 13 }}>
                <span style={{ color: "#AFB2BF", cursor: "pointer" }} onClick={() => navigate("/")}>Home</span>
                <span style={{ color: "#6B7280" }}>/</span>
                <span style={{ color: "#AFB2BF", cursor: "pointer" }} onClick={() => navigate(-1)}>Learning</span>
                <span style={{ color: "#6B7280" }}>/</span>
                {/* categoryId.name from API */}
                <span style={{ color: "#FFD60A", fontWeight: 600 }}>{categoryName}</span>
              </div>

              {/* courseName from API */}
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#F1F2FF", lineHeight: 1.3, marginBottom: 14, letterSpacing: -0.3 }}>
                {courseName}
              </h1>

              {/* description from API */}
              <p style={{ color: "#AFB2BF", fontSize: 14, lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>
                {description}
              </p>

              {/* Rating row — computed from reviews array */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                {avgRating > 0 ? (
                  <>
                    <span style={{ color: "#E7C009", fontWeight: 800, fontSize: 15 }}>{avgRating.toFixed(1)}</span>
                    <StarRating rating={avgRating} size={15} />
                    <span style={{ color: "#AFB2BF", fontSize: 13 }}>({reviews.length.toLocaleString()} ratings)</span>
                    <span style={{ color: "#6B7280", fontSize: 13 }}>·</span>
                  </>
                ) : (
                  <span style={{ color: "#AFB2BF", fontSize: 13 }}>No ratings yet ·&nbsp;</span>
                )}
                {/* enrollmentsCount from API */}
                <span style={{ color: "#AFB2BF", fontSize: 13 }}>
                  {Number(enrollments).toLocaleString()} {enrollments === 1 ? "student" : "students"}
                </span>
              </div>

              {/* instructorName from API */}
              <p style={{ color: "#AFB2BF", fontSize: 13, marginBottom: 12 }}>
                Created by{" "}
                <span style={{ color: "#FFD60A", fontWeight: 600, cursor: "pointer" }}>{instructorName}</span>
              </p>

              {/* Meta */}
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                {createdAt && (
                  <span style={{ color: "#AFB2BF", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Created at {createdAt}
                  </span>
                )}
                {language && (
                  <span style={{ color: "#AFB2BF", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    {language}
                  </span>
                )}
                {/* level from API */}
                {level && <span style={{ color: "#AFB2BF", fontSize: 13 }}>📶 {level}</span>}
              </div>

              {/* tag[] from API */}
              {tag.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
                  {tag.map(t => (
                    <span key={t} style={{
                      fontSize: 12, padding: "3px 10px", borderRadius: 99,
                      background: "#0A0F1C", border: "1px solid #2C3244", color: "#AFB2BF",
                    }}>{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase Card — all props from courseObj + enrollment state */}
            <PurchaseCard
              courseId={courseId}
              thumbnailUrl={thumbnailUrl}
              courseName={courseName}
              originalPrice={originalPrice}
              discountPrice={discountPrice}
              typeOfCourse={typeOfCourse}
              totalDuration={totalDuration}
              isEnrolled={isEnrolled}
              enrolling={enrolling}
              onEnroll={handleEnroll}
              onGoToCourse={handleGoToCourse}
            />
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 60px" }}>

          {/* What You'll Learn — courseObj.whatYouWillLearn */}
          {whatYouWillLearn.length > 0 && (
            <section style={{
              border: "1px solid #2C3244", borderRadius: 10,
              padding: "28px 32px", marginBottom: 48, background: "#161D29",
            }}>
              <h2 style={{ color: "#F1F2FF", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
                What you'll learn
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 40px" }}>
                {whatYouWillLearn.map((point, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#47A992" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 3 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ color: "#AFB2BF", fontSize: 13.5, lineHeight: 1.6 }}>{point}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Course Content — apiData.sections (sorted by .order) */}
          <section style={{ marginBottom: 52 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h2 style={{ color: "#F1F2FF", fontSize: 20, fontWeight: 700 }}>Course content</h2>
              {sortedSections.length > 0 && (
                <button onClick={handleToggleAll} style={{
                  background: "none", border: "none", color: "#FFD60A",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>
                  {allOpen ? "Collapse all sections" : "Expand all sections"}
                </button>
              )}
            </div>

            {/* Section/lecture counts from real API data */}
            <p style={{ color: "#AFB2BF", fontSize: 13, marginBottom: 18 }}>
              {sortedSections.length} {sortedSections.length === 1 ? "section" : "sections"}
              {totalLectures > 0 && ` • ${totalLectures} lectures`}
              {totalDuration > 0 && ` • ${totalDuration}h total length`}
            </p>

            <div style={{ border: "1px solid #2C3244", borderRadius: 8, overflow: "hidden" }}>
              {sortedSections.length > 0 ? (
                sortedSections.map((section, i) => (
                  <AccordionSection
                    key={section._id || i}
                    section={section}
                    forceOpen={forceOpen}
                  />
                ))
              ) : (
                <div style={{ padding: 28, color: "#6B7280", fontSize: 14, textAlign: "center" }}>
                  No course content available yet.
                </div>
              )}
            </div>
          </section>

          {/* Author — courseObj.instructorName (instructorBio if present) */}
          <section style={{ marginBottom: 52 }}>
            <h2 style={{ color: "#F1F2FF", fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Author</h2>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: `hsl(${(instructorName.charCodeAt(0) || 65) * 7 % 360},55%,45%)`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontWeight: 700, color: "#fff", fontSize: 22 }}>
                  {instructorName.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p style={{ color: "#F1F2FF", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                  {instructorName}
                </p>
                {/* Only rendered if API provides instructorBio */}
                {courseObj.instructorBio && (
                  <p style={{ color: "#AFB2BF", fontSize: 14, lineHeight: 1.7, maxWidth: 680 }}>
                    {courseObj.instructorBio}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Reviews — apiData.reviews */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ color: "#F1F2FF", fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 32 }}>
              Reviews from other learners
            </h2>
            {reviews.length > 0 ? (
              <div style={{
                display: "flex", gap: 16, overflowX: "auto", paddingBottom: 10,
                scrollbarWidth: "none", msOverflowStyle: "none",
              }}>
                {reviews.map((review, i) => (
                  <ReviewCard key={review._id || i} review={review} />
                ))}
              </div>
            ) : (
              <p style={{ color: "#6B7280", fontSize: 14, textAlign: "center" }}>
                No reviews yet. Be the first to review this course!
              </p>
            )}
          </section>

        </div>

        <Footer />
      </div>
    </>
  );
}