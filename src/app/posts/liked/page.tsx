
import MainLayout from '@/layouts/main-layout';
import { Suspense } from 'react';
import { PostFeedWrapper } from '@/components/post/post-feed-wrapper';
import { PostFeedSkeleton } from '@/components/skeletons/PostFeedSkeleton';

// Simple loading component


export default async function LikedPostsPage() {

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Liked Posts</h1>
        <p className="text-muted-foreground">
          Posts you've liked will appear here.
        </p>
        <Suspense fallback={<PostFeedSkeleton />}>
          <PostFeedWrapper pathname="/posts/liked" />
        </Suspense>
      </div>
    </MainLayout>
  );
}