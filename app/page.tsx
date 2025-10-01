import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/Button"
import { Footer } from "@/components/Footer"
import { GiftIcon, ShareIcon, HeartIcon } from "@/components/ui/Icons"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-secondary">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-black flex items-center space-x-2">
              <span>🎁</span>
              <span>MySanta</span>
            </h1>
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="container py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-semibold text-black mb-6">
              Share Your Wish Lists with Friends and Family
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create gift lists for any occasion and let your loved ones know exactly what you want.
              See what others are wishing for and make gift-giving effortless.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary">
          <div className="container py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-medium text-black mb-3 flex items-center justify-center space-x-2">
                  <GiftIcon className="w-5 h-5" />
                  <span>Create Lists</span>
                </h3>
                <p className="text-gray-600">
                  Add items from any website to your wish lists.
                  Organize by events, occasions, or just for fun.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-black mb-3 flex items-center justify-center space-x-2">
                  <ShareIcon className="w-5 h-5" />
                  <span>Share with Friends</span>
                </h3>
                <p className="text-gray-600">
                  Share your lists with family and friends.
                  They can see what you want and mark items as purchased.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-black mb-3 flex items-center justify-center space-x-2">
                  <HeartIcon className="w-5 h-5" />
                  <span>Give Perfect Gifts</span>
                </h3>
                <p className="text-gray-600">
                  No more guessing what to buy.
                  Choose from your friends' lists and give gifts they actually want.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}