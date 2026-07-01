import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Clapperboard, Search } from 'lucide-react'
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
    'input-field w-full rounded-lg border border-blue-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 font-sans">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="slug-line text-xs sm:text-sm tracking-wide text-blue-600 font-medium">
              Your projects
            </p>
            <h1 className="mt-1 font-sans text-xl sm:text-2xl font-semibold text-slate-900">
              Dashboard
            </h1>
          </div>
          {projects.length > 0 && (
            <Link
              to="/create"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white
                         transition-all duration-200 ease-out
                         hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5
                         active:translate-y-0 active:scale-95
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                         self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              New project
            </Link>
          )}
        </div>

        {/* Search + Sort bar */}
        {projects.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:min-w-[200px] sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className={`${inputClasses} pl-9`}
                placeholder="Search projects…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className={`${inputClasses} w-full sm:w-44`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Newest first</option>
              <option value="updated_at">Recently updated</option>
              <option value="title">A → Z</option>
            </select>
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
          <StatusMessage
            variant="empty"
            title="No projects yet"
            description="Start one and CineMindAI will draft the story, cast, scenes, and dialogue for you."
          >
            <Link
              to="/create"
              className="group mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white
                         transition-all duration-200 ease-out
                         hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5
                         active:translate-y-0 active:scale-95
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              <Clapperboard className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              Create your first project
            </Link>
          </StatusMessage>
        )}

        {!projectsLoading && !projectsError && filtered.length === 0 && projects.length > 0 && (
          <StatusMessage variant="empty" title="No matches" description="Try a different search term." />
        )}

        {!projectsLoading && !projectsError && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={removeProject} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}