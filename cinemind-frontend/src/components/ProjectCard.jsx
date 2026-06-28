import { Link } from 'react-router-dom'
import { Clapperboard, Trash2 } from 'lucide-react'
import { formatDuration, formatShortDate } from '../services/projectService.js'

export default function ProjectCard({ project, onDelete }) {
  const title = project.title || project.name || 'Untitled film'

  return (
    <div className="group panel relative flex flex-col gap-4 p-5 transition-transform duration-150 hover:-translate-y-0.5 animate-fadeUp">
      <Link to={`/workspace/${project.id}`} className="absolute inset-0" aria-label={`Open ${title}`} />

      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-raised text-amber">
          <Clapperboard className="h-4 w-4" />
        </span>
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(project.id)
            }}
            className="relative z-10 rounded-md p-1.5 text-paper-faint opacity-0 transition-opacity hover:bg-crimson/10 hover:text-crimson group-hover:opacity-100"
            aria-label={`Delete ${title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-display text-lg text-paper">{title}</h3>
        <p className="mt-1 truncate text-sm text-paper-dim">
          {project.genre || 'Genre TBD'} · {formatDuration(project.duration)}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between text-xs text-paper-faint">
        <span className="font-mono uppercase tracking-wide">{project.artStyle || project.art_style || '—'}</span>
        <span>{formatShortDate(project.createdAt || project.created_at)}</span>
      </div>
    </div>
  )
}
