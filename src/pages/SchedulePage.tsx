import { Link } from 'react-router-dom'
import { SCHEDULE } from '../data/schedule'
import { TOPICS, ROTATION } from '../data/topics'
import { useProgress } from '../hooks/useProgress'
import { ProgressBadge } from '../components/ProgressBadge'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function SchedulePage() {
  const { isDone, toggleDone } = useProgress()

  return (
    <div className="flex flex-col gap-10">
      {/* 2-Week Rotation Grid */}
      <section>
        <h1 className="text-xl font-bold text-white mb-1">2-Week Rotation</h1>
        <p className="text-sm text-gray-400 mb-5">The recurring topic schedule — repeats every 14 days.</p>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-xs text-gray-600 uppercase tracking-wider text-right pr-2 flex items-end pb-1">Week</div>
              {WEEK_DAYS.map(d => (
                <div key={d} className="text-xs text-gray-500 text-center font-medium uppercase tracking-wider">{d}</div>
              ))}
            </div>

            {/* Week A */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="flex items-center justify-end pr-2">
                <span className="text-xs font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">A</span>
              </div>
              {ROTATION.slice(0, 7).map((slot, i) => {
                const topic = TOPICS[slot.topicId]
                return (
                  <div key={i} className={`rounded-lg p-2 text-center border ${topic.borderClass}/30 bg-gray-900`}>
                    <div className={`text-lg`}>{topic.icon}</div>
                    <div className="text-xs font-semibold text-gray-300 mt-1 truncate">{topic.name}</div>
                  </div>
                )
              })}
            </div>

            {/* Week B */}
            <div className="grid grid-cols-8 gap-2">
              <div className="flex items-center justify-end pr-2">
                <span className="text-xs font-bold text-gray-500 bg-gray-800 px-2 py-1 rounded">B</span>
              </div>
              {ROTATION.slice(7, 14).map((slot, i) => {
                const topic = TOPICS[slot.topicId]
                return (
                  <div key={i} className={`rounded-lg p-2 text-center border ${topic.borderClass}/30 bg-gray-900`}>
                    <div className="text-lg">{topic.icon}</div>
                    <div className="text-xs font-semibold text-gray-300 mt-1 truncate">{topic.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Topic legend */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">13 Topics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Object.values(TOPICS).map(topic => (
            <div key={topic.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-900 border border-gray-800">
              <span className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-sm ${topic.bgClass} ${topic.textClass}`}>
                {topic.icon}
              </span>
              <span className="text-sm text-gray-300 font-medium truncate">{topic.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 30-Day Schedule Table */}
      <section>
        <h2 className="text-xl font-bold text-white mb-1">30-Day Plan</h2>
        <p className="text-sm text-gray-400 mb-5">Click a row to open the day detail. Toggle done inline.</p>

        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/80">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12">Day</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">Topic</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20 hidden sm:table-cell">Resources</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((entry, i) => {
                  const topic = TOPICS[entry.topicId]
                  const done = isDone(entry.dayNumber)
                  return (
                    <tr
                      key={entry.dayNumber}
                      className={`border-b border-gray-800/50 transition-colors ${
                        done ? 'bg-gray-900/30' : i % 2 === 0 ? 'bg-gray-900/10' : 'bg-transparent'
                      } hover:bg-gray-800/40`}
                    >
                      <td className="px-4 py-3">
                        <Link to={`/day/${entry.dayNumber}`} className="font-mono text-gray-500 hover:text-gray-300 transition-colors">
                          {String(entry.dayNumber).padStart(2, '0')}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/day/${entry.dayNumber}`} className="flex items-center gap-2 group">
                          <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded text-xs ${topic.bgClass} ${topic.textClass}`}>
                            {topic.icon}
                          </span>
                          <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors hidden sm:block">{topic.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/day/${entry.dayNumber}`} className={`font-medium hover:text-white transition-colors ${done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                          {entry.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-gray-600">{entry.theoryReading.length}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleDone(entry.dayNumber)}
                          className="cursor-pointer"
                        >
                          <ProgressBadge done={done} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
