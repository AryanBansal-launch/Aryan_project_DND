import type { Metadata } from "next"; // Importing the Metadata type from Next.js
import "./globals.css"; // Importing global CSS styles
import Navigation from "@/components/Navigation"; // Importing the Navigation component
import { SessionProvider } from "@/components/SessionProvider"; // Importing the SessionProvider component
import { getNavigation } from "@/lib/contentstack"; // Import CMS function
import { ContentstackNavigation } from "@/lib/types"; // Import type

export const metadata: Metadata = {
  title: "JobPortal - Find Your Dream Job",
  description: "Discover thousands of job opportunities from top companies. Search, apply, and advance your career with our comprehensive job portal.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", type: "image/png" },
    ],
  },
};

// RootLayout component that wraps the entire application
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Type definition for children prop
}>) {
  // Fetch navigation content from CMS
  const navigationData = await getNavigation();

  return (
    <html lang="en">
      {/* Setting the language attribute for the HTML document */}
      <body className="min-h-screen bg-gray-50">
        <SessionProvider>
          <Navigation navigationData={navigationData as ContentstackNavigation | null} />
          <main className="min-h-screen">
            {children}
            <script src="https://chatbot-marketplace-try.contentstackapps.com/chatbot-widget.js?site_key=site-1763408244725-z9kudn" async></script>
          </main>
        </SessionProvider>
      </body>
      {/* Rendering the children components inside the body */}
    </html>
  );
}
