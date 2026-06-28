import { AlertTriangle, Inbox, RotateCw } from 'lucide-react'

/**
 * Renders an error or empty state in the interface's own voice — no mock
 * data is ever substituted in. Used wherever a list could legitimately come
 * back empty or a request could legitimately fail.
 *
 * variant: 'error' | 'empty'
 */
export default function StatusMessage({
  variant = 'empty',
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  children,
}) {
  const isError = variant === 'error'
  const Icon = isError ? AlertTriangle : Inbox

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-line px-6 py-12 text-center animate-fadeUp">
      <Icon className={isError ? 'h-6 w-6 text-crimson' : 'h-6 w-6 text-paper-faint'} />
      <div>
        <p className="font-display text-lg text-paper">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-paper-dim">{description}</p>}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-2">
          <RotateCw className="h-4 w-4" />
          {retryLabel}
        </button>
      )}
      {children}
    </div>
  )
}
