const Field = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = true
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="
          w-full
          rounded-xl
          border
          border-neutral-300 dark:border-neutral-700
          bg-white dark:bg-neutral-900
          px-3 py-2
          text-sm
          text-neutral-900 dark:text-neutral-100
          outline-none
          transition
          focus:border-black dark:focus:border-white
          focus:ring-1
          focus:ring-black dark:focus:ring-white
          disabled:bg-neutral-100 dark:disabled:bg-neutral-800
          disabled:cursor-not-allowed
        "
      />
    </div>
  )
}

export default Field
