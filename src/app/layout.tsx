import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Generator - Create Professional Portfolios in Minutes",
  description:
    "Create stunning, professional portfolios with our easy-to-use generator. No coding required. Choose from beautiful templates, customize instantly, and download ready-to-use portfolios.",
  keywords: [
    "portfolio generator",
    "professional portfolio",
    "portfolio builder",
    "resume builder",
    "cv generator",
    "portfolio templates",
    "web portfolio",
    "online portfolio",
    "portfolio creator",
    "free portfolio",
    "responsive portfolio",
    "portfolio website",
  ],
  authors: [{ name: "Portfolio Generator Team" }],
  creator: "Portfolio Generator",
  publisher: "Portfolio Generator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-generator.com",
    title: "Portfolio Generator - Create Professional Portfolios in Minutes",
    description:
      "Create stunning, professional portfolios with our easy-to-use generator. No coding required. Choose from beautiful templates, customize instantly, and download ready-to-use portfolios.",
    siteName: "Portfolio Generator",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio Generator - Create Professional Portfolios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Generator - Create Professional Portfolios in Minutes",
    description:
      "Create stunning, professional portfolios with our easy-to-use generator. No coding required.",
    images: ["/og-image.jpg"],
    creator: "@portfoliogen",
  },
  alternates: {
    canonical: "https://portfolio-generator.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
          <QueryProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
