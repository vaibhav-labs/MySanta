"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navigation } from "@/components/Navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { UserIcon, EditIcon, SaveIcon, MaleIcon, FemaleIcon, OtherGenderIcon } from "@/components/ui/Icons"
import { toast } from "react-hot-toast"

interface UserProfile {
  id: string
  name: string | null
  email: string
  dob: string
  anniversary: string | null
  gender: "male" | "female" | "other"
  address: any
  createdAt: string
}

function getGenderIcon(gender: string) {
  switch (gender) {
    case "male":
      return MaleIcon
    case "female":
      return FemaleIcon
    default:
      return OtherGenderIcon
  }
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    anniversary: "",
    gender: "other" as "male" | "female" | "other",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || "",
          anniversary: data.anniversary ? new Date(data.anniversary).toISOString().split('T')[0] : "",
          gender: data.gender || "other",
        })
      }
    } catch (error) {
      toast.error("Failed to load profile")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          anniversary: formData.anniversary || null,
          gender: formData.gender,
        }),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
        toast.success("Profile updated successfully!")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred while updating profile")
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-pulse">Loading profile...</div>
          </div>
        </main>
      </div>
    )
  }

  const GenderIcon = getGenderIcon(profile.gender)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
                    <GenderIcon className="w-5 h-5" />
                  </div>
                  <span>Your Profile</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2"
                >
                  <EditIcon className="w-4 h-4" />
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                  ) : (
                    <p className="text-black p-2 bg-gray-50 rounded">{profile.name || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-black p-2 bg-gray-50 rounded">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  <p className="text-black p-2 bg-gray-50 rounded">
                    {new Date(profile.dob).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Anniversary</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      name="anniversary"
                      value={formData.anniversary}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-black p-2 bg-gray-50 rounded">
                      {profile.anniversary
                        ? new Date(profile.anniversary).toLocaleDateString()
                        : "Not set"
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="other">Other</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  ) : (
                    <p className="text-black p-2 bg-gray-50 rounded capitalize">{profile.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                  <p className="text-black p-2 bg-gray-50 rounded">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="pt-4">
                  <Button
                    onClick={handleSave}
                    loading={loading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <SaveIcon className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}