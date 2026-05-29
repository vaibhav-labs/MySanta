"use client"

import { useState, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { signInSchema, signUpSchema } from "@/lib/validations"
import { toast } from "react-hot-toast"

function GiftLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-brand">
      <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 11V22" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="3" y="7" width="18" height="4" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 7C12 7 10 3 12 3C14 3 12 7 12 7Z" fill="currentColor"/>
      <path d="M12 7C12 7 8 5 10 3C12 1 12 7 12 7Z" fill="currentColor"/>
      <path d="M12 7C12 7 16 5 14 3C12 1 12 7 12 7Z" fill="currentColor"/>
    </svg>
  )
}

function SignInForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    anniversary: "",
    gender: "other" as "male" | "female" | "other",
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
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const validation = signInSchema.safeParse(formData)
      if (!validation.success) {
        const newErrors: Record<string, string> = {}
        validation.error.errors.forEach(err => { newErrors[err.path[0] as string] = err.message })
        setErrors(newErrors)
        return
      }
      const result = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false })
      if (result?.error) {
        toast.error("Invalid email or password")
      } else {
        toast.success("Signed in successfully!")
        const session = await getSession()
        if (session) { router.push(callbackUrl); router.refresh() }
      }
    } catch { toast.error("An error occurred. Please try again.") }
    finally { setLoading(false) }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const validation = signUpSchema.safeParse(formData)
      if (!validation.success) {
        const newErrors: Record<string, string> = {}
        validation.error.errors.forEach(err => { newErrors[err.path[0] as string] = err.message })
        setErrors(newErrors)
        return
      }

      const { default: bcrypt } = await import("bcryptjs")
      const hashedPassword = await bcrypt.hash(formData.password, 12)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, hashedPassword, dob: formData.dob, anniversary: formData.anniversary || null, gender: formData.gender }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || "Failed to create account")
        return
      }

      toast.success("Account created!")
      const result = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false })
      if (result?.ok) {
        const session = await getSession()
        if (session) { router.push(callbackUrl); router.refresh() }
      }
    } catch { toast.error("An error occurred. Please try again.") }
    finally { setLoading(false) }
  }

  const handleGoogleSignIn = () => signIn("google", { callbackUrl })

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      {/* Logo above card */}
      <div className="flex items-center space-x-2 mb-7">
        <GiftLogo />
        <span className="text-xl font-bold text-primary tracking-tight">MySanta</span>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-sm bg-white border border-secondary rounded-2xl shadow-card p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isSignUp
              ? "Start sharing your wish lists with friends and family"
              : "Sign in to your account to continue"}
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-2 border border-secondary rounded-lg py-2.5 px-4 text-sm font-medium text-primary hover:bg-surface transition-colors mb-5"
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
            <div className="w-full border-t border-secondary" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
          </div>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          {isSignUp && (
            <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} placeholder="Your name" required />
          )}
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} placeholder="you@example.com" required />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} error={errors.password} placeholder="••••••••" required />

          {isSignUp && (
            <>
              <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleInputChange} error={errors.dob} required />
              <Input label="Anniversary (optional)" type="date" name="anniversary" value={formData.anniversary} onChange={handleInputChange} error={errors.anniversary} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-primary">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-lg border border-secondary bg-white px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="other">Other</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full rounded-lg mt-2" loading={loading}>
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {isSignUp ? (
            <>Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)} className="text-brand font-medium hover:underline">Sign in</button>
            </>
          ) : (
            <>Don't have an account?{" "}
              <button onClick={() => setIsSignUp(true)} className="text-brand font-medium hover:underline">Sign up</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
