import { useMemo, useState } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import useProject from '../hooks/useProject.js'
import LoadingScreen from '../components/LoadingScreen.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function StoryPage() {
  const { project, projectLoading, projectError, updateProjectInfo } = useProject()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const story = project?.story || {}
  const acts = useMemo(
    () => [
      { key: 'actOne', fallbackKey: 'act_one', label: 'Act One — Setup', value: story.actOne || story.act_one },
      { key: 'actTwo', fallbackKey: 'act_two', label: 'Act Two — Confrontation', value: story.actTwo || story.act_two },
      { key: 'actThree', fallbackKey: 'act_three', label: 'Act Three — Resolution', value: story.actThree || story.act_three },
    ],
    [story]
  )
  const themes = story.themes || []

  const [form, setForm] = useState(() => toFormState(acts, themes))

  function startEdit() {
    setForm(toFormState(acts, themes))
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateProjectInfo(project.id, {
        story: {
          actOne: form.actOne,
          actTwo: form.actTwo,
          actThree: form.actThree,
          themes: form.themes.split(',').map((t) => t.trim()).filter(Boolean),
        },
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (projectLoading && !project) return <LoadingScreen fullScreen={false} message="Loading the story…" />
  if (projectError && !project) return <StatusMessage variant="error" title="Couldn't load the story" description={projectError} />
  if (!project) return null

  const hasStory = acts.some((a) => a.value) || themes.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="slug-line">Story</p>
          <h1 className="mt-1 font-display text-2xl text-paper">{project.title || project.name}</h1>
        </div>
        {!editing && hasStory && (
          <button onClick={startEdit} className="btn-secondary text-sm">
            <Pencil className="h-4 w-4" /> Edit
          </button>
        )}
      </div>

      {!hasStory && !editing && (
        <StatusMessage
          variant="empty"
          title="No story generated yet"
          description="The backend hasn't returned a three-act structure for this project."
        />
      )}

      {editing ? (
        <div className="flex flex-col gap-5">
          {acts.map((act) => (
            <label key={act.key} className="block">
              <span className="slug-line mb-1.5 block">{act.label}</span>
              <textarea
                className="input-field min-h-[100px] resize-none"
                value={form[act.key]}
                onChange={(e) => setForm((f) => ({ ...f, [act.key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="block">
            <span className="slug-line mb-1.5 block">Themes (comma-separated)</span>
            <input
              className="input-field"
              value={form.themes}
              onChange={(e) => setForm((f) => ({ ...f, themes: e.target.value }))}
            />
          </label>
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
        <div className="flex flex-col gap-4">
          {acts.map(
            (act) =>
              act.value && (
                <div key={act.key} className="panel p-5">
                  <p className="slug-line mb-2">{act.label}</p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-paper-dim">{act.value}</p>
                </div>
              )
          )}
          {themes.length > 0 && (
            <div>
              <p className="slug-line mb-2">Themes</p>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme, i) => (
                  <span key={i} className="rounded-full border border-slate-line px-3 py-1 text-sm text-paper-dim">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function toFormState(acts, themes) {
  const state = { themes: (themes || []).join(', ') }
  for (const act of acts) state[act.key] = act.value || ''
  return state
}
