import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here', message = '', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-slate-400" size={32} />
      </div>
      <h3 className="text-slate-700 font-semibold text-lg">{title}</h3>
      {message && <p className="text-slate-500 mt-1 text-sm">{message}</p>}
    </div>
  )
}
