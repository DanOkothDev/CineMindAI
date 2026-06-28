import { useState } from 'react'
import { ChevronDown, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'

export default function SceneCard({ scene, onSave, onDelete, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => toFormState(scene))

  const heading = scene.heading || scene.title || 'Untitled scene'
  const body = scene.content || scene.summary || ''

  function startEdit(e) {
    e.stopPropagation()
    setForm(toFormState(scene))
    setEditing(true)
    setOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(scene.id, {
        heading: form.heading,
        setting: form.setting,
        timeOfDay: form.timeOfDay,
        summary: form.summary,
        content: form.content,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="panel animate-fadeUp overflow-hidden">
      <button
        onClick={() => !editing && setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <p className="slug-line">
            Scene {scene.number ?? '—'}
            {scene.timeOfDay || scene.time_of_day ? ` · ${scene.timeOfDay || scene.time_of_day}` : ''}
          </p>
          <p className="mt-0.5 truncate font-display text-base text-paper">{heading}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <span
            onClick={startEdit}
            role="button"
            aria-label="Edit scene"
            className="rounded-md p-1.5 text-paper-faint transition-colors hover:bg-ink-raised hover:text-amber"
          >
            <Pencil className="h-4 w-4" />
          </span>
          {onDelete && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                onDelete(scene.id)
              }}
              role="button"
              aria-label="Delete scene"
              className="rounded-md p-1.5 text-paper-faint transition-colors hover:bg-crimson/10 hover:text-crimson"
            >
              <Trash2 className="h-4 w-4" />
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-paper-faint transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-line px-5 py-4">
          {editing ? (
            <div className="flex flex-col gap-3">
              <Field label="Heading">
                <input
                  className="input-field font-mono text-sm"
                  value={form.heading}
                  onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Setting">
                  <input
                    className="input-field"
                    value={form.setting}
                    onChange={(e) => setForm((f) => ({ ...f, setting: e.target.value }))}
                  />
                </Field>
                <Field label="Time of day">
                  <input
                    className="input-field"
                    value={form.timeOfDay}
                    onChange={(e) => setForm((f) => ({ ...f, timeOfDay: e.target.value }))}
                  />
                </Field>
              </div>
              <Field label="Summary">
                <textarea
                  className="input-field min-h-[60px] resize-none"
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                />
              </Field>
              <Field label="Scene content">
                <textarea
                  className="input-field min-h-[140px] resize-none font-mono text-sm leading-relaxed"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                />
              </Field>
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
          ) : (
            <div className="space-y-3">
              {scene.setting && (
                <p className="text-xs text-paper-faint">
                  <span className="font-mono uppercase tracking-wide">{scene.setting}</span>
                </p>
              )}
              <p className="whitespace-pre-line font-mono text-sm leading-relaxed text-paper-dim">
                {body || 'No scene content yet.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="slug-line mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}

function toFormState(scene) {
  return {
    heading: scene.heading || scene.title || '',
    setting: scene.setting || '',
    timeOfDay: scene.timeOfDay || scene.time_of_day || '',
    summary: scene.summary || '',
    content: scene.content || '',
  }
}
