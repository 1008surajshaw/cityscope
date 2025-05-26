import { PostCard } from "@/components/post/post-card"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { getStableCachedPosts, getStableCachedCommentedPosts, getStableCachedLikedPosts } from "@/lib/data-cache"

interface OptimizedPostFeedProps {
  pathname: string
}

export async function OptimizedPostFeed({ pathname }: OptimizedPostFeedProps) {
  console.log("OptimizedPostFeed rendering for:", pathname)

  try {
    // Use the cached versions to prevent infinite loops
    const [postsResponse, commentedPostResponse, likedPostResponse] = await Promise.all([
      getStableCachedPosts(),
      getStableCachedCommentedPosts(),
      getStableCachedLikedPosts(),
    ])

    console.log("Data fetched and cached successfully")

    if (!postsResponse.data?.post) {
      return (
        <Card className="mx-auto max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Error Loading Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {postsResponse.message || "Failed to load posts. Please try again later."}
            </p>
          </CardContent>
        </Card>
      )
    }

    const posts = postsResponse.data.post
    const commentedPostIds = commentedPostResponse.data?.map((item) => item.postId) || []
    const likedPostIds = likedPostResponse.data?.map((item) => item.postId) || []

    let filteredPosts = posts
    if (pathname === "/posts/liked") {
      filteredPosts = posts.filter((post) => likedPostIds.includes(post.id))
    } else if (pathname === "/posts/commented") {
      filteredPosts = posts.filter((post) => commentedPostIds.includes(post.id))
    }

    if (filteredPosts.length === 0) {
      return (
        <Card className="mx-auto max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">No Posts Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {pathname === "/posts/liked"
                ? "You haven't liked any posts yet."
                : pathname === "/posts/commented"
                  ? "You haven't commented on any posts yet."
                  : "No posts available at the moment."}
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        <div className="text-center text-muted-foreground mb-4">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
        </div>
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isCommented={commentedPostIds.includes(post.id)}
            isLiked={likedPostIds.includes(post.id)}
          />
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error in OptimizedPostFeed:", error)
    return (
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Error Loading Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Something went wrong. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }
}
