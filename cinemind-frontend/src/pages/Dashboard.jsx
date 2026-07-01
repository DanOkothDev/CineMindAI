import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Clapperboard, Search, ChevronDown, LayoutGrid } from 'lucide-react'
import useProject from '../hooks/useProject.js'
import ProjectCard from '../components/ProjectCard.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function Dashboard() {
  const { projects, projectsLoading, projectsError, fetchProjects, removeProject } = useProject()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const filtered = useMemo(() => {
    let list = [...projects]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.genre || '').toLowerCase().includes(q)
      )
    }
    if (sortBy === 'title') list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    else if (sortBy === 'updated_at') list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    else list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return list
  }, [projects, query, sortBy])

  const inputClasses =
    'w-full rounded-lg border border-slate-700 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none backdrop-blur-sm transition-all duration-150 focus:border-indigo-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/20'

  const primaryBtnClasses =
    'group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 ease-out hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A]'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0E1A] font-sans text-slate-100">
      {/* ambient background, matched to Home / Create */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute bottom-0 -right-40 h-[26rem] w-[26rem] rounded-full bg-fuchsia-600/10 blur-[130px]" />
        <div className="grain absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="slug-line text-xs font-medium tracking-wide text-indigo-400 sm:text-sm">
              Your projects
            </p>
            <h1 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Dashboard
            </h1>
            {projects.length > 0 && (
              <p className="mt-1 text-sm text-slate-500">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} in production
              </p>
            )}
          </div>
        </div>

        {/* Search + Sort bar */}
        {projects.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:min-w-[220px] sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                className={`${inputClasses} pl-9`}
                placeholder="Search projects…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <select
                className={`${inputClasses} appearance-none pr-9`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created_at" className="bg-[#0D1220]">Newest first</option>
                <option value="updated_at" className="bg-[#0D1220]">Recently updated</option>
                <option value="title" className="bg-[#0D1220]">A → Z</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        )}

        {projectsLoading && <LoadingScreen message="Fetching your projects…" />}

        {!projectsLoading && projectsError && (
          <StatusMessage
            variant="error"
            title="Couldn't load your projects"
            description={projectsError}
            onRetry={fetchProjects}
          />
        )}

        {!projectsLoading && !projectsError && projects.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-slate-800 bg-white/[0.02] px-6 py-16 text-center backdrop-blur-sm sm:py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
              <LayoutGrid className="h-6 w-6 text-indigo-400" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-white">No projects yet</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Start one and CineMindAI will draft the story, cast, scenes, and dialogue for you.
            </p>
            <Link to="/create" className={`${primaryBtnClasses} mt-6`}>
              <Clapperboard className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              Create your first project
            </Link>
          </div>
        )}

        {!projectsLoading && !projectsError && filtered.length === 0 && projects.length > 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-slate-800 bg-white/[0.02] px-6 py-16 text-center backdrop-blur-sm">
            <Search className="h-6 w-6 text-slate-600" />
            <h2 className="mt-4 text-base font-medium text-white">No matches</h2>
            <p className="mt-1.5 text-sm text-slate-500">Try a different search term.</p>
          </div>
        )}

        {!projectsLoading && !projectsError && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={removeProject} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  )
}