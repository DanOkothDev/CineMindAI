import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import useProject from '../hooks/useProject.js'
import CharacterCard from '../components/CharacterCard.jsx'
import LoadingScreen from '../components/LoadingScreen.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function CharactersPage() {
  const { projectId } = useParams()
  const { characters, charactersLoading, charactersError, fetchCharacters, addCharacter, editCharacter, removeCharacter } =
    useProject()
  const [adding, setAdding] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newCharacter, setNewCharacter] = useState({ name: '', role: '' })

  async function handleCreate(e) {
    e.preventDefault()
    if (!newCharacter.name.trim()) return
    setCreating(true)
    try {
      await addCharacter({ projectId, name: newCharacter.name.trim(), role: newCharacter.role.trim() })
      setNewCharacter({ name: '', role: '' })
      setAdding(false)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="slug-line">Cast</p>
          <h1 className="mt-1 font-display text-2xl text-paper">Characters</h1>
        </div>
        <button onClick={() => setAdding((a) => !a)} className="btn-secondary text-sm">
          <Plus className="h-4 w-4" /> Add character
        </button>
      </div>

      {adding && (
        <form onSubmit={handleCreate} className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="slug-line mb-1.5 block">Name</span>
            <input
              className="input-field"
              value={newCharacter.name}
              onChange={(e) => setNewCharacter((c) => ({ ...c, name: e.target.value }))}
              placeholder="Captain Lyra Vance"
              autoFocus
            />
          </label>
          <label className="flex-1">
            <span className="slug-line mb-1.5 block">Role</span>
            <input
              className="input-field"
              value={newCharacter.role}
              onChange={(e) => setNewCharacter((c) => ({ ...c, role: e.target.value }))}
              placeholder="Protagonist"
            />
          </label>
          <button type="submit" className="btn-primary" disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </form>
      )}

      {charactersLoading && characters.length === 0 && <LoadingScreen fullScreen={false} message="Loading the cast…" />}

      {!charactersLoading && charactersError && (
        <StatusMessage
          variant="error"
          title="Couldn't load characters"
          description={charactersError}
          onRetry={() => fetchCharacters(projectId)}
        />
      )}

      {!charactersLoading && !charactersError && characters.length === 0 && (
        <StatusMessage variant="empty" title="No characters yet" description="Add one, or generate a new project to draft a full cast." />
      )}

      {characters.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} onSave={editCharacter} onDelete={removeCharacter} />
          ))}
        </div>
      )}
    </div>
  )
}
