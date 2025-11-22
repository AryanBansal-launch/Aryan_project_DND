import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Validate NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️  NEXTAUTH_SECRET is not set. Authentication may not work correctly.');
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
