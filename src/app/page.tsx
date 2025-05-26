import { Suspense } from "react"
import MainLayout from "@/layouts/main-layout"
import { CreatePost } from "@/components/post/create-post"
import { PostFeedWrapper } from "@/components/post/post-feed-wrapper"
import { getServerSession } from "next-auth"
import { GoogleOauthButton } from "@/components/common/social-auth"
import { PostFeedSkeleton } from "@/components/skeletons/PostFeedSkeleton"
import { OnboardingPage } from "@/components/auth/onboarding-form"
import { TestLoginForm } from "@/components/auth/test-login-form"
import { authOptions } from "@/lib/authOptions"

export default async function HomePage() {
  console.log("HomePage rendering...")

  const session = await getServerSession(authOptions)
  console.log(session, "session in the page.tsx")

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="mb-6 text-3xl font-bold">Welcome to CityScope</h1>
        <div className="w-full max-w-sm">
          <GoogleOauthButton label="Sign in with Google" />
          <div>
            <TestLoginForm/>
          </div>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-4">
      <div className="border p-2">
        {session && session.user && session.user?.onBoard == false && <OnboardingPage />}
        <CreatePost />
      </div>
        <Suspense fallback={<PostFeedSkeleton />}>
          <PostFeedWrapper pathname="/" />
        </Suspense>
      </div>
    </MainLayout>
  )
}
