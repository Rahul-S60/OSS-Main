import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Lightweight database connectivity check
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch {
    // Return 503 without exposing credentials, connection strings, or stack traces
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
      },
      { status: 503 }
    );
  }
}
