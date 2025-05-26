'use server';
import {  PostType } from "@/interface/post.interface";
import { authOptions } from "@/lib/authOptions";
import { uploadImage } from "@/lib/cloudinary";
import { ErrorHandler } from "@/lib/error";
import prisma from "@/lib/prisma";
import { withSession } from "@/lib/session";
import { SuccessResponse } from "@/lib/success";
import { ServerActionReturnType } from "@/types/api.types";
import { PostSchemaType } from "@/validators/post.validators";
import { getServerSession } from "next-auth";

export const getAllPosts = async () => {
  try {
    
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
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


    // Convert null to undefined for image fields to match PostType
    const typedPosts: PostType[] = posts.map(post => ({
      ...post,
      image: post.image || undefined,
      author: {
        ...post.author,
        image: post.author.image || undefined,
        name: post.author.name || ''
      }
    }));

    const totalpost = await prisma.post.count();
   
    return {
      status: 200,
      message: 'All posts fetched successfully',
      data: {
        post: typedPosts,
        totalpost
      }
    };
  } catch (error) {
    return {
      status: 404,
      message: (error as Error).message,
      data: null
    };
  }
};

export const GetCommentedPostID = async (): Promise<{
  status: number;
  message: string;
  data: { postId: string; content: string }[] | null;
}> => {
  try {
    const auth = await getServerSession();

    console.log(auth,"auth");

    if (!auth || !auth?.user?.id)
      throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');

    const userId = auth.user.id;

    const comments = await prisma.comment.findMany({
      where: {
        authorId: userId,
      },
      select: {
        postId: true,
        content: true,
      },
    });

    if (!comments.length) {
      return {
        status: 200,
        message: 'No commented posts found',
        data: [],
      };
    }

    return {
      status: 200,
      message: 'Commented posts fetched successfully',
      data: comments,
    };
  } catch (error) {
    return {
      status: 404,
      message: (error as Error).message,
      data: null,
    };
  }
};

export const GetLikedPostID = async () => {
  try {
    console.log("GetLikedPostID");
    const auth = await getServerSession(authOptions);

    console.log(auth,"auth");

    if (!auth || !auth?.user?.id)
      throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');

    const userId = auth.user.id;
    console.log(userId,"userId");
    const likes = await prisma.like.findMany({
      where: {
        authorId: userId,
      },
      select: {
        postId: true,
      },
    });

    if (!likes.length) {
      return {
        status: 200,
        message: 'No liked posts found',
        data: [],
      };
    }

    return {
      status: 200,
      message: 'Liked posts fetched successfully',
      data: likes,
    };
  } catch (error) {
    return {
      status: 404,
      message: (error as Error).message,
      data: null,
    };
  }
};

  
export const createPost = async (formData: FormData) => {
  try {
    console.log("GetCommentedPostID");
    const auth = await getServerSession(authOptions);

    console.log(auth,"auth");

    if (!auth || !auth?.user?.id)
      throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');

    const userId = auth.user.id;

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    console.log(title, "title");
    console.log(content, "content");
    console.log(imageFile, "imageFile");

    // Validate content is not empty
    if (!content.trim()) {
      throw new ErrorHandler('Post content cannot be empty', 'BAD_REQUEST');
    }

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      // Convert file to base64 string for Cloudinary upload
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
      
      // Upload to Cloudinary
      imageUrl = await uploadImage(base64Image);
      
      if (!imageUrl) {
        throw new ErrorHandler('Failed to upload image', 'INTERNAL_SERVER_ERROR');
      }
    }
    console.log(imageUrl, "imageUrl");
    console.log(userId, "userId");

    // Create post in database
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: imageUrl,
        authorId: userId, // This should be the MongoDB ObjectID
      },
    });

    return {
      status: 201,
      message: 'Post created successfully',
      data: post
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      status: 500,
      message: error instanceof ErrorHandler ? error.message : 'Failed to create post',
      data: null
    };
  }
};


export const toggleLike = async (postId: string) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');
    }

    const userId = session.user.id;
    
    // Check if user already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        authorId: userId,
        postId: postId,
      },
    });

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      
      await prisma.post.update({
        where: { id: postId },
        data: { totalLikes: { decrement: 1 } },
      });

      return {
        status: 200,
        message: 'Post unliked successfully',
        data: { liked: false }
      };
    } else {
      await prisma.like.create({
        data: {
          authorId: userId,
          postId: postId,
        },
      });
      
      await prisma.post.update({
        where: { id: postId },
        data: { totalLikes: { increment: 1 } },
      });

      return {
        status: 200,
        message: 'Post liked successfully',
        data: { liked: true }
      };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      status: 500,
      message: error instanceof ErrorHandler ? error.message : 'Failed to update like',
      data: null
    };
  }
};


export const createComment = async (
  postId: string,
  content: string,
  parentId?: string
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');
    }

    const userId = session.user.id;

    // Validate content is not empty
    if (!content.trim()) {
      throw new ErrorHandler('Comment cannot be empty', 'BAD_REQUEST');
    }

    // Create comment in database
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Increment post's totalComments
    await prisma.post.update({
      where: { id: postId },
      data: { totalComments: { increment: 1 } },
    });

    return {
      status: 201,
      message: 'Comment added successfully',
      data: comment
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return {
      status: 500,
      message: error instanceof ErrorHandler ? error.message : 'Failed to add comment',
      data: null
    };
  }
};

export const getPostComments = async (postId: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Get only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: 200,
      message: 'Comments fetched successfully',
      data: comments
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      status: 500,
      message: error instanceof ErrorHandler ? error.message : 'Failed to fetch comments',
      data: null
    };
  }
};