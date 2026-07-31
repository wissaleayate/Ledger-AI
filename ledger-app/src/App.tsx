import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageShell } from '@/components/layout/PageShell'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TeamPage } from '@/pages/TeamPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — no sidebar shell */}
        <Route path="/" element={<LandingPage />} />

        {/* App shell — sidebar + topbar */}
        <Route
          path="/*"
          element={
            <PageShell>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </PageShell>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
