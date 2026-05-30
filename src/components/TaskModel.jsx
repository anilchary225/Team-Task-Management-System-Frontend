import { useState } from 'react'
import { X } from 'lucide-react'
import API from '../api/axios'
import toast from 'react-hot-toast'

export default function TaskModal({ projectId, members, task, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date ? task.due_date.slice(0, 16) : '',
    priority: task?.priority || 'medium',
    assigned_to: task?.assigned_to || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    setLoading(true)
    try {
      const payload = { ...form, assigned_to: form.assigned_to || null, due_date: form.due_date || null }
      if (task) {
        await API.put(`/projects/${projectId}/tasks/${task.id}`, payload)
        toast.success('Task updated!')
      } else {
        await API.post(`/projects/${projectId}/tasks`, payload)
        toast.success('Task created!')
      }
      onSave()
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error saving task')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Task title"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional description"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="datetime-local" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})}/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})}>
              <option value="">Unassigned</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : (task ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  )
}