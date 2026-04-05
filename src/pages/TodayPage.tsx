import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SCHEDULE } from '../data/schedule'
import { TOPICS } from '../data/topics'
import { useProgress } from '../hooks/useProgress'

const START_KEY = 'learning-log-start-date'

function getStartDate(): string | null {
  return localStorage.getItem(START_KEY)
}

function saveStartDate(): string {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  localStorage.setItem(START_KEY, today)
  return today
}

function getCurrentDayNumber(startDateStr: string): number {
  const start = new Date(startDateStr)
  const now = new Date()
  // Compare calendar dates only (ignore time)
  const startDay = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const todayDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const elapsed = Math.floor((todayDay - startDay) / 86400000)
  return Math.min(elapsed + 1, SCHEDULE.length) // Day 1 on start date
}

export function TodayPage() {
  const { isDone, toggleDone, completedCount, streak } = useProgress()
  const [startDate, setStartDate] = useState<string | null>(getStartDate)

  const totalDays = SCHEDULE.length

  // ── Empty / onboarding state ──────────────────────────────────────────────
  if (!startDate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-3xl">
            📖
          </div>
          <h1 className="text-2xl font-bold text-white">Ready to start your 30-day journey?</h1>
          <p className="text-gray-400 max-w-md leading-relaxed">
            1% better every day. Each day unlocks one topic from the 2-week DevOps rotation —
            Kubernetes, Go, Terraform, Python, Bash, and more. Complete all 30 days to
            cover every tool in the stack.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm text-center">
          {['13 Topics', '30 Days', '~45 min/day'].map(label => (
            <div key={label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-3">
              <p className="text-sm font-semibold text-gray-200">{label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const d = saveStartDate()
            setStartDate(d)
          }}
          className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all cursor-pointer"
        >
          Begin 30-Day Journey →
        </button>

        <p className="text-xs text-gray-600">
          Progress is saved in your browser. No account needed.
        </p>
      </div>
    )
  }

  // ── Active learning state ─────────────────────────────────────────────────
  const currentDay = getCurrentDayNumber(startDate)
  const entry = SCHEDULE[currentDay - 1]
  const topic = TOPICS[entry.topicId]
  const done = isDone(entry.dayNumber)
  const isFinished = currentDay >= totalDays && completedCount === totalDays

  // ── Completion state ──────────────────────────────────────────────────────
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold text-white">You completed the 30-day journey!</h1>
        <p className="text-gray-400 max-w-md">
          That's 1% every day for 30 days. Keep the rotation going — head to the schedule to continue.
        </p>
        <Link to="/schedule" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all">
          View Full Schedule →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero card */}
      <div className="rounded-2xl border border-gray-800 overflow-hidden">
        <div className={`px-6 py-5 border-b border-gray-800 relative`}>
          <div className={`absolute inset-0 opacity-10 ${topic.bgClass}`} />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl font-bold ${topic.bgClass} ${topic.textClass}`}>
                {topic.icon}
              </span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Day {currentDay} of {totalDays}
                </p>
                <h1 className="text-xl font-bold text-white mt-0.5">{topic.name}</h1>
              </div>
            </div>
            <button
              onClick={() => toggleDone(entry.dayNumber)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                done
                  ? 'bg-green-900/50 text-green-300 border border-green-700 hover:bg-green-900/70'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white'
              }`}
            >
              {done ? '✓ Done' : 'Mark Done'}
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-900/40">
          <h2 className="text-lg font-semibold text-white mb-1">{entry.title}</h2>
          <p className="text-sm text-gray-400">{topic.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
              {entry.theoryReading.length} resources
            </span>
            <span className="text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
              1 exercise + hidden answer
            </span>
            <span className="text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
              ~45 min
            </span>
          </div>

          <Link
            to={`/day/${entry.dayNumber}`}
            className={`mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${topic.bgClass} ${topic.textClass} hover:opacity-90`}
          >
            Start Today's Work →
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-white font-mono">{completedCount}</div>
          <div className="text-xs text-gray-500 mt-1">Days completed</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-400 font-mono">{streak}</div>
          <div className="text-xs text-gray-500 mt-1">Day streak</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-gray-300 font-mono">{totalDays - completedCount}</div>
          <div className="text-xs text-gray-500 mt-1">Days remaining</div>
        </div>
      </div>

      {/* 30-day progress grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">30-Day Progress</h2>
        <div className="grid grid-cols-10 gap-1.5">
          {SCHEDULE.map(d => {
            const t = TOPICS[d.topicId]
            const isToday = d.dayNumber === currentDay
            const isFuture = d.dayNumber > currentDay
            const completed = isDone(d.dayNumber)
            return (
              <Link
                key={d.dayNumber}
                to={isFuture ? '#' : `/day/${d.dayNumber}`}
                title={`Day ${d.dayNumber}: ${d.title}`}
                className={`aspect-square rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all
                  ${completed ? `${t.bgClass} ${t.textClass} opacity-90` : isFuture ? 'bg-gray-900 text-gray-700 cursor-default' : 'bg-gray-800 text-gray-500'}
                  ${isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-950' : isFuture ? '' : 'hover:opacity-80'}
                `}
              >
                {d.dayNumber}
              </Link>
            )
          })}
        </div>
        <p className="text-xs text-gray-600 mt-2">Today is highlighted. Future days are locked.</p>
      </div>

      {/* Up next */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Up Next</h2>
        <div className="flex flex-col gap-2">
          {SCHEDULE.slice(currentDay, currentDay + 3).map(d => {
            const t = TOPICS[d.topicId]
            return (
              <div
                key={d.dayNumber}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-gray-900/30 opacity-60"
              >
                <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm ${t.bgClass} ${t.textClass} opacity-60`}>
                  {t.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-mono">Day {d.dayNumber}</p>
                  <p className="text-sm text-gray-500 truncate">{d.title}</p>
                </div>
                <span className="text-gray-700 text-xs">🔒</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
