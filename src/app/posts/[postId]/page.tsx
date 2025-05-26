import { Suspense } from "react";
import { notFound } from "next/navigation";
import MainLayout from "@/layouts/main-layout";
import { PostCard } from "@/components/post/post-card";
import { CommentSection } from "@/components/post/comment-section";
import prisma from "@/lib/prisma";
import { getPostComments } from "@/action/post.actions";
import { GetLikedPostID, GetCommentedPostID } from "@/action/post.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function getPost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      totalLikes: true,
      totalComments: true,
    },
  });

  if (!post) return null;

  return {
    ...post,
    image: post.image || undefined,
    author: {
      ...post.author,
      image: post.author.image || undefined,
      name: post.author.name || '',
    },
  };
}

export default async function PostPage({ params }: { params: { postId: string } }) {
  const postId = params.postId;
  const post = await getPost(postId);
  
  if (!post) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Get liked and commented status if user is logged in
  let isLiked = false;
  let isCommented = false;

  if (userId) {
    const [likedResponse, commentedResponse] = await Promise.all([
      GetLikedPostID(),
      GetCommentedPostID(),
    ]);

    isLiked = likedResponse.data?.some(like => like.postId === postId) || false;
    isCommented = commentedResponse.data?.some(comment => comment.postId === postId) || false;
  }

  // Get comments for the post
  const commentsResponse = await getPostComments(postId);
  const comments = commentsResponse.data || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PostCard post={post} isLiked={isLiked} isCommented={isCommented} />
        
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection postId={postId} initialComments={comments} />
        </Suspense>
      </div>
    </MainLayout>
  );
}