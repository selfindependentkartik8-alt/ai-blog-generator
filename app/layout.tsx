import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://aibloggenerator.krishaiworks.com"),

  title: "AI Blog Generator | Create High-Quality Blog Posts",
  description:
    "Generate high-quality, engaging blog posts with AI in seconds. Create SEO-friendly blog content with KrishAIWorks AI Blog Generator.",

  keywords: [
    "AI Blog Generator",
    "AI Blog Writer",
    "Blog Post Generator",
    "AI Content Generator",
    "AI Writing Tool",
    "SEO Blog Generator",
    "Blog Writing AI",
    "AI Content Writer",
  ],

  authors: [
    {
      name: "KrishAIWorks",
      url: "https://krishaiworks.vercel.app",
    },
  ],

  creator: "KrishAIWorks",
  publisher: "KrishAIWorks",

  alternates: {
    canonical: "https://aibloggenerator.krishaiworks.com/",
  },

  openGraph: {
    title: "AI Blog Generator | KrishAIWorks",
    description:
      "Create high-quality, engaging and SEO-friendly blog posts with AI in seconds.",
    url: "https://aibloggenerator.krishaiworks.com/",
    siteName: "KrishAIWorks",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Blog Generator | KrishAIWorks",
    description:
      "Generate engaging and SEO-friendly blog posts with AI in seconds.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BS6TSMM1ZR"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BS6TSMM1ZR');
          `}
        </Script>
      </body>
    </html>
  );
}