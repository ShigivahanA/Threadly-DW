const VARIANTS = {
  success: {
    bg: 'bg-emerald-500',
    text: 'text-white'
  },
  error: {
    bg: 'bg-red-500',
    text: 'text-white'
  },
  warning: {
    bg: 'bg-amber-400',
    text: 'text-black'
  },
  info: {
    bg: 'bg-neutral-900',
    text: 'text-white'
  }
}

const Toast = ({ toast }) => {
  const variant = VARIANTS[toast.type] || VARIANTS.info

  return (
    <div
      className={`
        pointer-events-auto
        min-w-[260px]
        max-w-[360px]
        rounded-xl
        px-4 py-3
        text-sm
        shadow-lg
        transition-all duration-300 ease-out
        ${toast.visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-2 scale-95'
        }
        ${variant.bg}
        ${variant.text}
      `}
    >
      {toast.message}
    </div>
  )
}

export default Toast
