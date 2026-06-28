import { useState } from 'react'
import { Copy, Check, Image as ImageIcon } from 'lucide-react'

export default function PromptCard({ prompt, sceneLabel }) {
  const [copied, setCopied] = useState(false)
  const text = prompt.prompt || prompt.text || prompt.content || ''

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard access can be denied by the browser; fail quietly, the
      // text is still selectable and readable on the card.
    }
  }

  return (
    <div className="panel flex flex-col gap-3 p-5 animate-fadeUp">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-paper-faint">
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="slug-line">{sceneLabel || 'Visual prompt'}</span>
        </span>
        {prompt.style && (
          <span className="rounded-full border border-slate-line px-2.5 py-0.5 text-xs text-paper-dim">
            {prompt.style}
          </span>
        )}
      </div>

      <p className="font-mono text-sm leading-relaxed text-paper-dim">{text || 'No prompt generated yet.'}</p>

      <button onClick={handleCopy} className="btn-secondary mt-1 self-start text-sm" disabled={!text}>
        {copied ? <Check className="h-3.5 w-3.5 text-sage" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy prompt'}
      </button>
    </div>
  )
}
