import { useParams } from 'react-router-dom'
import { RefreshCw, Loader2 } from 'lucide-react'
import useProject from '../hooks/useProject.js'
import PromptCard from '../components/PromptCard.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function VisualPromptPage() {
  const { projectId } = useParams()
  const {
    visualPrompts,
    visualPromptsLoading,
    visualPromptsError,
    fetchVisualPrompts,
    regenerateVisualPrompts,
    scenes,
  } = useProject()

  const sceneLabel = (sceneId) => {
    const scene = scenes.find((s) => String(s.id) === String(sceneId))
    return scene ? scene.heading || scene.title || `Scene ${scene.number ?? ''}` : undefined
  }

  async function handleRegenerate() {
    await regenerateVisualPrompts({ projectId }).catch(() => {})
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="slug-line">Shot list</p>
          <h1 className="mt-1 font-display text-2xl text-paper">Visual Prompts</h1>
        </div>
        <button onClick={handleRegenerate} className="btn-secondary text-sm" disabled={visualPromptsLoading}>
          {visualPromptsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Regenerate
        </button>
      </div>

      {visualPromptsLoading && visualPrompts.length === 0 && (
        <LoadingScreen fullScreen={false} message="Generating visual prompts…" />
      )}

      {!visualPromptsLoading && visualPromptsError && (
        <StatusMessage
          variant="error"
          title="Couldn't load visual prompts"
          description={visualPromptsError}
          onRetry={() => fetchVisualPrompts(projectId)}
        />
      )}

      {!visualPromptsLoading && !visualPromptsError && visualPrompts.length === 0 && (
        <StatusMessage
          variant="empty"
          title="No visual prompts yet"
          description="Regenerate to have CineMindAI draft shot prompts for every scene."
        />
      )}

      {visualPrompts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visualPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} sceneLabel={sceneLabel(prompt.sceneId || prompt.scene_id)} />
          ))}
        </div>
      )}
    </div>
  )
}
