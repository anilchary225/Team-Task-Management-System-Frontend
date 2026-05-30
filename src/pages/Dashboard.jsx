import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { CheckCircle, Clock, AlertTriangle, FolderOpen } from 'lucide-react'

const COLORS = ['#64748b', '#3b82f6', '#22c55e']

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    API.get('/dashboard').then(r => setData(r.data)).catch(console.error)
  }, [])

  if (!data) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>

  const statusData = [
    { name: 'To Do', value: data.by_status.todo, color: '#64748b' },
    { name: 'In Progress', value: data.by_status.in_progress, color: '#3b82f6' },
    { name: 'Done', value: data.by_status.done, color: '#22c55e' },
  ]
  const userTaskData = Object.entries(data.tasks_per_user).map(([name, count]) => ({ name, count }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.name} 👋</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: data.total_tasks, icon: <CheckCircle className="text-blue-500" size={24}/>, bg: 'bg-blue-50' },
          { label: 'In Progress', value: data.by_status.in_progress, icon: <Clock className="text-yellow-500" size={24}/>, bg: 'bg-yellow-50' },
          { label: 'Overdue', value: data.overdue, icon: <AlertTriangle className="text-red-500" size={24}/>, bg: 'bg-red-50' },
          { label: 'Projects', value: data.total_projects, icon: <FolderOpen className="text-purple-500" size={24}/>, bg: 'bg-purple-50' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${card.bg}`}>{card.icon}</div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={250} className="mx-auto">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
              </Pie>
              <Tooltip/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Tasks per Team Member</h2>
          {userTaskData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No assigned tasks yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={userTaskData}>
                <XAxis dataKey="name" tick={{fontSize:12}}/>
                <YAxis allowDecimals={false} tick={{fontSize:12}}/>
                <Tooltip/>
                <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}