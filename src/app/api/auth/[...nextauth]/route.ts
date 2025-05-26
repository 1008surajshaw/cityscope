import { authOptions } from '@/lib/authOptions';
import NextAuth from 'next-auth/next';

// Export the handler as GET and POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
