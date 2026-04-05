import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TodayPage } from './pages/TodayPage'
import { SchedulePage } from './pages/SchedulePage'
import { DayPage } from './pages/DayPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TodayPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="day/:dayNumber" element={<DayPage />} />
      </Route>
    </Routes>
  )
}

export default App
