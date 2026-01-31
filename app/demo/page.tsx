import { getDemoVideo } from "@/lib/contentstack";
import { ContentstackDemoVideo } from "@/lib/types";
import { cookies } from "next/headers";
import DemoClient from "./DemoClient";
import PasswordFormWrapper from "./PasswordFormWrapper";

export default async function DemoPage() {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("demo_authenticated")?.value === "true";

  // If not authenticated, show password form
  if (!isAuthenticated) {
    return <PasswordFormWrapper />;
  }

  // Fetch demo video from Contentstack
  const demoVideo = await getDemoVideo() as ContentstackDemoVideo | null;

  // Fallback if no demo video content
  if (!demoVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Video Not Available</h1>
          <p className="text-gray-600 mb-4">
            The demo video content has not been set up in Contentstack yet.
          </p>
          <div className="bg-gray-100 rounded-lg p-6 text-left">
            <h2 className="font-semibold mb-2">To set up the demo video:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Go to your Contentstack dashboard</li>
              <li>Create a content type called <code className="bg-white px-2 py-1 rounded">demo_video</code></li>
              <li>Add the following fields:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><code className="bg-white px-1 rounded">title</code> (Single Line Textbox)</li>
                  <li><code className="bg-white px-1 rounded">description</code> (Multi-line Textbox, optional)</li>
                  <li><code className="bg-white px-1 rounded">video</code> (File field - supports video files)</li>
                  <li><code className="bg-white px-1 rounded">thumbnail</code> (File field - image, optional)</li>
                  <li><code className="bg-white px-1 rounded">duration</code> (Single Line Textbox, optional)</li>
                </ul>
              </li>
              <li>Create an entry and upload your demo video</li>
              <li>Publish the entry</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return <DemoClient demoVideo={demoVideo} />;
}

