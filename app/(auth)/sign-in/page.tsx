"use client"

import { useState, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErrors({})
    try {
      const validation = signInSchema.safeParse(formData)
      if (!validation.success) {
        const errs: Record<string, string> = {}
        validation.error.errors.forEach(err => { errs[err.path[0] as string] = err.message })
        setErrors(errs); return
      }
      const result = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false })
      if (result?.error) { toast.error("Invalid email or password") }
      else {
        toast.success("Signed in!")
        const session = await getSession()
        if (session) { router.push(callbackUrl); router.refresh() }
      }
    } catch { toast.error("An error occurred.") }
    finally { setLoading(false) }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErrors({})
    try {
      const validation = signUpSchema.safeParse(formData)
      if (!validation.success) {
        const errs: Record<string, string> = {}
        validation.error.errors.forEach(err => { errs[err.path[0] as string] = err.message })
        setErrors(errs); return
      }
      const { default: bcrypt } = await import("bcryptjs")
      const hashedPassword = await bcrypt.hash(formData.password, 12)
      const response = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, hashedPassword, dob: formData.dob, anniversary: formData.anniversary || null, gender: formData.gender }),
      })
      if (!response.ok) { const err = await response.json(); toast.error(err.message || "Failed to create account"); return }
      toast.success("Account created!")
      const result = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false })
      if (result?.ok) {
        const session = await getSession()
        if (session) { router.push(callbackUrl); router.refresh() }
      }
    } catch { toast.error("An error occurred.") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{background: 'linear-gradient(135deg, #0F0B1A 0%, #1E1040 40%, #2D1B69 100%)'}}>
      {/* Background blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-brand/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-brand-pink/20 blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center space-x-2.5 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-card flex items-center justify-center shadow-glow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 11V22" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="7" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7C12 7 10 3 12 3C14 3 12 7 12 7Z" fill="currentColor"/>
            <path d="M12 7C12 7 8 5 10 3C12 1 12 7 12 7Z" fill="currentColor"/>
            <path d="M12 7C12 7 16 5 14 3C12 1 12 7 12 7Z" fill="currentColor"/>
          </svg>
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight">MySanta</span>
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-sm glass rounded-3xl p-8 shadow-glass">
        <h1 className="text-2xl font-extrabold text-white mb-1">
          {isSignUp ? "Create account" : "Welcome back"}
        </h1>
        <p className="text-white/40 text-sm mb-6">
          {isSignUp ? "Start sharing wishlists with your squad" : "Sign in to your account to continue"}
        </p>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full flex items-center justify-center space-x-2.5 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-medium transition-all mb-5"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.96l3.007 2.332C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-3 text-xs text-white/30 uppercase tracking-wider">or</span>
          </div>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-3.5">
          {isSignUp && (
            <AuthInput label="Name" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} placeholder="Your name" />
          )}
          <AuthInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} placeholder="you@example.com" />
          <AuthInput label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} error={errors.password} placeholder="••••••••" />

          {isSignUp && (
            <>
              <AuthInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} error={errors.dob} />
              <AuthInput label="Anniversary (optional)" name="anniversary" type="date" value={formData.anniversary} onChange={handleInputChange} />
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/60">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}
                  className="w-full h-10 rounded-xl bg-white/10 border border-white/10 px-3 text-sm text-white focus:outline-none focus:border-brand/50">
                  <option value="other" className="bg-[#1E1040]">Other</option>
                  <option value="male" className="bg-[#1E1040]">Male</option>
                  <option value="female" className="bg-[#1E1040]">Female</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-card text-white font-bold text-sm hover:opacity-90 transition-all hover:shadow-glow disabled:opacity-50 mt-1">
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-5">
          {isSignUp ? <>Already have an account?{" "}
            <button onClick={() => setIsSignUp(false)} className="text-brand font-semibold hover:underline">Sign in</button>
          </> : <>Don't have an account?{" "}
            <button onClick={() => setIsSignUp(true)} className="text-brand font-semibold hover:underline">Sign up</button>
          </>}
        </p>
      </div>
    </div>
  )
}

function AuthInput({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/60">{label}</label>
      <input
        className="w-full h-10 rounded-xl bg-white/10 border border-white/10 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand/50 transition-colors"
        {...props}
      />
      {error && <p className="text-xs text-brand-pink">{error}</p>}
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0F0B1A, #2D1B69)'}}>
        <div className="animate-pulse text-white/40">Loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
