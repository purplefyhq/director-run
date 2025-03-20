import { trpc } from "@/trpc/server";
import { NextResponse } from "next/server";

export async function GET() {
  const resp = await trpc.health.ping();
  return NextResponse.json(resp);
}
