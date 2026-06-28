import { useState } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'

export default function DialogueCard({ dialogue, onSave }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => toFormState(dialogue))

  const speaker = dialogue.character || dialogue.speaker || 'Unknown'
  const line = dialogue.line || dialogue.text || dialogue.content || ''
  const emotion = dialogue.emotion || dialogue.tone

  function startEdit() {
    setForm(toFormState(dialogue))
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(dialogue.id, { character: form.character, line: form.line, emotion: form.emotion })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-amber/40 bg-ink-raised p-3.5">
        <div className="grid grid-cols-[1fr,auto] gap-2">
          <input
            className="input-field font-mono text-sm uppercase"
            value={form.character}
            onChange={(e) => setForm((f) => ({ ...f, character: e.target.value }))}
            placeholder="Character"
          />
          <input
            className="input-field w-32 text-sm"
            value={form.emotion}
            onChange={(e) => setForm((f) => ({ ...f, emotion: e.target.value }))}
            placeholder="Emotion"
          />
        </div>
        <textarea
          className="input-field min-h-[60px] resize-none text-sm"
          value={form.line}
          onChange={(e) => setForm((f) => ({ ...f, line: e.target.value }))}
          placeholder="Dialogue line"
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing(false)} className="btn-secondary" disabled={saving}>
            <X className="h-4 w-4" /> Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-3.5 py-2.5 transition-colors hover:bg-ink-raised">
      <div className="min-w-0">
        <p className="font-mono text-xs uppercase tracking-wide text-amber">
          {speaker}
          {emotion && <span className="ml-2 text-paper-faint">({emotion})</span>}
        </p>
        <p className="mt-1 text-sm text-paper">{line}</p>
      </div>
      <button
        onClick={startEdit}
        aria-label="Edit line"
        className="flex-shrink-0 rounded-md p-1.5 text-paper-faint opacity-0 transition-opacity hover:bg-ink-raised hover:text-amber group-hover:opacity-100"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function toFormState(dialogue) {
  return {
    character: dialogue.character || dialogue.speaker || '',
    line: dialogue.line || dialogue.text || dialogue.content || '',
    emotion: dialogue.emotion || dialogue.tone || '',
  }
}
