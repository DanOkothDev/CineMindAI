import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, LogIn } from 'lucide-react'
import useAuth from '../hooks/useAuth.js'

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [formError, setFormError] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      setFormError('Email and password are required.')
      return
    }
    setFormError(null)
    try {
      await login({ email: form.email.trim(), password: form.password })
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(err.message)
    }
  }

  const displayError = formError || error

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <p className="slug-line">Welcome back</p>
        <h1 className="mt-1 font-display text-2xl text-paper">Sign in to CineMindAI</h1>
        <p className="mt-2 text-sm text-paper-dim">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-amber hover:underline">
            Create one
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="Email">
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
            autoFocus
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="current-password"
          />
        </Field>

        {displayError && (
          <p className="rounded-md border border-crimson/40 bg-crimson/10 px-3.5 py-2.5 text-sm text-crimson">
            {displayError}
          </p>
        )}

        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="slug-line mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}
