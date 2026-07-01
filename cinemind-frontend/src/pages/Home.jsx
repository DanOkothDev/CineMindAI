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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="flex min-h-[60vh] sm:min-h-[70vh] flex-col items-start justify-center gap-5 sm:gap-6 py-14 sm:py-20">
          <p className="slug-line text-xs sm:text-sm tracking-wide text-blue-600 font-medium">
            AI Filmmaking Studio
          </p>
          <h1 className="max-w-2xl font-sans text-3xl font-semibold leading-[1.15] text-slate-900 sm:text-4xl md:text-5xl">
            One idea in.
            <br />A full movie package out.
          </h1>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base md:text-lg">
            Describe your premise, pick a genre and an art style, and CineMindAI drafts the
            story, cast, scenes, dialogue, and shot prompts — all editable, all in one
            workspace.
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to="/create"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white
                         transition-all duration-200 ease-out
                         hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5
                         active:translate-y-0 active:scale-95
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              Start a new project
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-slate-700
                         transition-all duration-200 ease-out
                         hover:border-blue-400 hover:bg-blue-50 hover:-translate-y-0.5
                         active:translate-y-0 active:scale-95
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              <LayoutDashboard className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              View dashboard
            </Link>
          </div>
        </section>

        <section className="border-t border-blue-100 py-10 sm:py-14">
          <p className="slug-line mb-6 sm:mb-8 text-xs sm:text-sm tracking-wide text-blue-600 font-medium">
            The pipeline
          </p>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-blue-100 bg-blue-100 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {PIPELINE.map((step) => (
              <div key={step.n} className="bg-white p-4 sm:p-5 transition-colors duration-200 hover:bg-blue-50">
                <span className="font-mono text-xs text-blue-500">{step.n}</span>
                <p className="mt-2 font-sans text-sm sm:text-base font-medium text-slate-900">{step.label}</p>
                <p className="mt-1 text-xs text-slate-500">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}