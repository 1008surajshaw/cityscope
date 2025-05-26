
import MainLayout from '@/layouts/main-layout';
import { Suspense } from 'react';
import { PostFeedWrapper } from '@/components/post/post-feed-wrapper';
import { PostFeedSkeleton } from '@/components/skeletons/PostFeedSkeleton';
import { getServerSession } from 'next-auth';

// Simple loading component


export default async function CommentedPostsPage() {
  const session = getServerSession();
  console.log(session,"session in commeted")


  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Commented Posts</h1>
        <p className="text-muted-foreground">
          Posts you've commented on will appear here.
        </p>
        <Suspense fallback={<PostFeedSkeleton/>}>
           <PostFeedWrapper pathname="/posts/commented" />
        </Suspense>
      </div>
    </MainLayout>
  );
}