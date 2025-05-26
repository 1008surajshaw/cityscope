"use client"

import MainLayout from '@/layouts/main-layout';
import { CreatePost } from '@/components/post/create-post';
import PostFeed from '@/components/post/post-feed';
import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Map of topic IDs to display names
const TOPIC_NAMES: Record<string, string> = {
  'economics': 'Economics',
  'science': 'Science',
  'technology': 'Technology',
  'hollywood': 'Hollywood',
  'politics': 'Politics',
  'sports': 'Sports',
  'health': 'Health',
  'education': 'Education',
};

// Simple loading component
function LoadingPosts() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="loader"></div>
    </div>
  );
}

export default function TopicPage({ params }: { params: { topicId: string } }) {
  const { status } = useSession();
  const router = useRouter();
  const topicName = TOPIC_NAMES[params.topicId] || params.topicId;
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="loader"></div>
      </div>
    );
  }
  
  if (status !== 'authenticated') {
    return null;
  }
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold capitalize">{topicName}</h1>
        <p className="text-muted-foreground">
          Posts related to {topicName.toLowerCase()}
        </p>
        <CreatePost />
        <Suspense fallback={<LoadingPosts />}>
          <PostFeed />
        </Suspense>
      </div>
    </MainLayout>
  );
}