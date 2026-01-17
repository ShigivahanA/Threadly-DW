const AnimatedSection = ({ show, children, compact = false }) => (
  <div
    className={`
      overflow-hidden
      transition-all duration-300 ease-out
      ${show
        ? 'max-h-[320px] opacity-100 translate-y-0'
        : 'max-h-0 opacity-0 -translate-y-2'}
    `}
  >
    <div className={compact ? '' : 'space-y-4'}>
      {children}
    </div>
  </div>
)

export default AnimatedSection
