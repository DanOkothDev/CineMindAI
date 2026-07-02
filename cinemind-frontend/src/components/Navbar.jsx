import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Clapperboard, Plus, LogOut, User, Menu, X } from 'lucide-react'
import useAuth from '../hooks/useAuth.js'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  const initial = user?.username?.[0]?.toUpperCase()

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-ink/95 backdrop-blur transition-shadow duration-200 ${
        scrolled ? 'border-slate-line shadow-lg shadow-black/20' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber text-ink">
            <Clapperboard className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            CineMind<span className="text-amber">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {isAuthenticated && <NavTab to="/dashboard">Dashboard</NavTab>}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 text-sm text-paper-dim">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber/15 text-xs font-semibold text-amber">
                  {initial || <User className="h-3.5 w-3.5" />}
                </span>
                {user?.username}
              </span>
              <Link to="/create" className="btn-primary text-sm">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm" title="Sign out">
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

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-paper-dim transition-colors hover:bg-white/5 hover:text-paper md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-slate-line bg-ink/98 backdrop-blur transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-amber/10 text-amber' : 'text-paper-dim hover:bg-white/5 hover:text-paper'
                }`
              }
            >
              Dashboard
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <div className="mt-1 flex items-center gap-2 border-t border-slate-line px-3 py-3 text-sm text-paper-dim">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber/15 text-xs font-semibold text-amber">
                  {initial || <User className="h-3.5 w-3.5" />}
                </span>
                {user?.username}
              </div>
              <Link to="/create" className="btn-primary mt-1 justify-center text-sm">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
              <button onClick={handleLogout} className="btn-secondary mt-2 justify-center text-sm">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <div className="mt-1 flex flex-col gap-2 border-t border-slate-line pt-3">
              <Link to="/login" className="btn-secondary justify-center text-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary justify-center text-sm">
                <Plus className="h-4 w-4" />
                Get started
              </Link>
            </div>
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
        `relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? 'text-amber' : 'text-paper-dim hover:text-paper'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={`absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-amber transition-transform duration-200 ${
              isActive ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </>
      )}
    </NavLink>
  )
}