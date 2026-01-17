import { createContext, useCallback, useContext, useState } from 'react'
import ToastContainer from '../ToastContainer'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'error') => {
    const id = crypto.randomUUID()

    setToasts(prev => [
      ...prev,
      { id, message, type, visible: true }
    ])

    // trigger exit animation
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t =>
          t.id === id ? { ...t, visible: false } : t
        )
      )
    }, 2500)

    // remove after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

export const useToastContext = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used inside ToastProvider')
  }
  return ctx
}
