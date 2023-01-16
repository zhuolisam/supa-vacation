// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from "next-auth/providers/google";

// Instantiate Prisma Client
import prisma from '@/lib/prisma';
import { sendVerificationRequest, sendWelcomeEmail } from '@/lib/emailHelper';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            maxAge: 10 * 60,
            sendVerificationRequest // Magic links are valid for 10 min only
        }),
    ],
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/',
        signOut: '/',
        error: '/',
        verifyRequest: '/',
    },
    events: {
        createUser: sendWelcomeEmail
    },
    // //configure callback to include user image in session
    // callbacks: {
    //     async session(session, user, token) {
    //         if (token) {
    //             session.token = token;
    //         }
    //         if (user?.image) {
    //             session.user.image = user.image;

    //         }
    //         return session;
    //     }
    // }
}

// pages/api/auth/[...nextauth].js
export default NextAuth(authOptions);