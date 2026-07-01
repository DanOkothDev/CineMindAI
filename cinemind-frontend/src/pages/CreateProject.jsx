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

    try {
      const created = await generateProject({
        idea: form.idea.trim(),
        genre: form.genre,
        duration: Number(form.duration),
        targetAudience: form.targetAudience,
        artStyle: form.artStyle,
        aiModel: form.aiModel,
      })

      const projectId = created?.project?.project_id || created?.project?.id
      if (projectId) {
        navigate(`/workspace/${projectId}`)
      }
    } catch (err) {
      // generationError is already set in context; nothing extra needed here
    }
  }

  const inputClasses =
    'input-field w-full rounded-lg border border-blue-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 font-sans">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:px-6 sm:py-10">
        <p className="slug-line text-xs sm:text-sm tracking-wide text-blue-600 font-medium">
          New project
        </p>
        <h1 className="mt-1 font-sans text-xl sm:text-2xl font-semibold text-slate-900">
          Pitch your movie idea
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          CineMindAI generates the story, cast, scenes, dialogue, and visual prompts in one
          pass. You can refine everything afterward in the workspace.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 flex flex-col gap-5">
          <Field label="Movie idea">
            <textarea
              className={`${inputClasses} min-h-[120px] resize-none`}
              placeholder="A retired smuggler is pulled back for one last job when her estranged daughter goes missing on a lawless space station…"
              value={form.idea}
              onChange={(e) => update('idea', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Genre">
              <select className={inputClasses} value={form.genre} onChange={(e) => update('genre', e.target.value)}>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Duration (minutes)">
              <input
                type="number"
                min={1}
                className={inputClasses}
                value={form.duration}
                onChange={(e) => update('duration', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Target audience">
              <select
                className={inputClasses}
                value={form.targetAudience}
                onChange={(e) => update('targetAudience', e.target.value)}
              >
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </Field>
            <Field label="Art style">
              <select className={inputClasses} value={form.artStyle} onChange={(e) => update('artStyle', e.target.value)}>
                {ART_STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="AI model">
            <select className={inputClasses} value={form.aiModel} onChange={(e) => update('aiModel', e.target.value)}>
              {AI_MODELS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </Field>

          {(validationError || generationError) && (
            <p className="animate-shake rounded-md border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
              {validationError || generationError}
            </p>
          )}

          <button
            type="submit"
            className="group mt-2 inline-flex w-full items-center justify-center gap-2 self-start rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white
                       transition-all duration-200 ease-out
                       hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5
                       active:translate-y-0 active:scale-95
                       disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                       sm:w-auto"
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
            )}
            {generating ? 'Generating your movie package…' : 'Generate'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="slug-line mb-1.5 block text-xs font-medium tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  )
}