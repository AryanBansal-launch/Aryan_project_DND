import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { findUserByEmail, verifyPassword, findOrCreateOAuthUser } from "./users"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await findUserByEmail(credentials.email);

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, user, profile }) {
      // Handle Google OAuth sign in - save user to database
      if (account?.provider === "google") {
        try {
          const email = user.email || profile?.email;
          const name = user.name || profile?.name || 'Google User';
          
          if (!email) {
            console.error('[Auth] Google OAuth: No email provided');
            return false;
          }
          
          // Find or create the user in our database
          await findOrCreateOAuthUser(email, name, 'google');
          
          return true;
        } catch (error) {
          console.error('[Auth] Error saving Google user to database:', error);
          // Still allow sign in even if DB save fails (graceful degradation)
          return true;
        }
      }
      // Allow credentials sign in
      return true;
    },
    async redirect({ url, baseUrl }) {
      // If redirecting from OAuth callback, go to home
      if (url.includes("/api/auth/callback") || url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/`;
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // Invalid URL, default to home
        return `${baseUrl}/`;
      }
      return `${baseUrl}/`;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        
        if (user) {
          token.email = user.email || undefined;
          token.name = user.name || undefined;
          
          // For OAuth users, fetch the database user ID
          if (account.provider === 'google' && user.email) {
            try {
              const dbUser = await findUserByEmail(user.email);
              if (dbUser) {
                token.id = dbUser.id.toString();
              }
            } catch (error) {
              console.error('[Auth] Error fetching OAuth user ID:', error);
              token.id = user.id; // Fallback to OAuth provider ID
            }
          } else {
            token.id = user.id;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // Add error handling for JWT decryption failures
  events: {
    async signIn() {
      // Log sign in events
    },
    async signOut() {
      // Log sign out events
    },
  },
}

export default NextAuth(authOptions)
