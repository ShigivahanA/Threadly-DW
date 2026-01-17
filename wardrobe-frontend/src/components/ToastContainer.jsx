import Toast from './ui/Toast'

const ToastContainer = ({ toasts }) => {
  return (
    <div
      className="
        fixed top-5 right-6 z-[9999]
        flex flex-col gap-2
        pointer-events-none
      "
    >
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer
