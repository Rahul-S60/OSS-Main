import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 3600 }, // 1 hour session limit
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email repo",
          prompt: "consent",
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.username = profile.login;
        token.followers = profile.followers;
        token.public_repos = profile.public_repos;
        token.location = profile.location;
        
        // Fetch top languages from recent repos
        try {
          const reposRes = await fetch(`https://api.github.com/user/repos?sort=updated&per_page=10`, {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
              Accept: "application/vnd.github.v3+json",
            }
          });
          
          if (reposRes.ok) {
            const repos = await reposRes.json();
            const languageCounts: Record<string, number> = {};
            
            repos.forEach((repo: any) => {
              if (repo.language) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
              }
            });
            
            // Sort and take top 5
            const sortedLanguages = Object.entries(languageCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([lang]) => lang);
              
            token.languages = sortedLanguages.length > 0 ? sortedLanguages : ["JavaScript", "TypeScript", "React"];
          }
        } catch (error) {
          console.error("Failed to fetch GitHub repos for languages", error);
          token.languages = ["JavaScript", "TypeScript", "React"];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // @ts-expect-error
        session.user.id = token.sub;
        // @ts-expect-error
        session.user.username = token.username;
        // @ts-expect-error
        session.user.followers = token.followers;
        // @ts-expect-error
        session.user.public_repos = token.public_repos;
        // @ts-expect-error
        session.user.location = token.location;
        // @ts-expect-error
        session.user.languages = token.languages || ["JavaScript", "TypeScript", "React"];
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Create an empty profile for new users
      await prisma.userProfile.create({
        data: {
          userId: user.id as string,
          points: 0,
          streak: 0,
        },
      });
    },
  },
});
