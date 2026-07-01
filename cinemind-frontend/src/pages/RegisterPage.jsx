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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 font-sans">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-10 sm:px-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <p className="slug-line text-xs sm:text-sm tracking-wide text-blue-600 font-medium">
            Get started
          </p>
          <h1 className="mt-1 font-sans text-xl sm:text-2xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <Field label="Username">
            <input
              className="input-field w-full rounded-lg border border-blue-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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
              className="input-field w-full rounded-lg border border-blue-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              autoComplete="email"
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              className="input-field w-full rounded-lg border border-blue-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete="new-password"
            />
          </Field>

          <Field label="Confirm password">
            <input
              type="password"
              className="input-field w-full rounded-lg border border-blue-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              autoComplete="new-password"
            />
          </Field>

          {displayError && (
            <p className="animate-shake rounded-md border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
              {displayError}
            </p>
          )}

          <button
            type="submit"
            className="group mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white
                       transition-all duration-200 ease-out
                       hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5
                       active:translate-y-0 active:scale-95
                       disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="slug-line mb-1.5 block text-xs font-medium tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  )
}