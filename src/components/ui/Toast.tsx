import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  const typeStyles = {
    success: {
      bg: 'bg-white dark:bg-gray-800 border-l-4',
      border: 'border-green-500',
      text: 'text-gray-900 dark:text-white',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-white dark:bg-gray-800 border-l-4',
      border: 'border-red-500',
      text: 'text-gray-900 dark:text-white',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-white dark:bg-gray-800 border-l-4',
      border: 'border-yellow-500',
      text: 'text-gray-900 dark:text-white',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    },
    info: {
      bg: 'bg-white dark:bg-gray-800 border-l-4',
      border: 'border-blue-500',
      text: 'text-gray-900 dark:text-white',
      icon: <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const style = typeStyles[type]

  return (
    <div
      className={`
        ${style.bg} ${style.border} ${style.text}
        p-4 rounded-lg shadow-xl min-w-[300px] max-w-md
        transform transition-all duration-300 ease-out
        ring-1 ring-gray-200 dark:ring-gray-700
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium break-words">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity`}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast
