import { Link } from 'react-router-dom'
import { SCHEDULE } from '../data/schedule'
import { TOPICS } from '../data/topics'
import { useProgress } from '../hooks/useProgress'

// Determine today's day entry from the rotation
function getTodayEntry() {
  const now = new Date()

  // ISO weekday: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
  const jsDay = now.getDay() // 0=Sun ... 6=Sat
  const isoDay = jsDay === 0 ? 6 : jsDay - 1

  // Determine A/B week using the Monday-aligned week number parity.
  // mondayEpoch = epoch day of this week's Monday — gives a stable, timezone-safe
  // week identifier. Even weeks = Week A, odd = Week B (or vice versa; the
  // exact parity just determines which real calendar weeks land on A vs B).
  const epochDay = Math.floor(now.getTime() / 86400000)
  const mondayEpoch = epochDay - isoDay
  const rotationWeek: 1 | 2 = Math.floor(mondayEpoch / 7) % 2 === 0 ? 1 : 2

  const week = rotationWeek
  const dayInWeek = isoDay + 1 // 1–7

  const match = SCHEDULE.find(
    d => d.weekInRotation === week && d.dayInRotation === dayInWeek
  )

  return match ?? SCHEDULE[0]
}

export function TodayPage() {
  const { isDone, toggleDone, completedCount, streak } = useProgress()
  const entry = getTodayEntry()
  const topic = TOPICS[entry.topicId]
  const done = isDone(entry.dayNumber)

  const totalDays = SCHEDULE.length

  return (
    <div className="flex flex-col gap-8">
      {/* Hero card */}
      <div className="rounded-2xl border border-gray-800 overflow-hidden">
        <div className={`px-6 py-5 ${topic.bgClass} bg-opacity-20 border-b border-gray-800 relative`}>
          <div className={`absolute inset-0 opacity-10 ${topic.bgClass}`} />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-10 h-10 rounded-xl text-xl font-bold ${topic.bgClass} ${topic.textClass}`}>
                {topic.icon}
              </span>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Today's Topic</p>
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
            const isToday = d.dayNumber === entry.dayNumber
            const completed = isDone(d.dayNumber)
            return (
              <Link
                key={d.dayNumber}
                to={`/day/${d.dayNumber}`}
                title={`Day ${d.dayNumber}: ${d.title}`}
                className={`aspect-square rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all
                  ${completed ? `${t.bgClass} ${t.textClass} opacity-90` : 'bg-gray-800 text-gray-600'}
                  ${isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-gray-950' : 'hover:opacity-80'}
                `}
              >
                {d.dayNumber}
              </Link>
            )
          })}
        </div>
        <p className="text-xs text-gray-600 mt-2">Click any day to open it. Today is highlighted.</p>
      </div>

      {/* Quick links to upcoming days */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Up Next</h2>
        <div className="flex flex-col gap-2">
          {SCHEDULE.slice(entry.dayNumber, entry.dayNumber + 3).map(d => {
            const t = TOPICS[d.topicId]
            return (
              <Link
                key={d.dayNumber}
                to={`/day/${d.dayNumber}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/60 transition-all group"
              >
                <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm ${t.bgClass} ${t.textClass}`}>
                  {t.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-mono">Day {d.dayNumber}</p>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">{d.title}</p>
                </div>
                <span className="text-gray-600 group-hover:text-gray-400 transition-colors text-xs">→</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
