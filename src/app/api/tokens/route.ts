import { NextResponse } from "next/server";

const SOROSWAP_API_URL = process.env.SOROSWAP_API_URL;
const SOROSWAP_API_KEY = process.env.SOROSWAP_API_KEY;

export async function GET() {
  if (!SOROSWAP_API_URL) {
    return NextResponse.json(
      { error: "SOROSWAP_API_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (SOROSWAP_API_KEY) {
      headers["Authorization"] = `Bearer ${SOROSWAP_API_KEY}`;
    }

    const response = await fetch(`${SOROSWAP_API_URL}/asset-list?name=all`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes on server
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Soroswap API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tokens from Soroswap:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
