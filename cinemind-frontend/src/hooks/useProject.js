import { useContext } from 'react'
import { ProjectContext } from '../context/ProjectContext.jsx'

/** Access the shared project state/actions. Must be used under <ProjectProvider>. */
export default function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) {
    throw new Error('useProject must be used inside <ProjectProvider>')
  }
  return ctx
}
