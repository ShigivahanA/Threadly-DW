import { useTheme } from '../../context/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        relative w-12 h-6
        rounded-full
        border
        bg-neutral-200 dark:bg-neutral-700
        transition-colors duration-300
        flex items-center
      "
    >
      {/* Thumb */}
      <span
        className={`
          absolute
          left-0.5
          h-5 w-5
          rounded-full
          bg-white
          shadow
          flex items-center justify-center
          text-xs
          transition-transform duration-300
          ${isDark ? 'translate-x-6' : 'translate-x-0'}
        `}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}

export default ThemeToggle
