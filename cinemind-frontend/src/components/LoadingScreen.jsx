import { Film } from 'lucide-react'

/**
 * Loading indicator themed as a spinning film reel.
 * Pass `fullScreen={false}` to use inline inside a panel instead of taking
 * over the whole viewport.
 */
export default function LoadingScreen({ message = 'Loading…', fullScreen = true }) {
  const content = (
    <div className="flex flex-col items-center gap-4 text-paper-dim animate-fadeUp">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-slate-line" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber animate-reel" />
        <Film className="absolute inset-0 m-auto h-5 w-5 text-amber" />
      </div>
      <p className="slug-line">{message}</p>
    </div>
  )

  if (!fullScreen) {
    return <div className="flex items-center justify-center py-16">{content}</div>
  }

  return <div className="flex min-h-[60vh] items-center justify-center">{content}</div>
}
