import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Providers } from "@/providers";
import MainLayout from "@/components/Layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellar Tools",
  description:
    "Explore Stellar Tools, the comprehensive toolkit designed to simplify asset management, NFT creation, and more on the Stellar and Soroban ecosystems. Manage your Stellar assets with ease and dive into the world of Soroban smart contracts.",
  icons: "/stellartools.svg",
  keywords: [
    "stellar",
    "tools",
    "soroban",
    "ecosystem",
    "asset management",
    "NFT minting",
    "Stellar blockchain tools",
    "Soroban smart contracts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Analytics />
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
