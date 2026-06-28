import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import useProject from '../hooks/useProject.js'
import DialogueCard from '../components/DialogueCard.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import { groupDialoguesByScene } from '../services/projectService.js'

export default function DialoguePage() {
  const { projectId } = useParams()
  const { dialogues, dialoguesLoading, dialoguesError, fetchDialogues, addDialogue, editDialogue, scenes } = useProject()
  const [adding, setAdding] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newLine, setNewLine] = useState({ sceneId: '', character: '', line: '' })

  const grouped = useMemo(() => groupDialoguesByScene(dialogues), [dialogues])

  const sceneLabel = (sceneId) => {
    const scene = scenes.find((s) => String(s.id) === String(sceneId))
    return scene ? scene.heading || scene.title || `Scene ${scene.number ?? ''}` : 'Unassigned scene'
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newLine.character.trim() || !newLine.line.trim()) return
    setCreating(true)
    try {
      await addDialogue({
        projectId,
        sceneId: newLine.sceneId || undefined,
        character: newLine.character.trim(),
        line: newLine.line.trim(),
      })
      setNewLine({ sceneId: '', character: '', line: '' })
      setAdding(false)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="slug-line">Script</p>
          <h1 className="mt-1 font-display text-2xl text-paper">Dialogues</h1>
        </div>
        <button onClick={() => setAdding((a) => !a)} className="btn-secondary text-sm">
          <Plus className="h-4 w-4" /> Add line
        </button>
      </div>

      {adding && (
        <form onSubmit={handleCreate} className="panel flex flex-col gap-3 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              className="input-field"
              value={newLine.sceneId}
              onChange={(e) => setNewLine((l) => ({ ...l, sceneId: e.target.value }))}
            >
              <option value="">Scene…</option>
              {scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.heading || s.title || `Scene ${s.number ?? s.id}`}
                </option>
              ))}
            </select>
            <input
              className="input-field"
              placeholder="Character"
              value={newLine.character}
              onChange={(e) => setNewLine((l) => ({ ...l, character: e.target.value }))}
            />
            <input
              className="input-field sm:col-span-1"
              placeholder="Line"
              value={newLine.line}
              onChange={(e) => setNewLine((l) => ({ ...l, line: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary self-start" disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add line
          </button>
        </form>
      )}

      {dialoguesLoading && dialogues.length === 0 && <LoadingScreen fullScreen={false} message="Loading the script…" />}

      {!dialoguesLoading && dialoguesError && (
        <StatusMessage
          variant="error"
          title="Couldn't load dialogues"
          description={dialoguesError}
          onRetry={() => fetchDialogues(projectId)}
        />
      )}

      {!dialoguesLoading && !dialoguesError && dialogues.length === 0 && (
        <StatusMessage variant="empty" title="No dialogue yet" description="Add a line, or generate a new project to draft conversations scene by scene." />
      )}

      {grouped.size > 0 && (
        <div className="flex flex-col gap-5">
          {Array.from(grouped.entries()).map(([sceneId, lines]) => (
            <div key={sceneId} className="panel p-5">
              <p className="slug-line mb-3">{sceneLabel(sceneId)}</p>
              <div className="flex flex-col divide-y divide-slate-line">
                {lines.map((dialogue) => (
                  <DialogueCard key={dialogue.id} dialogue={dialogue} onSave={editDialogue} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
