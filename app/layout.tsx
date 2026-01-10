import type { Metadata } from "next"; // Importing the Metadata type from Next.js
import Script from "next/script"; // Importing Script component for external scripts
import "./globals.css"; // Importing global CSS styles
import Navigation from "@/components/Navigation"; // Importing the Navigation component
import { SessionProvider } from "@/components/SessionProvider"; // Importing the SessionProvider component
import PersonalizedBanner from "@/components/PersonalizedBanner"; // Importing the PersonalizedBanner component
import BehaviorTracker from "@/components/BehaviorTracker"; // Importing BehaviorTracker for personalization
import SkillGapBanner from "@/components/SkillGapBanner"; // Importing SkillGapBanner for skill gap notifications
import WelcomePopup from "@/components/WelcomePopup"; // Importing WelcomePopup for first-time visitors
import { getNavigation, getPersonalizedBanner } from "@/lib/contentstack"; // Import CMS functions
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
  
  // Fetch personalized banner content from Contentstack
  // Note: For advanced personalization with user context (time on site, behavior),
  // you may want to fetch this client-side via an API route that includes user context
  // For now, we fetch the default banner which can be personalized via Contentstack segments
  const bannerData = await getPersonalizedBanner();

  return (
    <html lang="en">
      {/* Setting the language attribute for the HTML document */}
      <body className="min-h-screen bg-gray-50">
        {/* Lytics Tracking Tag Version 3 - Enabled for behavior tracking */}
        <Script
          id="lytics-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(){"use strict";var o=window.jstag||(window.jstag={}),r=[];function n(e){o[e]=function(){for(var n=arguments.length,t=new Array(n),i=0;i<n;i++)t[i]=arguments[i];r.push([e,t])}}n("send"),n("mock"),n("identify"),n("pageView"),n("unblock"),n("getid"),n("setid"),n("loadEntity"),n("getEntity"),n("on"),n("once"),n("call"),o.loadScript=function(n,t,i){var e=document.createElement("script");e.async=!0,e.src=n,e.onload=t,e.onerror=i;var o=document.getElementsByTagName("script")[0],r=o&&o.parentNode||document.head||document.body,c=o||r.lastChild;return null!=c?r.insertBefore(e,c):r.appendChild(e),this},o.init=function n(t){return this.config=t,this.loadScript(t.src,function(){if(o.init===n)throw new Error("Load error!");o.init(o.config),function(){for(var n=0;n<r.length;n++){var t=r[n][0],i=r[n][1];o[t].apply(o,i)}r=void 0}()}),this}}();
              // Define config and initialize Lytics tracking tag.
              jstag.init({
                src: 'https://c.lytics.io/api/tag/acc87699b8b647fbefb4e86ae8e9d84a/latest.min.js'
              });
              // Track page view on load
              jstag.pageView();
              console.log('📊 Lytics: Tracking initialized');
            `,
          }}
        />
        {/* Behavior Tracker for personalization */}
        <BehaviorTracker />
        <SessionProvider>
          <Navigation navigationData={navigationData as ContentstackNavigation | null} />
          <SkillGapBanner />
          <WelcomePopup />
          <main className="min-h-screen">
            {children}
            <script src="https://chatbot-marketplace-try.contentstackapps.com/chatbot-widget.js?site_key=site-1763408244725-z9kudn" async></script>
          </main>
          <PersonalizedBanner contentstackData={bannerData as any} />
        </SessionProvider>
      </body>
      {/* Rendering the children components inside the body */}
    </html>
  );
}
