'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNameInitials } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createPost } from '@/action/post.actions';
import { useRouter } from 'next/navigation';

export function CreatePost() {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update size limit to match server configuration (8MB)
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size should be less than 8MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (imageFile) {
          formData.append('image', imageFile);
        }
        
        const result = await createPost(formData);
        
        if (result.status >= 200 && result.status < 300) {
          toast.success(result.message);
          // Reset form
          setTitle('');
          setContent('');
          setImageFile(null);
          setImagePreview(null);
          // Refresh the page to show the new post
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Error creating post:', error);
        toast.error('Failed to create post. Please try again.');
      }
    });
  };

  if (!session) {
    return null;
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage 
                src={session.user?.image || undefined} 
                alt={session.user?.name || 'User'} 
              />
              <AvatarFallback>
                {getNameInitials(session.user?.name || 'User')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-none bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              />
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-none bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              />
              
              {imagePreview && (
                <div className="relative mt-2 rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[300px] object-cover" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between px-4 py-3 border-t">
          <div>
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ImagePlus className="h-5 w-5" />
                <span className="text-sm">Add Image</span>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <Button 
            type="submit" 
            disabled={isPending || !content.trim()}
            className="px-4"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : 'Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
