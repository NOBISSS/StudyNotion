// components/core/Dashboard/StudentDashboard.jsx
import { useRef, useEffect, useDebugValue, useState } from 'react'
import { useSelector } from 'react-redux'
import { Chart, registerables } from 'chart.js'
import { useNavigate } from 'react-router-dom'
import { studentDashboard } from '../../services/operations/dashboardAPI'

// ✅ Register once at module level
Chart.register(...registerables)

const DUMMY = {
  name: 'Aryan Mehta',
  streak: 12,
  totalCourses: 6,
  completedCourses: 2,
  hoursLearned: 47,
  avgQuizScore: 78,
  certificates: 2,
  enrolledCourses: [
    { id: 1, name: 'Complete MERN Stack', instructor: 'Arafat Mansuri', progress: 82, thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&q=60', lastAccessed: '2h ago', totalVideos: 48, completedVideos: 39 },
    { id: 2, name: 'React.js from Scratch', instructor: 'Arafat Mansuri', progress: 55, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=60', lastAccessed: '1d ago', totalVideos: 32, completedVideos: 18 },
    { id: 3, name: 'JavaScript Fundamentals', instructor: 'Arafat Mansuri', progress: 100, thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=200&q=60', lastAccessed: '3d ago', totalVideos: 24, completedVideos: 24 },
    { id: 4, name: 'Node.js & Express', instructor: 'Arafat Mansuri', progress: 28, thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=60', lastAccessed: '5d ago', totalVideos: 40, completedVideos: 11 },
  ],
  weeklyActivity: [2.5, 1.0, 3.5, 0.5, 4.0, 2.0, 1.5],
  quizHistory: [
    { name: 'JS Basics', score: 85, date: 'Jan 5' },
    { name: 'React Hooks', score: 72, date: 'Jan 8' },
    { name: 'Node APIs', score: 68, date: 'Jan 11' },
    { name: 'MongoDB', score: 90, date: 'Jan 14' },
    { name: 'Express MW', score: 76, date: 'Jan 17' },
  ],
  recentActivity: [
    { type: 'video', text: 'Completed "JWT Authentication" in Node.js', time: '2h ago' },
    { type: 'quiz', text: 'Scored 90% on MongoDB Quiz', time: '5h ago' },
    { type: 'enroll', text: 'Enrolled in Node.js & Express Backend Mastery', time: '1d ago' },
    { type: 'cert', text: 'Earned certificate for JavaScript Fundamentals', time: '3d ago' },
  ],
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ── WatchTimeChart ────────────────────────────────────────────────────────────
function WatchTimeChart({ weeklyActivity }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }

    // ✅ Use imported Chart directly — NOT window.Chart
    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels: DAYS,
        datasets: [{
          label: 'Hours',
          data: weeklyActivity,
          backgroundColor: '#FFD60A',
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (v) => `${v.raw}h` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#838894', font: { size: 12 } } },
          y: { grid: { color: '#2C333F' }, ticks: { color: '#838894', font: { size: 12 }, callback: (v) => `${v}h` }, min: 0, max: 5 },
        },
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [weeklyActivity])

  return <div style={{ position: 'relative', height: '180px' }}><canvas ref={canvasRef} /></div>
}

// ── QuizChart ─────────────────────────────────────────────────────────────────
function QuizChart({ quizHistory }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }

    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: quizHistory.map((q) => q.name),
        datasets: [{
          label: 'Score',
          data: quizHistory.map((q) => q.score),
          borderColor: '#FFD60A',
          backgroundColor: 'rgba(255,214,10,0.08)',
          pointBackgroundColor: '#FFD60A',
          pointRadius: 5,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (v) => `${v.raw}%` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#838894', font: { size: 11 }, maxRotation: 30 } },
          y: { grid: { color: '#2C333F' }, ticks: { color: '#838894', font: { size: 12 }, callback: (v) => `${v}%` }, min: 50, max: 100 },
        },
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [quizHistory])

  return <div style={{ position: 'relative', height: '180px' }}><canvas ref={canvasRef} /></div>
}

// ── ProgressRing ──────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 56, stroke = 5, color = '#FFD60A' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#2C333F"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 + 5}
        textAnchor="middle"
        fill="#F1F2FF"
        fontSize="12"
        fontWeight="500"
      >
        {pct}%
      </text>
    </svg>
  );
}

const activityIcon = { video: '▶', quiz: '✦', enroll: '＋', cert: '✓' }
const activityColor = { video: '#FFD60A', quiz: '#4ade80', enroll: '#60a5fa', cert: '#c084fc' }

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.profile)
  const name = user?.firstName || 'Student';
  const navigate = useNavigate();
  if (!user) {
    navigate("/login");
  }
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const data = await studentDashboard();
      setDashboardData(data);
      setLoading(false);
    };
    fetchDashboardData();
  }, []);
  return !loading && (
    <div className="min-h-screen bg-[#0F1117] text-white px-6 lg:px-8 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#838894] text-sm mb-0.5">Student Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Welcome back, {name.split(' ')[0]} 👋</h1>
        </div>
        <div className="flex items-center gap-2 bg-[#1D2532] border border-[#2C333F] rounded-xl px-4 py-2">
          <span className="text-[#FFD60A] text-lg">🔥</span>
          <span className="text-white font-semibold">{dashboardData?.streak}</span>
          <span className="text-[#838894] text-sm">day streak</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Courses Enrolled', value: dashboardData.totalCourses, sub: `${dashboardData.completedCourses} completed`, color: '#FFD60A' },
          { label: 'Hours Learned', value: `${dashboardData.hoursLearned}h`, sub: 'Total watch time', color: '#60a5fa' },
          { label: 'Avg Quiz Score', value: `${dashboardData.avgQuizScore}%`, sub: 'Across all quizzes', color: '#4ade80' },
          { label: 'Certificates', value: dashboardData.certificates, sub: 'Earned so far', color: '#c084fc' },
        ].map((s) => (
          <div key={s.label} className="bg-[#161D29] border border-[#2C333F] rounded-xl p-4">
            <p className="text-[#838894] text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[#6B7280] text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Weekly watch time */}
        <div className="lg:col-span-2 bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-white">Weekly Watch Time</p>
            <span className="text-xs text-[#838894]">This week</span>
          </div>
          <WatchTimeChart weeklyActivity={dashboardData?.weeklyActivity || []} />
        </div>

        {/* Course progress */}
        <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Course Progress</p>
          <div className="flex flex-col gap-3">
            {dashboardData.enrolledCourses?.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <ProgressRing pct={c.progress.toFixed(0)} size={48} stroke={4} color={c.progress === 100 ? '#4ade80' : '#FFD60A'} />
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-medium truncate">{c.name}</p>
                  <p className="text-[#6B7280] text-xs">{c.completedVideos}/{c.totalVideos} lectures</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Quiz chart */}
        <div className="lg:col-span-2 bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-white">Quiz Performance</p>
            <span className="text-xs bg-[#FFD60A]/10 text-[#FFD60A] px-2 py-1 rounded-full">Last 5 quizzes</span>
          </div>
          <QuizChart quizHistory={dashboardData?.quizHistory || []} />
        </div>

        {/* Recent activity */}
        <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-4">Recent Activity</p>
          <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
            {dashboardData?.recentActivity?.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: activityColor[a.type] + '20', color: activityColor[a.type] }}>
                  {activityIcon[a.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[#AFB2BF] text-xs leading-relaxed">{a.text}</p>
                  <p className="text-[#6B7280] text-xs mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrolled courses */}
      <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-semibold text-white">My Courses</p>
          <button className="text-[#FFD60A] text-xs hover:text-yellow-300 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/enrolled-courses')}>View all →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData?.enrolledCourses?.map((c) => (
            <div key={c.id} className="bg-[#0F1117] border border-[#2C333F] rounded-xl overflow-hidden hover:border-[#FFD60A]/40 transition-colors cursor-pointer" onClick={() => navigate(`/courses/${c.id}`)}>
              <div className="relative">
                <img src={c.thumbnail} alt={c.name} className="w-full h-28 object-cover" />
                {c.progress === 100 && (
                  <div className="absolute top-2 right-2 bg-[#4ade80] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    Done
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white text-xs font-semibold line-clamp-2 mb-1">{c.name}</p>
                <p className="text-[#838894] text-xs mb-2">{c.instructor}</p>
                <div className="w-full bg-[#2C333F] rounded-full h-1.5 mb-1">
                  <div className="h-1.5 rounded-full transition-all"
                    style={{ width: `${c.progress}%`, background: c.progress === 100 ? '#4ade80' : '#FFD60A' }} />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#6B7280] text-xs">{c.progress.toFixed(0)}% complete</p>
                  <p className="text-[#6B7280] text-xs">{c.lastAccessed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}