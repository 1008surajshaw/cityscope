"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { toast } from "sonner"
import { toggleLike } from "@/action/post.actions"
import { useRouter } from "next/navigation"

interface InteractivePostCardProps {
  postId: string
  totalLikes: number
  totalComments: number
  isLiked: boolean
  isCommented: boolean
}

export function InteractivePostCard({
  postId,
  totalLikes,
  totalComments,
  isLiked,
  isCommented,
}: InteractivePostCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(totalLikes)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // Toggle optimistically
      setLiked(!liked)
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1))

      // Call the server action to toggle like
      const result = await toggleLike(postId)
      
      if (result.status !== 200) {
        // Revert on error
        setLiked(liked)
        setLikeCount(totalLikes)
        toast.error(result.message || "Failed to update like")
      } else {
        toast.success(liked ? "Post unliked" : "Post liked")
      }
    } catch (error) {
      // Revert on error
      setLiked(liked)
      setLikeCount(totalLikes)
      toast.error("Failed to update like")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Check out this post",
        url: `${window.location.origin}/posts/${postId}`,
      })
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`)
      toast.success("Link copied to clipboard")
    }
  }

  const handleCommentClick = () => {
    console.log("Comment clicked")
    router.push(`/posts/${postId}`)
  }

  return (
    <div className="flex justify-between">
      <Button
        variant="ghost"
        size="sm"
        className={`text-muted-foreground ${liked ? "text-red-500" : ""}`}
        onClick={handleLike}
        disabled={isLoading}
      >
        <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
        <span>{likeCount}</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-muted-foreground ${isCommented ? "text-blue-500" : ""}`}
        onClick={handleCommentClick}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        <span>{totalComments}</span>
      </Button>
      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-1" />
        <span>Share</span>
      </Button>
    </div>
  )
}
