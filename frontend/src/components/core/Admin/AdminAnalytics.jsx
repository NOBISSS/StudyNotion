// components/core/Admin/AdminAnalytics.jsx
import { Chart, registerables } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getAdminAnalytics } from "../../../services/operations/adminAPI";

Chart.register(...registerables);

// ── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-[#1E2735] border border-[#2C333F] rounded-xl p-4">
    <p className="text-[#6E727F] text-xs mb-1">{label}</p>
    <p className="text-2xl font-bold" style={{ color }}>
      {value}
    </p>
    {sub && <p className="text-[#6E727F] text-xs mt-0.5">{sub}</p>}
  </div>
);

// ── Users by Role Chart ────────────────────────────────────────────────────
function RoleChart({ students, instructors }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvasRef.current.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Students", "Instructors"],
        datasets: [
          {
            data: [students, instructors],
            backgroundColor: ["#FFD60A", "#60A5FA"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (v) => `${v.label}: ${v.raw}` } },
        },
      },
    });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [students, instructors]);

  return (
    <div style={{ position: "relative", height: "180px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

// ── Courses by Category Chart ──────────────────────────────────────────────
function CategoryChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data?.length) return;
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const COLORS = [
      "#FFD60A",
      "#60A5FA",
      "#22C55E",
      "#A78BFA",
      "#F472B6",
      "#F59E0B",
      "#06B6D4",
    ];

    chartRef.current = new Chart(canvasRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            label: "Courses",
            data: data.map((d) => d.courseCount || 0),
            backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#838894", font: { size: 11 }, maxRotation: 30 },
          },
          y: {
            grid: { color: "#2C333F" },
            ticks: { color: "#838894", font: { size: 11 }, stepSize: 1 },
          },
        },
      },
    });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <div style={{ position: "relative", height: "200px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

// ── Course Status Chart ────────────────────────────────────────────────────
function CourseStatusChart({ published, draft, inactive }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvasRef.current.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Published", "Draft", "Inactive"],
        datasets: [
          {
            data: [published, draft, inactive],
            backgroundColor: ["#22C55E", "#F59E0B", "#EF4444"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (v) => `${v.label}: ${v.raw}` } },
        },
      },
    });
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [published, draft, inactive]);

  return (
    <div style={{ position: "relative", height: "180px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
const AdminAnalytics = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: {},
    courses: {},
    categories: {},
    analytics: null,
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const analytics = await getAdminAnalytics();
    setData({
      users: analytics.users || [],
      courses: analytics.courses || [],
      categories: analytics.categories || [],
      analytics,
    });
    setLoading(false);
  };

  // Courses per category
  const categoryData =
    data?.categories?.list?.map((cat) => ({
      name: cat.name,
      count: cat.courseCount || 0,
    })) || [];

  const topCategories = [...categoryData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Recent users
  const recentUsers = data?.users?.recent?.slice(-5).reverse() || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161D29] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD60A] border-t-transparent" />
          <p className="text-[#6E727F] text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161D29] text-white px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#6E727F] text-sm mb-0.5">Admin Dashboard</p>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.firstName || "Admin"} 👋
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-[#1E2735] border border-[#2C333F] rounded-xl px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-[#AFB2BF] text-sm">Platform Online</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Total Users"
          value={data.users.total}
          sub={`${data.users?.banned || 0} banned`}
          color="#FFD60A"
        />
        <StatCard
          label="Total Courses"
          value={data.courses.total}
          sub={`${data?.courses?.published || 0} published`}
          color="#60A5FA"
        />
        <StatCard
          label="Categories"
          value={data.categories.total}
          sub="active"
          color="#22C55E"
        />
        <StatCard
          label="Instructors"
          value={data.users?.instructors || 0}
          sub={`${data.users?.students || 0} students`}
          color="#A78BFA"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Users by Role */}
        <div className="bg-[#1E2735] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Users by Role</p>
          <RoleChart
            students={data.users?.students || 0}
            instructors={data.users?.instructors || 0}
          />
          <div className="flex justify-center gap-6 mt-4">
            {[
              {
                label: "Students",
                color: "#FFD60A",
                value: data.users?.students || 0,
              },
              {
                label: "Instructors",
                color: "#60A5FA",
                value: data.users?.instructors || 0,
              },
            ].map((l) => (
              <span
                key={l.label}
                className="flex items-center gap-1.5 text-xs text-[#838894]"
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: l.color }}
                />
                {l.label} ({l.value})
              </span>
            ))}
          </div>
        </div>

        {/* Course Status */}
        <div className="bg-[#1E2735] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Course Status</p>
          <CourseStatusChart
            published={data.courses?.published || 0}
            draft={data.courses?.draft || 0}
            inactive={data.courses?.inactive || 0}
          />
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {[
              {
                label: "Published",
                color: "#22C55E",
                value: data.courses?.published || 0,
              },
              {
                label: "Draft",
                color: "#F59E0B",
                value: data.courses?.draft || 0,
              },
              {
                label: "Inactive",
                color: "#EF4444",
                value: data.courses?.inactive || 0,
              },
            ].map((l) => (
              <span
                key={l.label}
                className="flex items-center gap-1.5 text-xs text-[#838894]"
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: l.color }}
                />
                {l.label} ({l.value})
              </span>
            ))}
          </div>
        </div>

        {/* Free vs Paid */}
        <div className="bg-[#1E2735] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">
            Course Pricing
          </p>
          <div className="flex flex-col gap-4 mt-6">
            {[
              {
                label: "Free Courses",
                value: data.courses?.free || 0,
                total: data.courses?.total || 0,
                color: "#22C55E",
              },
              {
                label: "Paid Courses",
                value: data.courses?.paid || 0,
                total: data.courses?.total || 0,
                color: "#FFD60A",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-[#AFB2BF] text-xs">{item.label}</p>
                  <p className="text-white text-xs font-semibold">
                    {item.value}
                  </p>
                </div>
                <div className="w-full h-2 bg-[#2C333F] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: item.total
                        ? `${(item.value / item.total) * 100}%`
                        : "0%",
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick numbers */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              {
                label: "Banned Users",
                value: data.users?.banned || 0,
                color: "#EF4444",
              },
              {
                label: "Active Courses",
                value: data.courses?.active || 0,
                color: "#22C55E",
              },
            ].map((s) => (
              <div key={s.label} className="bg-[#161D29] rounded-lg p-3">
                <p className="text-[#6E727F] text-xs">{s.label}</p>
                <p className="font-bold mt-0.5" style={{ color: s.color }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Courses per Category */}
        <div className="bg-[#1E2735] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">
            Courses per Category
          </p>
          {categoryData.length > 0 ? (
            <CategoryChart data={data.categories.list} />
          ) : (
            <div className="flex items-center justify-center h-[200px] text-[#6E727F] text-sm">
              No category data
            </div>
          )}
        </div>

        {/* Top Categories Table */}
        <div className="bg-[#1E2735] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">
            Category Breakdown
          </p>
          <div className="flex flex-col gap-2 overflow-y-scroll h-50 pr-2">
            {data.categories.list && data.categories.list.length === 0 ? (
              <p className="text-[#6E727F] text-sm">No categories yet</p>
            ) : (
              data.categories.list
                .sort((a, b) => b.courseCount - a.courseCount)
                .map((cat, i) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between py-2.5 border-b border-[#2C333F] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#6E727F] text-xs w-4">
                        #{i + 1}
                      </span>
                      <p className="text-white text-sm">{cat.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[#2C333F] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#FFD60A]"
                          style={{
                            width: cat?.courseCount
                              ? `${(cat.courseCount / data.courses.published) * 100}%`
                              : "0%",
                          }}
                        />
                      </div>
                      <span className="text-[#AFB2BF] text-xs w-8 text-right">
                        {cat.courseCount}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-[#1E2735] border border-[#2C333F] rounded-xl p-5">
        <p className="text-sm font-semibold text-white mb-4">
          Recent Registrations
        </p>
        {recentUsers.length === 0 ? (
          <p className="text-[#6E727F] text-sm">No users yet</p>
        ) : (
          <div className="flex flex-col">
            {recentUsers.map((u, index) => (
              <div
                key={u._id}
                className={`flex items-center justify-between py-3 ${index < recentUsers.length - 1
                    ? "border-b border-[#2C333F]"
                    : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFD60A]/20 flex items-center justify-center text-[#FFD60A] text-xs font-bold">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-[#6E727F] text-xs">{u.email}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.accountType === "instructor"
                      ? "text-[#FFD60A] bg-[#FFD60A]/10"
                      : u.accountType === "admin"
                        ? "text-[#A78BFA] bg-[#A78BFA]/10"
                        : "text-[#60A5FA] bg-[#60A5FA]/10"
                    }`}
                >
                  {u.accountType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
