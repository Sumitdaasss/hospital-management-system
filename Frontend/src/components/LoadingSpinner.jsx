import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ message = 'Loading...', size = 32 }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <Loader2 className="text-primary-600 animate-spin" size={size} />
      <p className="mt-3 text-slate-500 text-sm">{message}</p>
    </div>
  )
}
