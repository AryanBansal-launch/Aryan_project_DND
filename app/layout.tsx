import type { Metadata } from "next"; // Importing the Metadata type from Next.js
import "./globals.css"; // Importing global CSS styles
import Navigation from "@/components/Navigation"; // Importing the Navigation component
import { SessionProvider } from "@/components/SessionProvider"; // Importing the SessionProvider component

export const metadata: Metadata = {
  title: "JobPortal - Find Your Dream Job",
  description: "Discover thousands of job opportunities from top companies. Search, apply, and advance your career with our comprehensive job portal.",
};

// RootLayout component that wraps the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Type definition for children prop
}>) {
  return (
    <html lang="en">
      {/* Setting the language attribute for the HTML document */}
      <body className="min-h-screen bg-gray-50">
        <SessionProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </SessionProvider>
      </body>
      {/* Rendering the children components inside the body */}
    </html>
  );
}
