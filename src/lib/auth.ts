import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("Utilisateur non trouvé");

        const isValid = await bcrypt.compare(credentials?.password as string, user.password);
        if (!isValid) throw new Error("Mot de passe incorrect");

        return { id: user._id.toString(), email: user.email, role: user.role };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string; // التعديل هنا
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});