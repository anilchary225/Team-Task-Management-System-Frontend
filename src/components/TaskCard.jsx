import { format } from 'date-fns'
import { Calendar, User, Edit, Trash2, AlertCircle } from 'lucide-react'

const priorityColors = { low:'bg-green-100 text-green-700', medium:'bg-yellow-100 text-yellow-700', high:'bg-red-100 text-red-700' }
const statusColors = { todo:'bg-slate-100 text-slate-600', in_progress:'bg-blue-100 text-blue-700', done:'bg-green-100 text-green-700' }
const statusLabels = { todo:'To Do', in_progress:'In Progress', done:'Done' }

export default function TaskCard({ task, isAdmin, onEdit, onDelete, onStatusChange }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow ${isOverdue ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isOverdue && <AlertCircle size={14} className="text-red-500 flex-shrink-0"/>}
            <h3 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h3>
          </div>
          {task.description && <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>}
        </div>
        {isAdmin && (
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => onEdit(task)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><Edit size={14}/></button>
            <button onClick={() => onDelete(task.id)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600"><Trash2 size={14}/></button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
        <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}
          className={`text-xs px-2 py-0.5 rounded-full font-medium border-0 cursor-pointer ${statusColors[task.status]}`}>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
        {task.due_date && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
            <Calendar size={12}/>{format(new Date(task.due_date), 'MMM d, yyyy')}
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center gap-1">
            <User size={12}/>{task.assignee.name}
          </div>
        )}
      </div>
    </div>
  )
}