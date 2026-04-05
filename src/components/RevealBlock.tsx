import { useState } from 'react'

interface Props {
  hint?: string
  answer: string
}

export function RevealBlock({ hint, answer }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-4 bg-gray-900/50">
        {hint && (
          <p className="text-sm text-gray-400 mb-3">
            <span className="text-yellow-500 font-semibold">Hint:</span> {hint}
          </p>
        )}
        <button
          onClick={() => setOpen(v => !v)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            open
              ? 'bg-green-900/30 text-green-300 border border-green-700/50'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <span>{open ? '🔓' : '🔒'}</span>
            {open ? 'Hide Answer' : 'Show Answer'}
          </span>
          <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      <div className={open ? 'reveal-open' : 'reveal-closed'}>
        <div className="px-4 pb-4 bg-gray-900/30 border-t border-gray-800">
          <div className="mt-4 p-4 rounded-lg bg-gray-900 border-l-4 border-green-500">
            <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {answer}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
