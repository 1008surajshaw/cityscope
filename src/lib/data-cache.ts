import { cache } from "react"
import { getAllPosts, GetCommentedPostID, GetLikedPostID } from "@/action/post.actions"

// Create cached versions of your data fetching functions
export const getCachedAllPosts = cache(getAllPosts)
export const getCachedCommentedPostID = cache(GetCommentedPostID)
export const getCachedLikedPostID = cache(GetLikedPostID)

// Alternative: Use unstable_cache for more control
import { unstable_cache } from "next/cache"

export const getStableCachedPosts = unstable_cache(
  async () => {
    console.log("Fetching posts from database...")
    return await getAllPosts()
  },
  ["all-posts"],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["posts"],
  },
)

export const getStableCachedCommentedPosts = unstable_cache(
  async () => {
    console.log("Fetching commented posts from database...")
    return await GetCommentedPostID()
  },
  ["commented-posts"],
  {
    revalidate: 60,
    tags: ["comments"],
  },
)

export const getStableCachedLikedPosts = unstable_cache(
  async () => {
    console.log("Fetching liked posts from database...")
    return await GetLikedPostID()
  },
  ["liked-posts"],
  {
    revalidate: 60,
    tags: ["likes"],
  },
)
