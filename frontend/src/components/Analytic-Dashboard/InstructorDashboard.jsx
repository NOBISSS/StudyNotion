// components/core/Dashboard/InstructorDashboard.jsx
import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Chart, registerables } from 'chart.js'
import { Navigate, useNavigate } from 'react-router-dom'

// ✅ Register once at module level — not inside components
Chart.register(...registerables)

const DUMMY = {
  name: 'Arafat Mansuri',
  avatar: 'AM',
  totalCourses: 6,
  publishedCourses: 4,
  totalStudents: 1842,
  newStudentsThisMonth: 143,
  totalRevenue: 284500,
  revenueThisMonth: 38200,
  avgCourseRating: 4.6,
  totalReviews: 312,
  completionRate: 67,
  avgQuizScore: 74,
  monthlyRevenue: [18200, 22500, 19800, 31200, 27400, 35600, 38200],
  monthLabels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
  enrollmentTrend: [120, 145, 98, 167, 134, 189, 143],
  topCourses: [
    { name: 'Complete MERN Stack', students: 642, revenue: 128400, rating: 4.8, completion: 72, thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=80&q=60' },
    { name: 'React.js from Scratch', students: 489, revenue: 87820, rating: 4.7, completion: 68, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&q=60' },
    { name: 'Node.js & Express', students: 374, revenue: 55980, rating: 4.5, completion: 61, thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&q=60' },
    { name: 'JavaScript Fundamentals', students: 337, revenue: 0, rating: 4.6, completion: 82, thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=80&q=60' },
  ],
  studentLocations: [
    { country: 'India', pct: 42 }, { country: 'US', pct: 28 }, { country: 'UK', pct: 12 },
    { country: 'Canada', pct: 9 }, { country: 'Others', pct: 9 },
  ],
  recentReviews: [
    { name: 'Priya D.', course: 'MERN Stack', rating: 5, text: 'Absolutely brilliant! The real-world projects made all the difference.' },
    { name: 'Rahul K.', course: 'React.js', rating: 4, text: 'Very well structured. Could use more advanced hook examples.' },
    { name: 'Mehul J.', course: 'Node.js', rating: 5, text: 'Best backend course I have taken. Crystal clear explanations.' },
  ],
  dropOffData: [88, 75, 62, 54, 48, 41, 38],
  dropOffLabels: ['Intro', 'Ch.2', 'Ch.3', 'Ch.4', 'Ch.5', 'Ch.6', 'Ch.7'],
}

// ── RevenueChart ──────────────────────────────────────────────────────────────
function RevenueChart() {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null) // ✅ store chart instance to destroy on cleanup

  useEffect(() => {
    if (!canvasRef.current) return

    // ✅ Destroy previous instance before creating new one (handles StrictMode double-invoke)
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }

    // ✅ Use imported Chart directly — NOT window.Chart
    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels: DUMMY.monthLabels,
        datasets: [
          {
            type: 'line',
            label: 'Enrollments',
            data: DUMMY.enrollmentTrend,
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96,165,250,0.1)',
            pointBackgroundColor: '#60a5fa',
            pointRadius: 4,
            tension: 0.4,
            fill: true,
            yAxisID: 'y2',
          },
          {
            type: 'bar',
            label: 'Revenue (₹)',
            data: DUMMY.monthlyRevenue,
            backgroundColor: '#FFD60A',
            borderRadius: 6,
            borderSkipped: false,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (v) =>
                v.datasetIndex === 1
                  ? `Revenue: ₹${v.raw.toLocaleString('en-IN')}`
                  : `Enrollments: ${v.raw}`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#838894', font: { size: 12 } } },
          y1: { position: 'left', grid: { color: '#2C333F' }, ticks: { color: '#838894', font: { size: 11 }, callback: (v) => `₹${(v / 1000).toFixed(0)}k` } },
          y2: { position: 'right', grid: { display: false }, ticks: { color: '#60a5fa', font: { size: 11 } } },
        },
      },
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [])

  return <div style={{ position: 'relative', height: '200px' }}><canvas ref={canvasRef} /></div>
}

// ── DropOffChart ──────────────────────────────────────────────────────────────
function DropOffChart() {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }

    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: DUMMY.dropOffLabels,
        datasets: [{
          label: 'Retention %',
          data: DUMMY.dropOffData,
          borderColor: '#f472b6',
          backgroundColor: 'rgba(244,114,182,0.08)',
          pointBackgroundColor: '#f472b6',
          pointRadius: 5,
          tension: 0.3,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (v) => `${v.raw}% retained` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#838894', font: { size: 12 } } },
          y: { grid: { color: '#2C333F' }, ticks: { color: '#838894', font: { size: 12 }, callback: (v) => `${v}%` }, min: 0, max: 100 },
        },
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [])

  return <div style={{ position: 'relative', height: '160px' }}><canvas ref={canvasRef} /></div>
}

// ── DonutChart ────────────────────────────────────────────────────────────────
function DonutChart() {
  const canvasRef = useRef(null)
  const chartRef  = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }

    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: DUMMY.studentLocations.map((l) => l.country),
        datasets: [{
          data: DUMMY.studentLocations.map((l) => l.pct),
          backgroundColor: ['#FFD60A', '#60a5fa', '#4ade80', '#c084fc', '#2C333F'],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (v) => `${v.label}: ${v.raw}%` } },
        },
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [])

  return <div style={{ position: 'relative', height: '160px' }}><canvas ref={canvasRef} /></div>
}

const COLORS = ['#FFD60A', '#60a5fa', '#4ade80', '#c084fc', '#6B7280']

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-xs" style={{ color: i <= Math.round(rating) ? '#FFD60A' : '#2C333F' }}>★</span>
      ))}
    </div>
  )
}

export default function InstructorDashboard() {
  const { user } = useSelector((state) => state.profile)
  const name = user?.firstName || DUMMY.name.split(' ')[0]
  const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-[#0F1117] text-white px-6 lg:px-8 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#838894] text-sm mb-0.5">Instructor Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Welcome back, {name} 👋</h1>
        </div>
        <div className="flex items-center gap-2 bg-[#FFD60A]/10 border border-[#FFD60A]/20 rounded-xl px-4 py-2">
          <span className="text-[#FFD60A] text-sm font-semibold">⭐ {DUMMY.avgCourseRating}</span>
          <span className="text-[#838894] text-xs">avg rating</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Students',    value: DUMMY.totalStudents.toLocaleString('en-IN'),      sub: `+${DUMMY.newStudentsThisMonth} this month`,         color: '#FFD60A' },
          { label: 'Total Revenue',     value: `₹${(DUMMY.totalRevenue / 1000).toFixed(0)}k`,   sub: `₹${(DUMMY.revenueThisMonth / 1000).toFixed(0)}k this month`, color: '#4ade80' },
          { label: 'Courses Published', value: `${DUMMY.publishedCourses}/${DUMMY.totalCourses}`, sub: `${DUMMY.totalCourses - DUMMY.publishedCourses} in draft`, color: '#60a5fa' },
          { label: 'Completion Rate',   value: `${DUMMY.completionRate}%`,                      sub: `Avg quiz score ${DUMMY.avgQuizScore}%`,              color: '#c084fc' },
        ].map((s) => (
          <div key={s.label} className="bg-[#161D29] border border-[#2C333F] rounded-xl p-4">
            <p className="text-[#838894] text-xs mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[#6B7280] text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Enrollment chart */}
      <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5 mb-5">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <p className="text-sm font-semibold text-white">Revenue & Enrollment Trend</p>
          <div className="flex gap-4 text-xs text-[#838894]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#FFD60A' }} />Revenue (₹)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#60a5fa' }} />Enrollments
            </span>
          </div>
        </div>
        <RevenueChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Drop-off */}
        <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-semibold text-white">Student Retention</p>
            <span className="text-xs text-[#f472b6] bg-[#f472b6]/10 px-2 py-0.5 rounded-full">MERN Stack</span>
          </div>
          <p className="text-[#838894] text-xs mb-3">Drop-off by chapter</p>
          <DropOffChart />
        </div>

        {/* Locations */}
        <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-3">Student Locations</p>
          <DonutChart />
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
            {DUMMY.studentLocations.map((l, i) => (
              <span key={l.country} className="flex items-center gap-1.5 text-xs text-[#838894]">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                {l.country} {l.pct}%
              </span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-3">Recent Reviews</p>
          <div className="flex flex-col gap-3">
            {DUMMY.recentReviews.map((r, i) => (
              <div key={i} className="bg-[#0F1117] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FFD60A]/20 flex items-center justify-center text-[#FFD60A] text-xs font-bold">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">{r.name}</p>
                      <p className="text-[#6B7280] text-xs">{r.course}</p>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <p className="text-[#838894] text-xs leading-relaxed line-clamp-2">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top courses table */}
      <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-semibold text-white">Course Performance</p>
          <button className="text-[#FFD60A] text-xs hover:text-yellow-300 transition-colors cursor-pointer" onClick={()=>navigate('/dashboard/my-courses')}>Manage courses →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="border-b border-[#2C333F]">
                {['Course', 'Students', 'Revenue', 'Rating', 'Completion'].map((h) => (
                  <th key={h} className="text-left text-xs text-[#838894] font-semibold py-2 pr-4 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DUMMY.topCourses.map((c) => (
                <tr key={c.name} className="border-b border-[#2C333F] hover:bg-[#1D2532] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <span className="text-white text-xs font-medium line-clamp-2">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[#AFB2BF] text-xs font-semibold">{c.students.toLocaleString('en-IN')}</td>
                  <td className="py-3 pr-4 text-xs font-semibold" style={{ color: c.revenue > 0 ? '#4ade80' : '#838894' }}>
                    {c.revenue > 0 ? `₹${(c.revenue / 1000).toFixed(0)}k` : 'Free'}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[#FFD60A] text-xs">★</span>
                      <span className="text-white text-xs">{c.rating}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#2C333F] rounded-full h-1.5 min-w-[60px]">
                        <div className="h-1.5 rounded-full" style={{ width: `${c.completion}%`, background: c.completion >= 70 ? '#4ade80' : '#FFD60A' }} />
                      </div>
                      <span className="text-[#838894] text-xs w-8 text-right">{c.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}