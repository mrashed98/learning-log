import { Link, useLocation, Outlet } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { SCHEDULE } from '../data/schedule'

export function Layout() {
  const location = useLocation()
  const { completedCount } = useProgress()
  const total = SCHEDULE.length

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
    return (
      <Link
        to={to}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-white">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-600 text-sm">📖</span>
            <span className="hidden sm:block">learning<span className="text-indigo-400">-log</span></span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLink('/', 'Today')}
            {navLink('/schedule', 'Schedule')}
          </nav>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / total) * 100}%` }}
                />
              </div>
              <span className="font-mono">{completedCount}/{total}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-gray-800 py-6 mt-12">
        <p className="text-center text-xs text-gray-600">
          1% better every day · DevOps learning tracker
        </p>
      </footer>
    </div>
  )
}
