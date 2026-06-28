import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import useProject from '../hooks/useProject.js'
import Sidebar from '../components/Sidebar.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function Workspace() {
  const { projectId } = useParams()
  const { project, projectLoading, projectError, loadWorkspace, fetchProject } = useProject()

  useEffect(() => {
    if (projectId) loadWorkspace(projectId)
  }, [projectId, loadWorkspace])

  if (projectLoading && !project) {
    return <LoadingScreen message="Opening your workspace…" />
  }

  if (projectError && !project) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <StatusMessage
          variant="error"
          title="Couldn't open this project"
          description={projectError}
          onRetry={() => fetchProject(projectId)}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl">
      <Sidebar project={project} />
      <div className="min-w-0 flex-1 px-6 py-8 sm:px-8">
        <Outlet />
      </div>
    </div>
  )
}
