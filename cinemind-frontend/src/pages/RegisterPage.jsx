import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, UserPlus, Eye, EyeOff, Clapperboard, Check, X } from 'lucide-react'
import useAuth from '../hooks/useAuth.js'

const FRAMES = [
  { top: '12%', left: '58%', size: 90, delay: '0.3s', hue: 'from-fuchsia-500/50 to-indigo-500/30' },
  { top: '62%', left: '68%', size: 70, delay: '1.5s', hue: 'from-indigo-500/40 to-cyan-400/20' },
  { top: '24%', left: '12%', size: 60, delay: '0.9s', hue: 'from-cyan-400/40 to-fuchsia-500/20' },
  { top: '70%', left: '14%', size: 100, delay: '2.1s', hue: 'from-indigo-400/50 to-violet-500/20' },
  { top: '46%', left: '38%', size: 50, delay: '2.7s', hue: 'from-violet-500/40 to-indigo-400/20' },
]

function passwordStrength(pw) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

const STRENGTH_LABEL = ['Too short', 'Weak', 'Okay', 'Good', 'Strong']
const STRENGTH_COLOR = ['bg-red-500', 'bg-red-500', 'bg-amber-500', 'bg-indigo-400', 'bg-emerald-400']

export default function RegisterPage() {
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [formError, setFormError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const strength = useMemo(() => passwordStrength(form.password), [form.password])
  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword

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

  const inputClasses =
    'w-full rounded-lg border border-slate-700 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none backdrop-blur-sm transition-all duration-150 focus:border-indigo-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/20'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0E1A] font-sans text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-1/4 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="grain absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* ---------- RIGHT (now left on desktop): form ---------- */}
        <div className="order-2 flex flex-col justify-center px-5 py-10 sm:px-8 sm:py-12 lg:order-2 lg:px-16">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-500">
              <Clapperboard className="h-4 w-4 text-white" />
            </div>
            <span className="font-sans text-sm font-semibold tracking-tight text-white">CineMindAI</span>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="glow-border absolute -inset-px rounded-2xl opacity-60" />
            <div className="relative rounded-2xl border border-slate-700/60 bg-[#0D1220]/80 p-6 backdrop-blur-xl sm:p-8">
              <p className="slug-line text-xs font-medium tracking-wide text-fuchsia-400 sm:text-sm">
                Get started
              </p>
              <h1 className="mt-1 font-sans text-xl font-semibold text-white sm:text-2xl">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
                  Sign in
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:gap-5">
                <Field label="Username">
                  <input
                    className={inputClasses}
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
                    className={inputClasses}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Password">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`${inputClasses} pr-10`}
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                              i < strength ? STRENGTH_COLOR[strength] : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">{STRENGTH_LABEL[strength]}</p>
                    </div>
                  )}
                </Field>

                <Field label="Confirm password">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`${inputClasses} pr-10`}
                      placeholder="Repeat your password"
                      value={form.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      autoComplete="new-password"
                    />
                    {form.confirmPassword.length > 0 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {passwordsMatch ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                      </span>
                    )}
                  </div>
                </Field>

                {displayError && (
                  <p className="animate-shake rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
                    {displayError}
                  </p>
                )}

                <button
                  type="submit"
                  className="group mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-medium text-white
                             transition-all duration-200 ease-out
                             hover:shadow-lg hover:shadow-fuchsia-500/30 hover:-translate-y-0.5
                             active:translate-y-0 active:scale-95
                             disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1220]"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  )}
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ---------- LEFT (now right on desktop): living montage panel ---------- */}
        <div className="relative order-1 hidden overflow-hidden border-l border-slate-800/60 lg:order-1 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div className="relative z-10 flex items-center justify-end gap-2">
            <span className="font-sans text-sm font-semibold tracking-tight text-white">CineMindAI</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-500">
              <Clapperboard className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0">
            {FRAMES.map((f, i) => (
              <div
                key={i}
                className={`drift absolute rounded-xl bg-gradient-to-br ${f.hue} backdrop-blur-sm`}
                style={{
                  top: f.top,
                  left: f.left,
                  width: f.size,
                  height: f.size * 0.62,
                  animationDelay: f.delay,
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="pulse-ring flex h-20 w-20 items-center justify-center rounded-2xl border border-fuchsia-400/30 bg-white/[0.03] backdrop-blur-md">
                <Clapperboard className="h-8 w-8 text-fuchsia-300" />
              </div>
            </div>
          </div>

          <div className="relative z-10 ml-auto max-w-sm text-right">
            <h2 className="font-sans text-2xl font-semibold leading-tight text-white">
              Every great film starts as one idea.
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Join CineMindAI and turn yours into a full story, cast, and shot list — in minutes.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
        .drift {
          animation: drift 7s ease-in-out infinite;
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-18px) rotate(-2deg); opacity: 1; }
        }
        .pulse-ring {
          animation: pulseRing 3s ease-in-out infinite;
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217,70,239,0.25); }
          50% { box-shadow: 0 0 0 14px rgba(217,70,239,0); }
        }
        .glow-border {
          background: linear-gradient(135deg, rgba(217,70,239,0.5), rgba(99,102,241,0.3), rgba(217,70,239,0.5));
          filter: blur(10px);
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .drift, .pulse-ring { animation: none; }
        }
      `}</style>
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