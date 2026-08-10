import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import DashboardView from './views/DashboardView'
import BlogView from './views/BlogView'
import ProjectsView from './views/ProjectsView'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardView />} />
        <Route path="blog" element={<BlogView />} />
        <Route path="projects" element={<ProjectsView />} />
      </Route>
    </Routes>
  )
}
