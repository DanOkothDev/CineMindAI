import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Clapperboard } from 'lucide-react'
import useProject from '../hooks/useProject.js'
import ProjectCard from '../components/ProjectCard.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function Dashboard() {
  const { projects, projectsLoading, projectsError, fetchProjects, removeProject } = useProject()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

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

      {!projectsLoading && !projectsError && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={removeProject} />
          ))}
        </div>
      )}
    </div>
  )
}
