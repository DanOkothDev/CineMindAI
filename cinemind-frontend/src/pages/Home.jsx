import { Link } from 'react-router-dom'
import { ArrowRight, LayoutDashboard } from 'lucide-react'

const PIPELINE = [
  { n: '01', label: 'Story', detail: 'Three-act structure & themes' },
  { n: '02', label: 'Characters', detail: 'Personalities & relationships' },
  { n: '03', label: 'Scenes', detail: 'Cinematic scene breakdown' },
  { n: '04', label: 'Dialogue', detail: 'Conversations, scene by scene' },
  { n: '05', label: 'Visual prompts', detail: 'Ready for AI art tools' },
  { n: '06', label: 'Export', detail: 'PDF, Final Draft, JSON, MP4' },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <section className="flex min-h-[70vh] flex-col items-start justify-center gap-6 py-20">
        <p className="slug-line">AI Filmmaking Studio</p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] text-paper sm:text-5xl">
          One idea in.
          <br />A full movie package out.
        </h1>
        <p className="max-w-xl text-base text-paper-dim sm:text-lg">
          Describe your premise, pick a genre and an art style, and CineMindAI drafts the
          story, cast, scenes, dialogue, and shot prompts — all editable, all in one
          workspace.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link to="/create" className="btn-primary">
            Start a new project
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            <LayoutDashboard className="h-4 w-4" />
            View dashboard
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-line py-14">
        <p className="slug-line mb-8">The pipeline</p>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-line bg-slate-line sm:grid-cols-3 lg:grid-cols-6">
          {PIPELINE.map((step) => (
            <div key={step.n} className="bg-ink-soft p-5">
              <span className="font-mono text-xs text-amber">{step.n}</span>
              <p className="mt-2 font-display text-base text-paper">{step.label}</p>
              <p className="mt-1 text-xs text-paper-faint">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
