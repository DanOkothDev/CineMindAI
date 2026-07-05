import { memo, useState } from 'react'
import { Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'

function CharacterCard({ character, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(() => toFormState(character))

  const relationships = normalizeRelationships(character.relationships)

  function startEdit() {
    setForm(toFormState(character))
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(character.id, {
        name: form.name,
        role: form.role,
        personality: form.personality,
        emotionalArc: form.emotionalArc,
        relationships: form.relationships
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="panel flex flex-col gap-3 p-5">
        <Field label="Name">
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>
        <Field label="Role">
          <input
            className="input-field"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          />
        </Field>
        <Field label="Personality">
          <textarea
            className="input-field min-h-[72px] resize-none"
            value={form.personality}
            onChange={(e) => setForm((f) => ({ ...f, personality: e.target.value }))}
          />
        </Field>
        <Field label="Emotional arc">
          <textarea
            className="input-field min-h-[60px] resize-none"
            value={form.emotionalArc}
            onChange={(e) => setForm((f) => ({ ...f, emotionalArc: e.target.value }))}
          />
        </Field>
        <Field label="Relationships (comma-separated)">
          <input
            className="input-field"
            value={form.relationships}
            onChange={(e) => setForm((f) => ({ ...f, relationships: e.target.value }))}
          />
        </Field>

        <div className="mt-1 flex justify-end gap-2">
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
    <div className="panel group flex flex-col gap-3 p-5 animate-fadeUp">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg text-paper">{character.name || 'Unnamed character'}</h3>
          {character.role && <p className="slug-line mt-0.5">{character.role}</p>}
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton onClick={startEdit} label="Edit character">
            <Pencil className="h-4 w-4" />
          </IconButton>
          {onDelete && (
            <IconButton onClick={() => onDelete(character.id)} label="Delete character" danger>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>

      {character.personality && (
        <p className="text-sm text-paper-dim">{character.personality}</p>
      )}

      {character.emotionalArc || character.emotional_arc ? (
        <div className="border-t border-slate-line pt-3">
          <p className="slug-line mb-1">Emotional arc</p>
          <p className="text-sm text-paper-dim">{character.emotionalArc || character.emotional_arc}</p>
        </div>
      ) : null}

      {relationships.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-slate-line pt-3">
          {relationships.map((r, i) => (
            <span key={i} className="rounded-full border border-slate-line px-2.5 py-1 text-xs text-paper-dim">
              {r}
            </span>
          ))}
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

function IconButton({ children, onClick, label, danger }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`rounded-md p-1.5 transition-colors ${
        danger ? 'text-paper-faint hover:bg-crimson/10 hover:text-crimson' : 'text-paper-faint hover:bg-ink-raised hover:text-amber'
      }`}
    >
      {children}
    </button>
  )
}

export default memo(CharacterCard)

function toFormState(character) {
  return {
    name: character.name || '',
    role: character.role || '',
    personality: character.personality || '',
    emotionalArc: character.emotionalArc || character.emotional_arc || '',
    relationships: normalizeRelationships(character.relationships).join(', '),
  }
}

function normalizeRelationships(relationships) {
  if (!relationships) return []
  if (Array.isArray(relationships)) {
    return relationships.map((r) => (typeof r === 'string' ? r : r.name || r.label || JSON.stringify(r)))
  }
  return [String(relationships)]
}
