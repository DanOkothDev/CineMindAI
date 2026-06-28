import { NavLink } from 'react-router-dom'
import {
  BookOpen,
  Users,
  Clapperboard,
  MessageSquare,
  Image,
  Download,
} from 'lucide-react'

const MODULES = [
  { to: 'story', label: 'Story', icon: BookOpen },
  { to: 'characters', label: 'Characters', icon: Users },
  { to: 'scenes', label: 'Scenes', icon: Clapperboard },
  { to: 'dialogues', label: 'Dialogues', icon: MessageSquare },
  { to: 'visual-prompts', label: 'Visual Prompts', icon: Image },
  { to: 'export', label: 'Export', icon: Download },
]

export default function Sidebar({ project }) {
  return (
    <aside className="sprocket-rail relative hidden w-60 flex-shrink-0 border-r border-slate-line bg-ink-soft pl-6 pr-3 py-6 md:block">
      <div className="mb-6 px-1">
        <p className="slug-line">Project</p>
        <h2 className="mt-1 truncate font-display text-base text-paper" title={project?.title}>
          {project?.title || project?.name || 'Untitled film'}
        </h2>
      </div>

      <nav className="flex flex-col gap-1">
        {MODULES.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ink-raised text-amber'
                  : 'text-paper-dim hover:bg-ink-raised hover:text-paper'
              }`
            }
          >
            <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
