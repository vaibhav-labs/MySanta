"use client"

import { useState, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { signInSchema, signUpSchema } from "@/lib/validations"
import { toast } from "react-hot-toast"
import bcrypt from "bcryptjs"

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validation = signInSchema.safeParse(formData)
      if (!validation.success) {
        const newErrors: Record<string, string> = {}
        validation.error.errors.forEach(error => {
          newErrors[error.path[0] as string] = error.message
        })
        setErrors(newErrors)
        return
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid email or password")
      } else {
        toast.success("Signed in successfully!")
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const validation = signUpSchema.safeParse(formData)
      if (!validation.success) {
        const newErrors: Record<string, string> = {}
        validation.error.errors.forEach(error => {
          newErrors[error.path[0] as string] = error.message
        })
        setErrors(newErrors)
        return
      }

      const hashedPassword = await bcrypt.hash(formData.password, 12)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          hashedPassword,
          dob: formData.dob,
          anniversary: formData.anniversary || null,
          gender: formData.gender,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || "Failed to create account")
        return
      }

      toast.success("Account created successfully!")

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      toast.error("Failed to sign in with Google")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isSignUp ? "Create Account" : "Sign In"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-secondary" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />

            {isSignUp && (
              <>
                <Input
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  error={errors.dob}
                  required
                />

                <Input
                  label="Anniversary (Optional)"
                  type="date"
                  name="anniversary"
                  value={formData.anniversary}
                  onChange={handleInputChange}
                  error={errors.anniversary}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as "male" | "female" | "other" }))}
                    className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="other">Other</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-black hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-black hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInForm />
    </Suspense>
  )
}