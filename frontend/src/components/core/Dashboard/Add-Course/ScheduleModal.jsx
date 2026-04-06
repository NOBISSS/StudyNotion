import { useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsCalendar3, BsClock } from 'react-icons/bs'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Returns "YYYY-MM-DD" in local timezone (for <input type="date"> min attr)
const toLocalDateStr = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Returns "HH:MM" in local timezone (for <input type="time"> min attr)
const toLocalTimeStr = (date) => {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

// Human-readable summary: "Monday, 14 April 2026 at 10:30 AM"
const formatPreview = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null
  const dt = new Date(`${dateStr}T${timeStr}`)
  if (isNaN(dt.getTime())) return null
  return dt.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }) + ' at ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// Time until publish: "in 3 days, 4 hours"
const formatCountdown = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null
  const target = new Date(`${dateStr}T${timeStr}`)
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0)  return `in ${days}d ${hours}h`
  if (hours > 0) return `in ${hours}h ${mins}m`
  return `in ${mins} minutes`
}

// ─── Component ────────────────────────────────────────────────────────────────

const ScheduleModal = ({ onClose, onConfirm, loading }) => {
  const now = new Date()
  // Add 1 minute buffer so the minimum selectable time is always in the future
  const minDate = toLocalDateStr(now)

  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [error, setError]     = useState('')
  const [preview, setPreview] = useState(null)
  const [countdown, setCountdown] = useState(null)

  // Update preview + countdown whenever date/time changes
  useEffect(() => {
    setError('')
    setPreview(formatPreview(dateStr, timeStr))
    setCountdown(formatCountdown(dateStr, timeStr))
  }, [dateStr, timeStr])

  // Live countdown ticker
  useEffect(() => {
    if (!dateStr || !timeStr) return
    const id = setInterval(() => setCountdown(formatCountdown(dateStr, timeStr)), 30_000)
    return () => clearInterval(id)
  }, [dateStr, timeStr])

  // Validation — mirrors backend rules exactly
  const validate = () => {
    if (!dateStr) { setError('Please select a date.'); return false }
    if (!timeStr) { setError('Please select a time.'); return false }

    const selected = new Date(`${dateStr}T${timeStr}`)
    if (isNaN(selected.getTime())) { setError('Invalid date or time.'); return false }

    // Must be at least 5 minutes in the future (give network + processing buffer)
    const fiveMinFromNow = new Date(Date.now() + 5 * 60 * 1000)
    if (selected <= fiveMinFromNow) {
      setError('Scheduled time must be at least 5 minutes in the future.')
      return false
    }

    // Backend rejects anything more than 1 year out (optional sanity check)
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
    if (selected > oneYearFromNow) {
      setError('Cannot schedule more than 1 year in advance.')
      return false
    }

    return true
  }

  const handleConfirm = () => {
    if (!validate()) return
    // Send ISO string — backend does new Date(scheduledPublishAt)
    const isoString = new Date(`${dateStr}T${timeStr}`).toISOString()
    onConfirm(isoString)
  }

  // Compute min time: if selected date is today, restrict to now + 5m
  const minTime = dateStr === minDate ? toLocalTimeStr(new Date(Date.now() + 5 * 60 * 1000)) : '00:00'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#1D2532] rounded-2xl w-full max-w-[440px] border border-[#2C333F] shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2C333F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFD60A]/10 flex items-center justify-center">
              <BsCalendar3 className="text-[#FFD60A] text-sm" />
            </div>
            <h2 className="text-white font-semibold text-base">Schedule Publish</h2>
          </div>
          <button onClick={onClose} className="text-[#838894] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2C333F]">
            <IoClose className="text-lg" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-[#FFD60A]/5 border border-[#FFD60A]/20 rounded-xl p-3.5">
            <BsClock className="text-[#FFD60A] text-sm mt-0.5 flex-shrink-0" />
            <p className="text-[#AFB2BF] text-xs leading-relaxed">
              Choose when this course goes live. Students who wishlisted it will receive an email notification at that time.
            </p>
          </div>

          {/* Date picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white">
              Publish Date <sup className="text-pink-400">*</sup>
            </label>
            <input
              type="date"
              value={dateStr}
              min={minDate}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white text-sm
                         focus:outline-none focus:border-[#FFD60A] transition-colors
                         [color-scheme:dark] cursor-pointer"
            />
          </div>

          {/* Time picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white">
              Publish Time <sup className="text-pink-400">*</sup>
            </label>
            <input
              type="time"
              value={timeStr}
              min={minTime}
              onChange={(e) => setTimeStr(e.target.value)}
              disabled={!dateStr}
              className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white text-sm
                         focus:outline-none focus:border-[#FFD60A] transition-colors
                         [color-scheme:dark] cursor-pointer
                         disabled:opacity-40 disabled:cursor-not-allowed"
            />
            {!dateStr && (
              <p className="text-[#6B7280] text-xs">Select a date first</p>
            )}
          </div>

          {/* Preview card — shows when both are filled and valid */}
          {preview && !error && (
            <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[#838894] text-xs mb-1">Course will go live on</p>
                <p className="text-white text-sm font-semibold leading-snug">{preview}</p>
              </div>
              {countdown && (
                <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/20 whitespace-nowrap">
                  {countdown}
                </span>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <span className="text-red-400 text-base flex-shrink-0 mt-0.5">⚠</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-5 py-2.5 rounded-lg border border-[#424854] text-[#AFB2BF] text-sm font-medium
                         hover:bg-[#2C333F] hover:text-white transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !dateStr || !timeStr}
              className="flex-1 px-5 py-2.5 rounded-lg bg-[#FFD60A] text-black text-sm font-semibold
                         hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Scheduling...
                </>
              ) : (
                <>
                  <BsCalendar3 className="text-sm" />
                  Confirm Schedule
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleModal