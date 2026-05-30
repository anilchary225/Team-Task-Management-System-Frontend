import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { Plus, FolderOpen, Trash2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchProjects = () => API.get('/projects').then(r => setProjects(r.data))
  useEffect(() => { fetchProjects() }, [])

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error('Project name required')
    setLoading(true)
    try {
      await API.post('/projects', form)
      toast.success('Project created!')
      setShowModal(false)
      setForm({ name: '', description: '' })
      fetchProjects()
    } catch (e) { toast.error(e.response?.data?.detail || 'Error') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id, e) => {
    e.preventDefault()
    if (!confirm('Delete this project?')) return
    try {
      await API.delete(`/projects/${id}`)
      toast.success('Project deleted')
      fetchProjects()
    } catch (e) { toast.error(e.response?.data?.detail || 'Error') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your team's projects</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={18}/> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <FolderOpen size={48} className="mx-auto text-gray-300 mb-3"/>
          <h3 className="text-gray-600 font-medium">No projects yet</h3>
          <p className="text-gray-400 text-sm mt-1">Create your first project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <Link to={`/projects/${p.id}`} key={p.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group relative">
              {p.created_by === user?.id && (
                <button onClick={e => handleDelete(p.id, e)}
                  className="absolute top-4 right-4 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all">
                  <Trash2 size={16}/>
                </button>
              )}
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FolderOpen size={20} className="text-blue-600"/>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{p.description || 'No description'}</p>
              <div className="mt-4 text-xs text-gray-400">
                <div className="flex items-center justify-between">
                  <p>{p.created_by === user?.id ? '👑 Admin' : '👤 Member'}</p>
                  {/* <p>Created by : {p.created_by}</p> */}
                  <p>{new Date(p.created_at).toLocaleDateString()}</p>
                </div>

              </div>

            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">New Project</h2>
              <button onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="My Awesome Project"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What is this project about?"/>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setShowModal(false)} className="flex-1 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={loading}
                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}