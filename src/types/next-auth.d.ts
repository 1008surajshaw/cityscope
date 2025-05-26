import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    isVerified: boolean;
    onBoard: boolean;
    city?: string;
    country?: string;
    location?: string;
    image?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isVerified: boolean;
      image?: string;
      onBoard: boolean;
      city?: string;
      country?: string;
      location?: string;
    };
  }
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    isVerified?: boolean;
    onBoard?: boolean;
    city?: string;
    country?: string;
    location?: string;
  }
}
