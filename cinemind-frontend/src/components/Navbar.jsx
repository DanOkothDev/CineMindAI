import { Link, NavLink } from 'react-router-dom'
import { Clapperboard, Plus } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber text-ink">
            <Clapperboard className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            CineMind<span className="text-amber">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavTab to="/dashboard">Dashboard</NavTab>
        </nav>

        <Link to="/create" className="btn-primary text-sm">
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>
    </header>
  )
}

function NavTab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? 'text-amber' : 'text-paper-dim hover:text-paper'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
