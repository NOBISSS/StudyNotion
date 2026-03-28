// components/Catalog/CatalogItem.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCatalogData } from "../../services/operations/CatalogAPI";
import CourseCard from "../Course/CourseCard";

const COURSES_PER_PAGE = 12;

const CatalogItem = () => {
  const { catalogId } = useParams();
  const dispatch = useDispatch();

  const catalogData = useSelector(
    (state) => state.catalog.catalogData[catalogId]
  );

  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(COURSES_PER_PAGE);

  // Fetch only if not cached
  useEffect(() => {
    if (!catalogData && catalogId) {
      setLoading(true);
      dispatch(fetchCatalogData(catalogId)).finally(() => setLoading(false));
    }
  }, [catalogId]);

  // Reset pagination on tab change
  useEffect(() => {
    setVisibleCount(COURSES_PER_PAGE);
  }, [activeTab]);

  // Derived data
  const allCourses = catalogData?.selectedCategory ?? [];
  const mostSelling = catalogData?.mostSellingCourses ?? [];
  const displayedCourses = activeTab === "all" ? allCourses : mostSelling;
  const visibleCourses = displayedCourses.slice(0, visibleCount);
  const hasMore = visibleCount < displayedCourses.length;

  // Loading skeleton
  if (loading && !catalogData) {
    return (
      <div className="min-h-screen bg-[#000814] text-white">
        {/* Header skeleton */}
        <div className="bg-[#161D29] border-b border-[#2C3244] py-10 px-4 sm:px-8 lg:px-[8.5vw]">
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-[#2C333F] rounded w-48" />
            <div className="h-4 bg-[#2C333F] rounded w-32" />
          </div>
        </div>
        {/* Grid skeleton */}
        <div className="px-4 sm:px-8 lg:px-[8.5vw] mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#2C333F] rounded-xl h-44 w-full mb-3" />
                <div className="space-y-2 px-1">
                  <div className="h-4 bg-[#2C333F] rounded w-4/5" />
                  <div className="h-3 bg-[#2C333F] rounded w-1/2" />
                  <div className="h-3 bg-[#2C333F] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error / no data
  if (!catalogData) {
    return (
      <div className="min-h-screen bg-[#000814] flex flex-col items-center justify-center gap-3">
        <p className="text-red-400 text-lg font-medium">
          Failed to load catalog
        </p>
        <p className="text-[#6B7280] text-sm">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen bg-[#000814]">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-[#161D29] border-b border-[#2C3244] py-8 sm:py-10 px-4 sm:px-8 lg:px-[8.5vw]">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
          {catalogData?.categoryName ?? "All Courses"}
        </h1>
        {catalogData?.categoryDescription && (
          <p className="text-sm text-[#AFB2BF] mt-1 max-w-3xl leading-relaxed line-clamp-3">
            {catalogData.categoryDescription}
          </p>
        )}
        <p className="text-xs text-[#6B7280] mt-2">
          {allCourses.length} {allCourses.length === 1 ? "course" : "courses"} available
        </p>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-[8.5vw] mt-6 sm:mt-8">

        {/* Tabs */}
        <div className="flex gap-4 sm:gap-6 border-b border-[#2C3244] mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
          <TabButton
            label={`All Courses`}
            count={allCourses.length}
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          />
          <TabButton
            label={`Most Popular`}
            count={mostSelling.length}
            active={activeTab === "mostSelling"}
            onClick={() => setActiveTab("mostSelling")}
          />
        </div>

        {/* Result count */}
        {displayedCourses.length > 0 && (
          <p className="text-xs text-[#6B7280] mb-4">
            Showing {Math.min(visibleCount, displayedCourses.length)} of{" "}
            {displayedCourses.length} courses
          </p>
        )}

        {/* Course grid */}
        {displayedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-[#6B7280] text-lg">No courses found</p>
            <p className="text-[#4B5563] text-sm">
              Check back later for new courses
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {visibleCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-10 mb-6">
                <button
                  onClick={() =>
                    setVisibleCount((prev) => prev + COURSES_PER_PAGE)
                  }
                  className="px-8 py-3 border border-[#FFD60A] text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black font-semibold text-sm rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  Load More ({displayedCourses.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {/* End of list */}
            {!hasMore && displayedCourses.length > COURSES_PER_PAGE && (
              <p className="text-center text-[#4B5563] text-xs py-8">
                You've seen all {displayedCourses.length} courses
              </p>
            )}
          </>
        )}

        {/* Bottom padding */}
        <div className="pb-16" />
      </div>
    </div>
  );
};

// ── Tab Button ──────────────────────────────────────────────────────────────
function TabButton({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 pb-3 text-sm font-medium whitespace-nowrap
        transition-colors duration-200 shrink-0
        ${active
          ? "text-[#FFD60A] border-b-2 border-[#FFD60A]"
          : "text-[#6B7280] hover:text-[#AFB2BF]"
        }
      `}
    >
      {label}
      <span
        className={`
          text-xs px-2 py-0.5 rounded-full font-medium
          ${active
            ? "bg-[#FFD60A] text-black"
            : "bg-[#2C333F] text-[#6B7280]"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}

export default CatalogItem;