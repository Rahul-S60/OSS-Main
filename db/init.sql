-- Auth.js Core Tables for PostgreSQL

CREATE TABLE IF NOT EXISTS "users" (
  "id" text NOT NULL,
  "name" text,
  "email" text,
  "emailVerified" timestamp,
  "image" text,
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "userId" text NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  PRIMARY KEY ("provider", "providerAccountId"),
  CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "sessionToken" text NOT NULL,
  "userId" text NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY ("sessionToken"),
  CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "verification_token" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- Application specific tables

CREATE TABLE IF NOT EXISTS "user_profiles" (
  "userId" text NOT NULL,
  "points" integer DEFAULT 0,
  "streak" integer DEFAULT 0,
  "github_username" text,
  "location" text,
  "languages" text[],
  PRIMARY KEY ("userId"),
  CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "issues" (
  "id" text NOT NULL,
  "title" text NOT NULL,
  "repository" text NOT NULL,
  "description" text NOT NULL,
  "difficulty" text NOT NULL,
  "estimatedEffort" text NOT NULL,
  "languages" text[],
  "technologies" text[],
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "contributions" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "issueId" text NOT NULL,
  "status" text NOT NULL, -- 'enrolled', 'pr_submitted', 'merged'
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "contributions_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "achievements" (
  "id" text NOT NULL,
  "userId" text NOT NULL,
  "badge_id" text NOT NULL,
  "unlocked_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
