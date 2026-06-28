import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import useProject from '../hooks/useProject.js'
import SceneCard from '../components/SceneCard.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function ScenesPage() {
  const { projectId } = useParams()
  const { scenes, scenesLoading, scenesError, fetchScenes, addScene, editScene, removeScene } = useProject()
  const [adding, setAdding] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newScene, setNewScene] = useState({ heading: '', setting: '' })

  async function handleCreate(e) {
    e.preventDefault()
    if (!newScene.heading.trim()) return
    setCreating(true)
    try {
      await addScene({ projectId, heading: newScene.heading.trim(), setting: newScene.setting.trim() })
      setNewScene({ heading: '', setting: '' })
      setAdding(false)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="slug-line">Breakdown</p>
          <h1 className="mt-1 font-display text-2xl text-paper">Scenes</h1>
        </div>
        <button onClick={() => setAdding((a) => !a)} className="btn-secondary text-sm">
          <Plus className="h-4 w-4" /> Add scene
        </button>
      </div>

      {adding && (
        <form onSubmit={handleCreate} className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="slug-line mb-1.5 block">Heading</span>
            <input
              className="input-field font-mono text-sm"
              value={newScene.heading}
              onChange={(e) => setNewScene((s) => ({ ...s, heading: e.target.value }))}
              placeholder="INT. SPACESHIP BRIDGE - NIGHT"
              autoFocus
            />
          </label>
          <label className="flex-1">
            <span className="slug-line mb-1.5 block">Setting</span>
            <input
              className="input-field"
              value={newScene.setting}
              onChange={(e) => setNewScene((s) => ({ ...s, setting: e.target.value }))}
              placeholder="The Calliope's bridge"
            />
          </label>
          <button type="submit" className="btn-primary" disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </form>
      )}

      {scenesLoading && scenes.length === 0 && <LoadingScreen fullScreen={false} message="Loading the scene breakdown…" />}

      {!scenesLoading && scenesError && (
        <StatusMessage
          variant="error"
          title="Couldn't load scenes"
          description={scenesError}
          onRetry={() => fetchScenes(projectId)}
        />
      )}

      {!scenesLoading && !scenesError && scenes.length === 0 && (
        <StatusMessage variant="empty" title="No scenes yet" description="Add one, or generate a new project to draft a full breakdown." />
      )}

      {scenes.length > 0 && (
        <div className="flex flex-col gap-3">
          {scenes.map((scene) => (
            <SceneCard key={scene.id} scene={scene} onSave={editScene} onDelete={removeScene} />
          ))}
        </div>
      )}
    </div>
  )
}
