import { useParams, Link, useNavigate } from 'react-router-dom'
import { SCHEDULE } from '../data/schedule'
import { TOPICS } from '../data/topics'
import { useProgress } from '../hooks/useProgress'
import { ResourceLink } from '../components/ResourceLink'
import { RevealBlock } from '../components/RevealBlock'

export function DayPage() {
  const { dayNumber } = useParams<{ dayNumber: string }>()
  const navigate = useNavigate()
  const { isDone, toggleDone } = useProgress()

  const day = parseInt(dayNumber ?? '1', 10)
  const entry = SCHEDULE.find(d => d.dayNumber === day)

  if (!entry) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Day not found.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">Go home</Link>
      </div>
    )
  }

  const topic = TOPICS[entry.topicId]
  const done = isDone(entry.dayNumber)
  const prev = SCHEDULE.find(d => d.dayNumber === day - 1)
  const next = SCHEDULE.find(d => d.dayNumber === day + 1)

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {/* Back + nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          {prev && (
            <Link to={`/day/${prev.dayNumber}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded bg-gray-900 border border-gray-800">
              ← Day {prev.dayNumber}
            </Link>
          )}
          {next && (
            <Link to={`/day/${next.dayNumber}`} className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded bg-gray-900 border border-gray-800">
              Day {next.dayNumber} →
            </Link>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-gray-800 overflow-hidden">
        <div className={`h-1.5 w-full ${topic.bgClass}`} />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-11 h-11 rounded-xl text-2xl ${topic.bgClass} ${topic.textClass}`}>
                {topic.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500">Day {entry.dayNumber} of 30</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${topic.bgClass} ${topic.textClass}`}>
                    {topic.name}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-white mt-1">{entry.title}</h1>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => toggleDone(entry.dayNumber)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                done
                  ? 'bg-green-900/40 text-green-300 border border-green-700/60 hover:bg-green-900/60'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white'
              }`}
            >
              {done ? '✓ Completed' : '○ Mark as Done'}
            </button>
            <span className="text-xs text-gray-500 bg-gray-800/60 px-3 py-2 rounded-xl border border-gray-800">
              Week {entry.weekInRotation} · ~45 min
            </span>
          </div>
        </div>
      </div>

      {/* Theory Reading */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/50 text-blue-400 text-xs font-bold border border-blue-800/50">1</span>
          <h2 className="text-base font-semibold text-white">Theory Reading</h2>
          <span className="text-xs text-gray-500 ml-1">({entry.theoryReading.length} resources)</span>
        </div>
        <div className="flex flex-col gap-2">
          {entry.theoryReading.map((res, i) => (
            <ResourceLink key={i} resource={res} />
          ))}
        </div>
      </section>

      {/* Exercise */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-900/50 text-purple-400 text-xs font-bold border border-purple-800/50">2</span>
          <h2 className="text-base font-semibold text-white">Hands-On Exercise</h2>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 flex flex-col gap-4">
          <p className="text-sm text-gray-300 leading-relaxed">{entry.exercise.description}</p>

          {entry.exercise.steps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Steps</p>
              <ol className="flex flex-col gap-2.5">
                {entry.exercise.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-gray-400 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-300 leading-relaxed font-mono">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* Hidden Answer */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-900/50 text-green-400 text-xs font-bold border border-green-800/50">3</span>
          <h2 className="text-base font-semibold text-white">Answer</h2>
          <span className="text-xs text-gray-600">— try the exercise first!</span>
        </div>
        <RevealBlock hint={entry.exercise.answerHint} answer={entry.exercise.answer} />
      </section>

      {/* Footer nav */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
        {prev ? (
          <Link to={`/day/${prev.dayNumber}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Day {prev.dayNumber}</span>
          </Link>
        ) : <div />}
        <Link to="/schedule" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">View Schedule</Link>
        {next ? (
          <Link to={`/day/${next.dayNumber}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
            <span>Day {next.dayNumber}</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        ) : (
          <div className="text-xs text-gray-600">🎉 Last day!</div>
        )}
      </div>
    </div>
  )
}
