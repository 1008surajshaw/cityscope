"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { createComment, getPostComments } from "@/action/post.actions";
import { getNameInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: CommentData[];
}

interface CommentSectionProps {
  postId: string;
  initialComments?: CommentData[];
}

export function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const router = useRouter();

  const refreshComments = async () => {
    const result = await getPostComments(postId);
    if (result.status === 200 && result.data) {
      setComments(result.data);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createComment(postId, newComment);
      
      if (result.status === 201) {
        toast.success("Comment added successfully");
        setNewComment("");
        refreshComments();
        router.refresh(); // Refresh the page to update comment count
      } else {
        toast.error(result.message || "Failed to add comment");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!session) {
      toast.error("Please sign in to reply");
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createComment(postId, replyContent, parentId);
      
      if (result.status === 201) {
        toast.success("Reply added successfully");
        setReplyContent("");
        setReplyingTo(null);
        refreshComments();
        router.refresh(); // Refresh the page to update comment count
      } else {
        toast.error(result.message || "Failed to add reply");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Comment = ({ comment, isReply = false }: { comment: CommentData; isReply?: boolean }) => (
    <div className={`${isReply ? "ml-12 mt-2" : "mt-4"}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.image || undefined} alt={comment.author.name || "User"} />
          <AvatarFallback>{getNameInitials(comment.author.name || "User")}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted p-3 rounded-lg">
            <div className="font-semibold text-sm">{comment.author.name}</div>
            <p className="text-sm mt-1">{comment.content}</p>
          </div>
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
            {!isReply && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto ml-2 text-xs"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                Reply
              </Button>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Replying...
                    </>
                  ) : (
                    "Reply"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-4">Comments</h3>
      
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || "User"} />
              <AvatarFallback>{getNameInitials(session.user?.name || "User")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Comment"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-lg mb-6 text-center">
          <p>Please sign in to comment</p>
        </div>
      )}
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => <Comment key={comment.id} comment={comment} />)
        )}
      </div>
    </div>
  );
}