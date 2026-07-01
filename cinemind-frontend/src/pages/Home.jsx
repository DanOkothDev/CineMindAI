import { Link } from 'react-router-dom'
import { ArrowRight, LayoutDashboard, Sparkles, Film } from 'lucide-react'

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
    <div className="relative min-h-screen overflow-hidden bg-[#0A0E1A] font-sans text-slate-100">
      {/* ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/15 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_#0A0E1A_75%)]" />
        <div className="grain absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ---------- HERO ---------- */}
        <section className="grid min-h-[85vh] grid-cols-1 items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* Copy */}
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            <div className="slug-line inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-wide text-indigo-300 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              AI Filmmaking Studio
            </div>

            <h1 className="max-w-xl font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
              One idea in.
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                A full movie
              </span>{' '}
              package out.
            </h1>

            <p className="max-w-lg text-sm text-slate-400 sm:text-base md:text-lg">
              Describe your premise, pick a genre and an art style, and CineMindAI drafts the
              story, cast, scenes, dialogue, and shot prompts — all editable, all in one
              workspace.
            </p>

            <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                to="/create"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-medium text-white
                           transition-all duration-200 ease-out
                           hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5
                           active:translate-y-0 active:scale-95
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A]"
              >
                Start a new project
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/dashboard"
                className="group inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200
                           backdrop-blur-sm transition-all duration-200 ease-out
                           hover:border-indigo-400/50 hover:bg-white/[0.06] hover:-translate-y-0.5
                           active:translate-y-0 active:scale-95
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A]"
              >
                <LayoutDashboard className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                View dashboard
              </Link>
            </div>
          </div>

          {/* Signature visual: laptop mid-render */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="laptop-float relative">
              {/* screen bezel */}
              <div className="relative rounded-2xl border border-slate-700/60 bg-[#0D1220] p-2 shadow-2xl shadow-black/50">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black">
                  {/* generative gradient canvas */}
                  <div className="blob-a absolute -top-10 -left-10 h-56 w-56 rounded-full bg-indigo-500/70 blur-3xl" />
                  <div className="blob-b absolute bottom-0 right-0 h-48 w-48 rounded-full bg-fuchsia-500/60 blur-3xl" />
                  <div className="blob-c absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-cyan-400/40 blur-3xl" />
                  <div className="grain absolute inset-0 opacity-[0.15]" />
                  <div className="scanline absolute inset-x-0 h-1/3 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

                  {/* HUD chip */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="font-mono text-[10px] text-slate-200">rendering scene 04</span>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-1 font-mono text-[10px] text-slate-300 backdrop-blur-sm">
                    72%
                  </div>
                </div>
                {/* laptop base */}
                <div className="mx-auto mt-2 h-1.5 w-1/3 rounded-b-lg bg-slate-700/60" />
              </div>
              <div className="mx-auto h-2 w-[110%] -translate-x-[4.5%] rounded-b-xl bg-slate-800/80" />
            </div>

            {/* floating label */}
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-lg border border-slate-700/60 bg-[#0D1220]/90 px-3 py-2 text-xs text-slate-300 shadow-xl backdrop-blur-sm sm:-left-8">
              <Film className="h-3.5 w-3.5 text-indigo-400" />
              Frame-by-frame, on your machine
            </div>
          </div>
        </section>

        {/* ---------- PIPELINE (film reel) ---------- */}
        <section className="border-t border-slate-800 py-14 sm:py-16">
          <p className="slug-line mb-8 text-xs font-medium tracking-wide text-indigo-400 sm:mb-10 sm:text-sm">
            The pipeline
          </p>

          <div className="relative">
            {/* reel line */}
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent sm:block" />

            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {PIPELINE.map((step) => (
                <div
                  key={step.n}
                  className="group relative rounded-xl border border-slate-800 bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/[0.04] sm:p-5"
                >
                  <span className="font-mono text-xs text-indigo-400/80 transition-colors group-hover:text-indigo-300">
                    {step.n}
                  </span>
                  <p className="mt-2 font-sans text-sm font-medium text-white sm:text-base">
                    {step.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
        .laptop-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .blob-a { animation: blobA 9s ease-in-out infinite; }
        .blob-b { animation: blobB 11s ease-in-out infinite; }
        .blob-c { animation: blobC 8s ease-in-out infinite; }
        @keyframes blobA {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20px,15px) scale(1.15); }
        }
        @keyframes blobB {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-15px,-20px) scale(1.1); }
        }
        @keyframes blobC {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.4; }
          50% { transform: translate(10px,-10px) scale(1.2); opacity: 0.6; }
        }
        .scanline {
          animation: scan 4s linear infinite;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .laptop-float, .blob-a, .blob-b, .blob-c, .scanline { animation: none; }
        }
      `}</style>
    </div>
  )
}