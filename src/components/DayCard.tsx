import { Link } from 'react-router-dom'
import { TOPICS } from '../data/topics'
import { ProgressBadge } from './ProgressBadge'
import type { DayEntry } from '../types'

interface Props {
  entry: DayEntry
  done: boolean
}

export function DayCard({ entry, done }: Props) {
  const topic = TOPICS[entry.topicId]

  return (
    <Link
      to={`/day/${entry.dayNumber}`}
      className="group relative flex flex-col rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 hover:bg-gray-800/80 transition-all overflow-hidden"
    >
      <div className={`h-1 w-full ${topic.bgClass}`} />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs text-gray-500 font-mono">Day {entry.dayNumber}</span>
          <ProgressBadge done={done} size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-bold ${topic.bgClass} ${topic.textClass}`}>
            {topic.icon}
          </span>
          <span className="text-xs font-semibold text-gray-300">{topic.name}</span>
        </div>
        <p className="text-sm text-gray-200 font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {entry.title.replace(`${topic.name}: `, '')}
        </p>
        <div className="mt-auto flex items-center gap-2 text-xs text-gray-500">
          <span>{entry.theoryReading.length} resources</span>
          <span>·</span>
          <span>1 exercise</span>
        </div>
      </div>
    </Link>
  )
}
