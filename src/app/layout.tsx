import type { Metadata } from "next";
import { Comic_Neue, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Prashant Khatri · Platform Engineer",
    template: "Prashant Khatri · %s",
  },
  description:
    "Platform and OSS engineer based in Ahmedabad, India. 2× GSoC at Eclipse Foundation. Active in CNCF Score. Founder of DevCard.",
  keywords: [
    "Prashant Khatri",
    "Platform Engineer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "SRE",
    "CNCF Score Contributor",
    "Open Source Developer",
    "GSoC 2024",
    "GSoC 2025",
    "Eclipse Foundation",
    "DevCard Founder",
    "Go Developer",
    "Kubernetes",
    "Infrastructure Tooling"
  ],
  metadataBase: new URL("https://prashantkhatri.com"),
  alternates: { canonical: "/" },
  authors: [{ name: "Prashant Khatri" }],
  creator: "Prashant Khatri",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prashantkhatri.com",
    siteName: "Prashant Khatri",
    title: "Prashant Khatri · Platform Engineer & OSS Contributor",
    description:
      "Platform and OSS engineer. 2× GSoC. CNCF Score contributor. Founder of DevCard. Open to work.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Prashant Khatri · Platform Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prashant Khatri · Platform Engineer",
    description:
      "Platform and OSS engineer. 2× GSoC. CNCF Score contributor. Open to work.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${comicNeue.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {process.env.NEXT_PUBLIC_UMAMI_ID && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_URL || "https://analytics.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Prashant Khatri",
              url: "https://prashantkhatri.com",
              jobTitle: ["Platform Engineer", "DevOps Engineer"],
              worksFor: {
                "@type": "Organization",
                name: "Open Source Contributor (CNCF, Eclipse Foundation)"
              },
              sameAs: [
                "https://github.com/ShantKhatri",
                "https://www.linkedin.com/in/prashantkumar-khatri/",
                "https://rootcause.hashnode.dev"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans bg-[var(--bg)] text-[var(--fg)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Nav />
          <main className="max-w-[720px] mx-auto px-5">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
