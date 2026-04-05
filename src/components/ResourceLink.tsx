import type { Resource, ResourceType } from '../types'

const ICONS: Record<ResourceType, string> = {
  docs: '📄',
  video: '▶',
  article: '📰',
  github: '⌥',
  book: '📚',
}

const LABELS: Record<ResourceType, string> = {
  docs: 'Docs',
  video: 'Video',
  article: 'Article',
  github: 'GitHub',
  book: 'Book',
}

const TYPE_CLASSES: Record<ResourceType, string> = {
  docs: 'bg-blue-900/40 text-blue-300 border-blue-800/50',
  video: 'bg-red-900/40 text-red-300 border-red-800/50',
  article: 'bg-gray-800 text-gray-400 border-gray-700',
  github: 'bg-gray-800 text-gray-300 border-gray-700',
  book: 'bg-amber-900/40 text-amber-300 border-amber-800/50',
}

interface Props {
  resource: Resource
}

export function ResourceLink({ resource }: Props) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 hover:bg-gray-800/80 transition-colors group"
    >
      <span className={`flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold border ${TYPE_CLASSES[resource.type]}`}>
        {ICONS[resource.type]}
      </span>
      <span className="flex-1 text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-1">
        {resource.title}
      </span>
      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded border ${TYPE_CLASSES[resource.type]}`}>
        {LABELS[resource.type]}
      </span>
      <span className="flex-shrink-0 text-gray-600 group-hover:text-gray-400 transition-colors text-xs">↗</span>
    </a>
  )
}
