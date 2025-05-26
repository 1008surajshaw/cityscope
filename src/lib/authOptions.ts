
import prisma from '@/lib/prisma';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const AUTH_TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60; // 30 days

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Test Credentials",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }
        
        // Only allow specific test email
        if (credentials.email === "john@example.com") {
          // Fetch the test user from the database
          const user = await prisma.user.findFirst({
            where: {
              email: "john@example.com"
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
            }
          });
          
          if (user) {
            return {
              id: user.id,
              name: user.name || undefined,
              email: user.email,
              image: user.image || undefined,
              isVerified: user.isVerified,
              onBoard: user.onBoard,
              city: user.city || undefined,
              country: user.country || undefined,
              location: user.location || undefined,
            };
          }
        }
        
        return null;
      }
    }),
  ],
  callbacks: {

    async signIn(signInProps) {
      // console.log('signInProps', signInProps);
      let { user, account, profile } = signInProps;
      // console.log('user', user);
      // console.log('account', account);
      // console.log('profile', profile);
      if (account?.provider === 'google' ) {
         
        const { email, name, image: avatar } = user;
         if(!email || !name || !avatar) return false;
        let existingUser = await prisma.user.findFirst({
          where: {
            email : email ,
          }
        });
      //  console.log('existingUser', existingUser);
        if (!existingUser) {
          console.log('creating user');
          existingUser = await prisma.user.create({
            data: {
              email: email as string,
              name: name as string,
              image: avatar as string,
              isVerified: true,
              onBoard: false,
              city: null,
              country: null,
              location: null,
            },
          });
          console.log('created user', existingUser);
        }
      }

      return true;
    },

    async jwt(jwtProps) {
      const { token, user, trigger, session } = jwtProps;
      
      // For debugging
      console.log('token', token);
      console.log('trigger', trigger);
      
      // Handle session update
      if (trigger === 'update' && session) {
        return {
          ...token,
          ...session.user,
        };
      }
      
      // If we have a token but no user data yet, fetch from database
      if (token && token.email && (!token.id || token.id === undefined)) {
        try {
          const dbUser = await prisma.user.findFirst({
            where: {
              email: token.email as string,
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
          
          if (dbUser) {
            console.log('Found user in database:', dbUser);
            return {
              ...token,
              id: dbUser.id,
              isVerified: dbUser.isVerified,
              onBoard: dbUser.onBoard,
              city: dbUser.city,
              country: dbUser.country,
              location: dbUser.location,
            };
          }
        } catch (error) {
          console.error('Error fetching user from database:', error);
        }
      }
      
      // If we have user data from the sign-in process
      if (user) {
        try {
          const dbUser = await prisma.user.findFirst({
            where: {
              email: user.email as string,
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
          
          if (dbUser) {
            console.log('Found user in database during sign-in:', dbUser);
            return {
              ...token,
              id: dbUser.id,
              isVerified: dbUser.isVerified,
              onBoard: dbUser.onBoard,
              city: dbUser.city,
              country: dbUser.country,
              location: dbUser.location,
            };
          }
        } catch (error) {
          console.error('Error fetching user during sign-in:', error);
        }
      }
      
      return token;
    },

    session({ session, token }) {
      if (token && session && session.user) {
        // Add all the fields from token to session.user
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.onBoard = token.onBoard as boolean;
        session.user.city = token.city as string | undefined;
        session.user.country = token.country as string | undefined;
        session.user.location = token.location as string | undefined;
        
        console.log('Updated session with user data:', session);
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: AUTH_TOKEN_EXPIRATION_TIME,
  },
  jwt: {
    maxAge: AUTH_TOKEN_EXPIRATION_TIME,
  },
  pages: {
    signIn: '/',
  },
} satisfies NextAuthOptions;

