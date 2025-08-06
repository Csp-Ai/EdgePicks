import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import '../../../lib/env';

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
const nextAuthSecret = process.env.NEXTAUTH_SECRET!;

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  secret: nextAuthSecret,
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
