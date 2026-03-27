import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCatalogData } from "../../services/operations/CatalogAPI";
import CourseCard from "../Course/CourseCard";

const CatalogItem = () => {
  const { catalogId } = useParams();
  const dispatch = useDispatch();

  const catalogData = useSelector(
    (state) => state.catalog.catalogData[catalogId]
  );

  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch only if not cached
  useEffect(() => {
    if (!catalogData && catalogId) {
      setLoading(true);
      dispatch(fetchCatalogData(catalogId)).finally(() =>
        setLoading(false)
      );
    }
  }, [catalogId]);

  // ✅ Derived data
  const allCourses = catalogData?.selectedCategory ?? [];
  const mostSelling = catalogData?.mostSellingCourses ?? [];

  const displayedCourses =
    activeTab === "all" ? allCourses : mostSelling;

  // 🔄 Loading UI
  if (loading && !catalogData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading courses...
      </div>
    );
  }

  // ❌ No data
  if (!catalogData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load catalog
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen bg-[#000814]">
      {/* Header */}
      <div className="bg-[#161D29] border-b border-[#2C3244] py-10 px-[8.5vw]">
        <h1 className="text-3xl font-bold mb-2">All Courses</h1>
        <p className="text-sm text-[#AFB2BF]">
          {allCourses.length} courses available
        </p>
      </div>

      {/* Tabs */}
      <div className="px-[8.5vw] mt-8">
        <div className="flex gap-6 border-b border-[#2C3244] mb-8">
          <TabButton
            label={`All Courses (${allCourses.length})`}
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          />
          <TabButton
            label={`Most Popular (${mostSelling.length})`}
            active={activeTab === "mostSelling"}
            onClick={() => setActiveTab("mostSelling")}
          />
        </div>

        {/* Courses */}
        {displayedCourses.length === 0 ? (
          <div className="text-center text-[#6B7280] py-20">
            No courses found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
            {displayedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm ${
        active
          ? "text-[#FFD60A] border-b-2 border-[#FFD60A]"
          : "text-[#6B7280]"
      }`}
    >
      {label}
    </button>
  );
}

export default CatalogItem;