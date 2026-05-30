import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className="ml-64 flex-1 p-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right"/>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace/>}/>
            <Route path="dashboard" element={<Dashboard/>}/>
            <Route path="projects" element={<Projects/>}/>
            <Route path="projects/:id" element={<ProjectDetail/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}