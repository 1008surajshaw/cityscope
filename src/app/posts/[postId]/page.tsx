import { Suspense } from "react";
import { notFound } from "next/navigation";
import MainLayout from "@/layouts/main-layout";
import { PostCard } from "@/components/post/post-card";
import { CommentSection } from "@/components/post/comment-section";
import { getPost, getPostComments } from "@/action/post.actions";
import { GetLikedPostID, GetCommentedPostID } from "@/action/post.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PostByIdSchemaType } from "@/validators/post.validators";



const page = async ({ params }: {params: PostByIdSchemaType} )  => {

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

export default page;