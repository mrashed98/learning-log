interface Props {
  done: boolean
  size?: 'sm' | 'md'
}

export function ProgressBadge({ done, size = 'md' }: Props) {
  const base = size === 'sm'
    ? 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium'
    : 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold'

  if (done) {
    return (
      <span className={`${base} bg-green-900/60 text-green-300 border border-green-700/50`}>
        <span className={size === 'sm' ? 'text-[10px]' : 'text-xs'}>✓</span>
        {size !== 'sm' && 'Done'}
      </span>
    )
  }

  return (
    <span className={`${base} bg-gray-800 text-gray-500 border border-gray-700`}>
      <span className={size === 'sm' ? 'text-[10px]' : 'text-xs'}>–</span>
      {size !== 'sm' && 'Pending'}
    </span>
  )
}
