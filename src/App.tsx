import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import BlogView from './views/BlogView'
import PostView from './views/PostView'
import ProjectsView from './views/ProjectsView'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/blog" replace />} />
        <Route path="blog" element={<BlogView />} />
        <Route path="blog/:id" element={<PostView />} />
        <Route path="projects" element={<ProjectsView />} />
      </Route>
    </Routes>
  )
}
