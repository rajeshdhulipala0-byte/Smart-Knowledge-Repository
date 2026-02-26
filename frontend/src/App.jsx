import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import CreateKnowledge from './pages/CreateKnowledge'
import EditKnowledge from './pages/EditKnowledge'
import KnowledgeDetails from './pages/KnowledgeDetails'
import Search from './pages/Search'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="search" element={<Search />} />
          <Route path="knowledge/:id" element={<KnowledgeDetails />} />
          
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreateKnowledge />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <EditKnowledge />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="analytics"
            element={
              <ProtectedRoute requireAdmin>
                <Analytics />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
