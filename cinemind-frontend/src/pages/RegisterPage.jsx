import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, UserPlus } from 'lucide-react'
import useAuth from '../hooks/useAuth.js'

export default function RegisterPage() {
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [formError, setFormError] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setFormError('All fields are required.')
      return
    }
    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }
    setFormError(null)
    try {
      await register({ username: form.username.trim(), email: form.email.trim(), password: form.password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setFormError(err.message)
    }
  }

  const displayError = formError || error

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <p className="slug-line">Get started</p>
        <h1 className="mt-1 font-display text-2xl text-paper">Create your account</h1>
        <p className="mt-2 text-sm text-paper-dim">
          Already have an account?{' '}
          <Link to="/login" className="text-amber hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="Username">
          <input
            className="input-field"
            placeholder="filmmaker"
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            className="input-field"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="new-password"
          />
        </Field>

        <Field label="Confirm password">
          <input
            type="password"
            className="input-field"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            autoComplete="new-password"
          />
        </Field>

        {displayError && (
          <p className="rounded-md border border-crimson/40 bg-crimson/10 px-3.5 py-2.5 text-sm text-crimson">
            {displayError}
          </p>
        )}

        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {loading ? 'Creating account…' : 'Create account'}
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
