"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Code, Database, Server, Cloud, Shield, Zap, Layers, Globe } from "lucide-react";

export default function TRDClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/docs"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-full">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Technical Requirements Document</h1>
                <p className="text-blue-100 mt-1">JobDekho - AI-Powered Job Discovery Platform</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div><strong>Version:</strong> 2.0</div>
              <div><strong>Last Updated:</strong> January 2026</div>
              <div><strong>Author:</strong> Aryan Bansal</div>
              <div><strong>Status:</strong> Production Ready</div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-12">
            {/* System Architecture */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Server className="w-6 h-6 text-blue-600" />
                System Architecture
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Frontend Layer</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Next.js 15 (App Router)</li>
                    <li>• React 19 Components</li>
                    <li>• TypeScript 5.x</li>
                    <li>• Tailwind CSS 4</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Backend Layer</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Next.js API Routes</li>
                    <li>• Edge Functions</li>
                    <li>• NextAuth.js 4.24.5</li>
                    <li>• bcryptjs 3.0.3</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Data Layer</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Contentstack CMS</li>
                    <li>• NeonDB PostgreSQL</li>
                    <li>• Algolia Search</li>
                    <li>• Lytics Analytics</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Infrastructure</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Contentstack Launch</li>
                    <li>• Edge Deployment</li>
                    <li>• Global CDN</li>
                    <li>• Geolocation Headers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Technology Stack */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Code className="w-6 h-6 text-blue-600" />
                Technology Stack
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technology</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Next.js</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15.5.4</td>
                      <td className="px-6 py-4 text-sm text-gray-500">React framework with App Router</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">React</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">19.1.1</td>
                      <td className="px-6 py-4 text-sm text-gray-500">UI library</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TypeScript</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5.x</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Type-safe development</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tailwind CSS</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.x</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Utility-first styling</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">NextAuth.js</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.24.5</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Authentication</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">NeonDB</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.0.2</td>
                      <td className="px-6 py-4 text-sm text-gray-500">PostgreSQL database</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Database Schema */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-600" />
                Database Schema (NeonDB PostgreSQL)
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm text-gray-100 font-mono">
{`-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  auth_provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Skills Table
CREATE TABLE IF NOT EXISTS user_skills (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, skill)
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  job_id VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Contentstack Integration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Layers className="w-6 h-6 text-blue-600" />
                Contentstack Content Types
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: "Job", fields: "title, description, requirements, company (ref), location, type, salary, skills, category, status" },
                  { name: "Company", fields: "title, description, location, industry, size, logo, benefits" },
                  { name: "Blog Post", fields: "title, slug, content, author, featured_image, category, tags" },
                  { name: "Homepage", fields: "hero_title, hero_subtitle, featured_jobs, stats" },
                  { name: "Navigation", fields: "nav_items (links array)" },
                  { name: "Notification", fields: "user_email, type, title, message, read, metadata" },
                  { name: "Personalized Banner", fields: "banner_title, banner_message, cta_text, cta_link, user_segment" },
                  { name: "Learning Resource", fields: "title, slug, technology, difficulty_level, youtube_url, skills_covered" },
                ].map((ct, index) => (
                  <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">{ct.name}</h3>
                    <p className="text-sm text-gray-600">{ct.fields}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Third-Party Integrations */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Cloud className="w-6 h-6 text-blue-600" />
                Third-Party Integrations
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Algolia Search</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Full-text search</li>
                    <li>• Fuzzy matching</li>
                    <li>• Typo tolerance</li>
                    <li>• Instant results</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Lytics Analytics</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Behavior tracking</li>
                    <li>• User segmentation</li>
                    <li>• Event analytics</li>
                    <li>• Audience building</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Contentstack Launch</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Edge hosting</li>
                    <li>• Geolocation headers</li>
                    <li>• Global CDN</li>
                    <li>• Auto deployment</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Security Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                Security Requirements
              </h2>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-red-900 mb-3">Authentication</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>✓ Password hashing with bcrypt (cost factor 12)</li>
                      <li>✓ JWT session tokens via NextAuth.js</li>
                      <li>✓ HTTP-only cookies</li>
                      <li>✓ Google OAuth integration</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-3">API Security</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>✓ Webhook secret verification</li>
                      <li>✓ Admin panel protection (Edge middleware)</li>
                      <li>✓ SQL injection prevention</li>
                      <li>✓ XSS prevention with DOMPurify</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Performance Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-600" />
                Performance Requirements
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-900 mb-1">&lt; 2s</div>
                  <div className="text-sm text-gray-600">Page Load Time</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-900 mb-1">&lt; 100ms</div>
                  <div className="text-sm text-gray-600">Search Response</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-900 mb-1">&lt; 500ms</div>
                  <div className="text-sm text-gray-600">API Response</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-900 mb-1">&gt; 99.9%</div>
                  <div className="text-sm text-gray-600">Uptime SLA</div>
                </div>
              </div>
            </section>

            {/* Deployment Architecture */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                Deployment Architecture
              </h2>

              <div className="bg-gradient-to-br from-slate-900 to-gray-900 text-white rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Contentstack Launch</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-300 mb-2">Build Configuration</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Build Command: <code className="bg-white/10 px-2 py-0.5 rounded">npm run build</code></li>
                      <li>• Start Command: <code className="bg-white/10 px-2 py-0.5 rounded">npm start</code></li>
                      <li>• Node Version: 18+</li>
                      <li>• Auto-deploy on git push</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-300 mb-2">Edge Functions</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Geolocation headers injection</li>
                      <li>• Top paths analytics</li>
                      <li>• Edge middleware for auth</li>
                      <li>• Global CDN distribution</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
