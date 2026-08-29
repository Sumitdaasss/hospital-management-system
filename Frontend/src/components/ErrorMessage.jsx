import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="text-red-600" size={28} />
      </div>
      <p className="text-red-600 font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-4">
          Try Again
        </button>
      )}
    </div>
  )
}
