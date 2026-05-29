"use client"

import { useState, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signInSchema, signUpSchema } from "@/lib/validations"
import { toast } from "react-hot-toast"

function SignInForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    dob: "", anniversary: "", gender: "other" as "male" | "female" | "other",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErrors({})
    try {
      const v = signInSchema.safeParse(formData)
      if (!v.success) {
        const errs: Record<string,string> = {}
        v.error.errors.forEach(e => { errs[e.path[0] as string] = e.message })
        setErrors(errs); return
      }
      const result = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false })
      if (result?.error) toast.error("Invalid email or password")
      else { const s = await getSession(); if (s) { router.push(callbackUrl); router.refresh() } }
    } catch { toast.error("Something went wrong.") }
    finally { setLoading(false) }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErrors({})
    try {
      const v = signUpSchema.safeParse(formData)
      if (!v.success) {
        const errs: Record<string,string> = {}
        v.error.errors.forEach(e => { errs[e.path[0] as string] = e.message })
        setErrors(errs); return
      }
      const { default: bcrypt } = await import("bcryptjs")
      const hashedPassword = await bcrypt.hash(formData.password, 12)
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, hashedPassword, dob: formData.dob, anniversary: formData.anniversary || null, gender: formData.gender }),
      })
      if (!res.ok) { const err = await res.json(); toast.error(err.message || "Failed"); return }
      toast.success("Account created!")
      const result = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false })
      if (result?.ok) { const s = await getSession(); if (s) { router.push(callbackUrl); router.refresh() } }
    } catch { toast.error("Something went wrong.") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-secondary">
        <div className="container h-14 flex items-center justify-between">
          <Link href="/">
            <span className="font-display text-2xl uppercase text-ink tracking-wider">MySanta</span>
          </Link>
          <p className="text-xs text-gray-400 hidden md:block">
            {isSignUp ? "Already have an account?" : "No account yet?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-ink font-bold underline underline-offset-2">
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left panel — form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-5xl uppercase text-ink mb-1">
              {isSignUp ? "Join Up." : "Welcome Back."}
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              {isSignUp ? "Start your wishlists. For free." : "Sign in to your account."}
            </p>

            {/* Google */}
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full flex items-center justify-center space-x-2.5 py-3 px-4 border border-secondary hover:border-ink hover:bg-surface text-sm font-medium transition-all mb-4"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96l3.007 2.332C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-secondary" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-secondary" />
            </div>

            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-3">
              {isSignUp && <Field label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Your name" />}
              <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
              <Field label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" />
              {isSignUp && (
                <>
                  <Field label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} error={errors.dob} />
                  <Field label="Anniversary (optional)" name="anniversary" type="date" value={formData.anniversary} onChange={handleChange} />
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}
                      className="w-full h-10 border border-secondary px-3 text-sm text-ink focus:outline-none focus:border-ink bg-white">
                      <option value="other">Other</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-ink text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 mt-2">
                {loading ? "Please wait..." : isSignUp ? "Create Account →" : "Sign In →"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5">
              {isSignUp ? "Already have an account? " : "No account? "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-ink font-bold underline underline-offset-2">
                {isSignUp ? "Sign in" : "Sign up free"}
              </button>
            </p>
          </div>
        </div>

        {/* Right panel — yellow brand block (desktop only) */}
        <div className="hidden lg:flex w-[440px] bg-brand flex-col justify-between p-12 border-l border-secondary">
          <p className="font-display text-4xl uppercase text-ink leading-tight">
            Filtered<br />gifting is<br />boring.
          </p>
          <div>
            <p className="text-ink/60 text-sm leading-relaxed mb-6">
              No more "I don't know what to get you" energy. Create a wishlist, share a link, get exactly what you want.
            </p>
            <div className="space-y-2">
              {['Paste a URL, auto-fill in seconds', 'Share one link with your whole squad', 'Friends hold items — no duplicates', 'Get notified when gifts are purchased'].map(f => (
                <div key={f} className="flex items-center space-x-2.5">
                  <div className="w-1.5 h-1.5 bg-ink rounded-full flex-shrink-0" />
                  <p className="text-sm text-ink font-medium">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="font-display text-6xl uppercase text-ink/20 leading-none">MySanta</p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold uppercase tracking-wider text-ink">{label}</label>
      <input
        className="w-full h-10 border border-secondary px-3 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:border-ink transition-colors bg-white"
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="font-display text-4xl uppercase text-ink animate-pulse">MySanta</div></div>}>
      <SignInForm />
    </Suspense>
  )
}
