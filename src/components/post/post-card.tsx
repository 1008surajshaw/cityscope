"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { InteractivePostCard } from "./interactive-post-card"
import { PostType } from "@/interface/post.interface"

interface PostCardProps {
  post: PostType
  isLiked: boolean
  isCommented: boolean
}

export function PostCard({ post, isLiked, isCommented }: PostCardProps) {

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2 pt-4">
        <Avatar>
          <AvatarImage src={post.author.image || ""} alt={post.author.name || "User"} />
          <AvatarFallback>{post.author.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <CardTitle>
            <div className="font-bold hover:underline">
              {post.author.name}
            </div>
          </CardTitle>
          <CardDescription>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <p>{post.content}</p>
      </CardContent>
      {post.image && (
        <CardContent className="py-4">
          <img src={post.image} alt={post.title} className="w-full h-auto rounded-md" />
        </CardContent>
      )}
      <CardFooter className="p-2 border-t">
        <InteractivePostCard
          postId={post.id}
          totalLikes={post.totalLikes}
          totalComments={post.totalComments}
          isLiked={isLiked}
          isCommented={isCommented}
        />
      </CardFooter>
    </Card>
  )
}
