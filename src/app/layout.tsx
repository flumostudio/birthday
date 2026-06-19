import type { Metadata } from "next";
import { Cormorant_Garamond, Dancing_Script, Caveat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Selamat Ulang Tahun, Sayangku — Surat Spesial Untukmu",
  description: "Surat ulang tahun romantis dan kenangan keluarga berharga untuk istri dan ibu tercinta.",
  authors: [{ name: "Keluarga Tercinta" }],
  openGraph: {
    title: "Selamat Ulang Tahun, Sayangku — Surat Spesial Untukmu",
    description: "Surat ulang tahun romantis dan kenangan keluarga berharga.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dancing.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
