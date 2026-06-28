import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wand2, Loader2 } from 'lucide-react'
import useProject from '../hooks/useProject.js'

const GENRES = ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Fantasy', 'Animation', 'Documentary']
const AUDIENCES = ['General', 'Children', 'Teens', 'Young adult', 'Adult', 'Mature']
const ART_STYLES = ['Cinematic realism', 'Anime', 'Watercolor', 'Noir', 'Cyberpunk', 'Stop-motion', 'Comic book', 'Photorealistic']
const AI_MODELS = [
  { value: 'balanced', label: 'Balanced (recommended)' },
  { value: 'creative', label: 'Creative — looser, more unexpected' },
  { value: 'fast', label: 'Fast draft — quick first pass' },
]

const INITIAL_FORM = {
  idea: '',
  genre: GENRES[0],
  duration: 90,
  targetAudience: AUDIENCES[0],
  artStyle: ART_STYLES[0],
  aiModel: AI_MODELS[0].value,
}

export default function CreateProject() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [validationError, setValidationError] = useState(null)
  const { generateProject, generating, generationError } = useProject()
  const navigate = useNavigate()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.idea.trim()) {
      setValidationError('Give the studio a movie idea to work from first.')
      return
    }
    setValidationError(null)

    const created = await generateProject({
      idea: form.idea.trim(),
      genre: form.genre,
      duration: Number(form.duration),
      targetAudience: form.targetAudience,
      artStyle: form.artStyle,
      aiModel: form.aiModel,
    }).catch(() => null)

    if (created?.project?.project_id) {
      navigate(`/workspace/${created.project.project_id}`)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="slug-line">New project</p>
      <h1 className="mt-1 font-display text-2xl text-paper">Pitch your movie idea</h1>
      <p className="mt-2 text-sm text-paper-dim">
        CineMindAI generates the story, cast, scenes, dialogue, and visual prompts in one
        pass. You can refine everything afterward in the workspace.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Field label="Movie idea">
          <textarea
            className="input-field min-h-[120px] resize-none"
            placeholder="A retired smuggler is pulled back for one last job when her estranged daughter goes missing on a lawless space station…"
            value={form.idea}
            onChange={(e) => update('idea', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Genre">
            <select className="input-field" value={form.genre} onChange={(e) => update('genre', e.target.value)}>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Duration (minutes)">
            <input
              type="number"
              min={1}
              className="input-field"
              value={form.duration}
              onChange={(e) => update('duration', e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Target audience">
            <select
              className="input-field"
              value={form.targetAudience}
              onChange={(e) => update('targetAudience', e.target.value)}
            >
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="Art style">
            <select className="input-field" value={form.artStyle} onChange={(e) => update('artStyle', e.target.value)}>
              {ART_STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="AI model">
          <select className="input-field" value={form.aiModel} onChange={(e) => update('aiModel', e.target.value)}>
            {AI_MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </Field>

        {(validationError || generationError) && (
          <p className="rounded-md border border-crimson/40 bg-crimson/10 px-3.5 py-2.5 text-sm text-crimson">
            {validationError || generationError}
          </p>
        )}

        <button type="submit" className="btn-primary mt-2 self-start" disabled={generating}>
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {generating ? 'Generating your movie package…' : 'Generate'}
        </button>
      </form>
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
