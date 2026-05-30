import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, FolderKanban, LogOut, CheckSquare } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const nav = [
    { to: '/dashboard', icon: <LayoutDashboard size={18}/>, label: 'Dashboard' },
    { to: '/projects', icon: <FolderKanban size={18}/>, label: 'Projects' },
  ]
  return (
    <nav className="bg-slate-900 text-white h-screen w-64 flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-blue-400" size={24}/>
          <span className="font-bold text-xl">TaskFlow</span>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-1">
        {nav.map(n => (
          <Link key={n.to} to={n.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname.startsWith(n.to) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            {n.icon}{n.label}
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-sm">
          <LogOut size={16}/> Sign Out
        </button>
      </div>
    </nav>
  )
}