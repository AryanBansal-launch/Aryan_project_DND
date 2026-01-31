"use client";

import { ContentstackDemoVideo, File } from "@/lib/types";
import { Play, Clock } from "lucide-react";
import { useState } from "react";

interface DemoClientProps {
  demoVideo: ContentstackDemoVideo;
}

export default function DemoClient({ demoVideo }: DemoClientProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Get video URL from Contentstack file object
  const videoUrl = demoVideo.video?.url || null;
  const thumbnailUrl = demoVideo.thumbnail?.url || null;
  const title = demoVideo.title || "Demo Video";
  const description = demoVideo.description || "";
  const duration = demoVideo.duration || "";

  if (!videoUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video Not Available</h1>
          <p className="text-gray-600">
            The video file has not been uploaded to Contentstack yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
          )}
        </div>

        {/* Video Player Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="relative aspect-video bg-black">
            {!isPlaying ? (
              // Thumbnail/Poster with Play Button
              <div className="relative w-full h-full">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-20 h-20 mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-medium">Click to play demo video</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all group"
                  aria-label="Play video"
                >
                  <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-12 h-12 text-indigo-600 ml-1" fill="currentColor" />
                  </div>
                </button>
                {duration && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{duration}</span>
                  </div>
                )}
              </div>
            ) : (
              // Video Player
              <video
                controls
                autoPlay
                className="w-full h-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Demo</h2>
          <div className="prose prose-gray max-w-none">
            {description ? (
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
            ) : (
              <p className="text-gray-500 italic">
                This is a demonstration video showcasing the features and functionality of the application.
              </p>
            )}
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Video hosted on Contentstack CDN</p>
        </div>
      </div>
    </div>
  );
}

