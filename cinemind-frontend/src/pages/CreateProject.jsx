import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wand2, Loader2, ChevronDown, Clapperboard } from 'lucide-react'
import useProject from '../hooks/useProject.js'

const GENRES = ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Fantasy', 'Animation', 'Documentary']
const AUDIENCES = ['General', 'Children', 'Teens', 'Young adult', 'Adult', 'Mature']
const ART_STYLES = ['Cinematic realism', 'Anime', 'Watercolor', 'Noir', 'Cyberpunk', 'Stop-motion', 'Comic book', 'Photorealistic']
const AI_MODELS = [
  { value: 'balanced', label: 'Balanced (recommended)' },
  { value: 'creative', label: 'Creative — looser, more unexpected' },
  { value: 'fast', label: 'Fast draft — quick first pass' },
]

const IDEA_PLACEHOLDER =
  'A retired smuggler is pulled back for one last job when her estranged daughter goes missing on a lawless space station…'

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
    'w-full rounded-lg border border-slate-700 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none backdrop-blur-sm transition-all duration-150 focus:border-indigo-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/20'

  const selectClasses = `${inputClasses} appearance-none pr-9`

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0E1A] font-sans text-slate-100">
      {/* ambient background, matched to Home */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/10 blur-[130px]" />
        <div className="grain absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* ---------- FORM ---------- */}
          <div>
            <p className="slug-line text-xs font-medium tracking-wide text-indigo-400 sm:text-sm">
              New project
            </p>
            <h1 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Pitch your movie idea
            </h1>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              CineMindAI generates the story, cast, scenes, dialogue, and visual prompts in one
              pass. Refine everything afterward in the workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5 sm:mt-8">
              <Field label="Movie idea">
                <textarea
                  className={`${inputClasses} min-h-[130px] resize-none`}
                  placeholder={IDEA_PLACEHOLDER}
                  value={form.idea}
                  onChange={(e) => update('idea', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Genre">
                  <Select
                    className={selectClasses}
                    value={form.genre}
                    onChange={(e) => update('genre', e.target.value)}
                    options={GENRES}
                  />
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
                  <Select
                    className={selectClasses}
                    value={form.targetAudience}
                    onChange={(e) => update('targetAudience', e.target.value)}
                    options={AUDIENCES}
                  />
                </Field>
                <Field label="Art style">
                  <Select
                    className={selectClasses}
                    value={form.artStyle}
                    onChange={(e) => update('artStyle', e.target.value)}
                    options={ART_STYLES}
                  />
                </Field>
              </div>

              <Field label="AI model">
                <Select
                  className={selectClasses}
                  value={form.aiModel}
                  onChange={(e) => update('aiModel', e.target.value)}
                  options={AI_MODELS}
                />
              </Field>

              {(validationError || generationError) && (
                <p className="animate-shake rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
                  {validationError || generationError}
                </p>
              )}

              <button
                type="submit"
                className="group mt-2 inline-flex w-full items-center justify-center gap-2 self-start rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-medium text-white
                           transition-all duration-200 ease-out
                           hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5
                           active:translate-y-0 active:scale-95
                           disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A]
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

          {/* ---------- LIVE SLATE PREVIEW ---------- */}
          <div className="hidden lg:block">
            <div className="sticky top-14 rounded-2xl border border-slate-700/60 bg-white/[0.02] p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Clapperboard className="h-4 w-4" />
                <span className="slug-line text-xs tracking-wide">Production slate</span>
              </div>

              <p className="mt-4 min-h-[4.5rem] text-sm leading-relaxed text-slate-300">
                {form.idea.trim() ? (
                  form.idea
                ) : (
                  <span className="text-slate-600">{IDEA_PLACEHOLDER}</span>
                )}
              </p>

              <div className="mt-5 h-px bg-slate-800" />

              <dl className="mt-5 grid grid-cols-2 gap-y-4 text-sm">
                <SlateRow label="Genre" value={form.genre} />
                <SlateRow label="Runtime" value={`${form.duration || 0} min`} />
                <SlateRow label="Audience" value={form.targetAudience} />
                <SlateRow label="Art style" value={form.artStyle} />
                <SlateRow
                  label="Model"
                  value={AI_MODELS.find((m) => m.value === form.aiModel)?.label.split(' — ')[0]}
                />
              </dl>

              <div className="mt-6 flex items-center gap-1.5 rounded-lg border border-slate-800 bg-black/20 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                <span className="font-mono text-[11px] text-slate-500">
                  waiting to generate…
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="slug-line mb-1.5 block text-xs font-medium tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}

function Select({ className, options, ...props }) {
  return (
    <div className="relative">
      <select className={className} {...props}>
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt} className="bg-[#0D1220]">
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value} className="bg-[#0D1220]">
              {opt.label}
            </option>
          )
        )}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </div>
  )
}

function SlateRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-slate-600">{label}</dt>
      <dd className="mt-0.5 truncate font-medium text-slate-200">{value}</dd>
    </div>
  )
}