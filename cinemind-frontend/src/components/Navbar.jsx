import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Clapperboard, Plus, LogOut, User } from 'lucide-react'
import useAuth from '../hooks/useAuth.js'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

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
          {isAuthenticated && <NavTab to="/dashboard">Dashboard</NavTab>}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden items-center gap-1.5 text-sm text-paper-dim sm:flex">
                <User className="h-3.5 w-3.5" />
                {user?.username}
              </span>
              <Link to="/create" className="btn-primary text-sm">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                <Plus className="h-4 w-4" />
                Get started
              </Link>
            </>
          )}
        </div>
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
