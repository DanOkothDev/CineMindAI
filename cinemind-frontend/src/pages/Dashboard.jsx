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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="slug-line">Your projects</p>
          <h1 className="mt-1 font-display text-2xl text-paper">Dashboard</h1>
        </div>
        <Link to="/create" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Search + Sort bar */}
      {projects.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paper-faint" />
            <input
              className="input-field pl-9"
              placeholder="Search projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="input-field w-40"
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
          <Link to="/create" className="btn-primary mt-2">
            <Clapperboard className="h-4 w-4" />
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
  )
}
