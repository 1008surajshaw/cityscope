'use server';

import { authOptions } from "@/lib/authOptions";
import { ErrorHandler } from "@/lib/error";
import prisma from "@/lib/prisma";
import { SuccessResponse } from "@/lib/success";
import { ServerActionReturnType } from "@/types/api.types";
import { getServerSession } from "next-auth";

interface UpdateUserProfileParams {
  city?: string;
  country?: string;
  location?: string;
  onBoard?: boolean;
}

export const updateUserProfile = async (
  params: UpdateUserProfileParams
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new ErrorHandler('Not Authorized', 'UNAUTHORIZED');
    }

    const userId = session.user.id;
    
    console.log(params, "params");
    console.log(userId, "userId");

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        city: params.city,
        country: params.country,
        location: params.location,
        onBoard: params.onBoard,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isVerified: true,
        onBoard: true,
        city: true,
        country: true,
        location: true,
      },
    });
     console.log(updatedUser, "updatedUser");
     return {
      status: 200,
      message: 'Profile updated successfully',
      data: updatedUser
    };
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return new ErrorHandler('Failed to update profile', 'INTERNAL_SERVER_ERROR');
  }
};