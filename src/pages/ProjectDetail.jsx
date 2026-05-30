import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { Plus, UserPlus, X, Users, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModel'
import Projects from './Projects';

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: 'bg-slate-100' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-blue-50' },
  { key: 'done', label: 'Done', color: 'bg-green-50' },
]

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [role, setRole] = useState('member')
  const [taskModal, setTaskModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [memberModal, setMemberModal] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole] = useState('member')
  const [ProjectCreatedBy, setProjectCreatedBy] = useState('')

  const fetchAll = async () => {
    const [proj, taskRes] = await Promise.all([
      API.get(`/projects/${id}`),
      API.get(`/projects/${id}/tasks`)
    ])
    setProject(proj.data.project)
    setMembers(proj.data.members)
    setRole(proj.data.your_role)
    setTasks(taskRes.data)
    setProjectCreatedBy(proj.data.created_by)
  }

  useEffect(() => { fetchAll() }, [id])

  const handleDelete = async taskId => {
    if (!confirm('Delete this task?')) return
    try {
      await API.delete(`/projects/${id}/tasks/${taskId}`)
      toast.success('Task deleted')
      fetchAll()
    } catch (e) { toast.error(e.response?.data?.detail || 'Error') }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      await API.put(`/projects/${id}/tasks/${taskId}`, { status })
      fetchAll()
    } catch (e) { toast.error(e.response?.data?.detail || 'Error') }
  }

  const handleAddMember = async () => {
    try {
      await API.post(`/projects/${id}/members`, { email: memberEmail, role: memberRole })
      toast.success('Member added!')
      setMemberModal(false)
      setMemberEmail('')
      fetchAll()
    } catch (e) { toast.error(e.response?.data?.detail || 'Error') }
  }

  const handleRemoveMember = async userId => {
    if (!confirm('Remove this member?')) return
    try {
      await API.delete(`/projects/${id}/members/${userId}`)
      toast.success('Member removed')
      fetchAll()
    } catch (e) { toast.error(e.response?.data?.detail || 'Error') }
  }

  if (!project) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>

  const isAdmin = role === 'admin'

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/projects" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20}/></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          {project.description && (
            <p className="text-gray-500 text-sm mt-0.5">
              {project.description}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Created by: {ProjectCreatedBy.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button onClick={() => setMemberModal(true)}
                className="flex items-center gap-2 border px-3 py-2 rounded-xl text-sm hover:bg-gray-50">
                <Users size={16}/> Members ({members.length})
              </button>
              <button onClick={() => { setEditTask(null); setTaskModal(true) }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
                <Plus size={16}/> Add Task
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key)
          return (
            <div key={col.key} className={`${col.color} rounded-2xl p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700">{col.label}</h2>
                <span className="bg-white text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <div className="space-y-3">
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} isAdmin={isAdmin}
                    onEdit={t => { setEditTask(t); setTaskModal(true) }}
                    onDelete={handleDelete} onStatusChange={handleStatusChange}/>
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">No tasks here</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {taskModal && (
        <TaskModal projectId={id} members={members} task={editTask}
          onClose={() => { setTaskModal(false); setEditTask(null) }}
          onSave={() => { setTaskModal(false); setEditTask(null); fetchAll() }}/>
      )}

      {memberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <button onClick={() => setMemberModal(false)}><X size={20}/></button>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {m.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${m.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {m.role}
                      </span>
                      {isAdmin && m.role !== 'admin' && (
                        <button onClick={() => handleRemoveMember(m.id)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {isAdmin && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Add Member</p>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email address" value={memberEmail} onChange={e => setMemberEmail(e.target.value)}/>
                  <div className="flex gap-2">
                    <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      value={memberRole} onChange={e => setMemberRole(e.target.value)}>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={handleAddMember}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700">
                      <UserPlus size={16}/> Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}