# JobPortal - Full-Featured Job Portal

A comprehensive job portal built with Next.js 15, TypeScript, and Tailwind CSS. This application provides a complete solution for job seekers and employers to connect and manage job opportunities.

## 🚀 Features

### For Job Seekers
- **Job Search & Discovery**: Advanced search with filters for location, job type, experience level, and more
- **Job Details**: Comprehensive job descriptions with company information
- **Application Management**: Track application status and manage submissions
- **User Profiles**: Create and manage professional profiles with skills, experience, and education
- **Application Tracking**: Real-time status updates and interview scheduling

### For Employers
- **Company Profiles**: Showcase company culture, benefits, and job opportunities
- **Job Posting**: Create and manage job listings
- **Application Review**: Review and manage incoming applications
- **Admin Dashboard**: Comprehensive management interface for all platform activities

### General Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Authentication**: Secure login and registration system
- **Search & Filters**: Advanced filtering and search capabilities
- **Real-time Updates**: Live status updates and notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Date Handling**: date-fns
- **Utilities**: clsx, tailwind-merge

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with hero section and featured jobs
│   ├── jobs/              # Job-related pages
│   │   ├── page.tsx       # Job listings with search and filters
│   │   └── [id]/page.tsx  # Individual job details and application form
│   ├── companies/         # Company pages
│   │   └── page.tsx       # Company listings and profiles
│   ├── applications/      # Application management
│   │   └── page.tsx       # User's application tracking
│   ├── profile/          # User profile management
│   │   └── page.tsx       # User profile editing
│   ├── login/            # Authentication
│   │   └── page.tsx       # Login page
│   ├── register/         # User registration
│   │   └── page.tsx       # Registration page
│   ├── admin/            # Admin dashboard
│   │   └── page.tsx       # Admin management interface
│   ├── layout.tsx        # Root layout with navigation
│   └── globals.css       # Global styles and utilities
├── components/           # Reusable React components
│   └── Navigation.tsx     # Main navigation component
├── lib/                  # Utility functions and types
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── contentstack.ts   # CMS integration (legacy)
└── package.json          # Dependencies and scripts
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with consistent spacing and typography
- **Responsive Layout**: Mobile-first approach with breakpoints for all screen sizes
- **Interactive Elements**: Hover effects, smooth transitions, and loading states
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support
- **Color Scheme**: Professional blue and gray color palette
- **Typography**: Inter font family for excellent readability

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Aryan_project_DND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Pages Overview

### Homepage (`/`)
- Hero section with job search
- Featured job listings
- Company showcase
- Statistics and call-to-action sections

### Jobs (`/jobs`)
- Advanced job search with filters
- Job listings with pagination
- Sort by relevance, date, or salary
- Quick apply functionality

### Job Details (`/jobs/[id]`)
- Comprehensive job information
- Company details and culture
- Application form with file upload
- Related jobs suggestions

### Companies (`/companies`)
- Company directory with search
- Company profiles and job listings
- Industry and size filters
- Company culture and benefits

### Applications (`/applications`)
- Application status tracking
- Interview scheduling
- Application history
- Status updates and notifications

### Profile (`/profile`)
- User profile management
- Skills and experience editing
- Education and work history
- Job preferences and settings

### Authentication (`/login`, `/register`)
- Secure login and registration
- Social login options
- Password strength validation
- Terms and conditions

### Admin Dashboard (`/admin`)
- Job management interface
- Application review system
- Company management
- User administration
- Analytics and reporting

## 🔧 Customization

### Styling
The application uses Tailwind CSS for styling. Custom styles are defined in `app/globals.css`:

- Custom utility classes
- Animation keyframes
- Gradient backgrounds
- Hover effects
- Responsive breakpoints

### Components
Reusable components are located in the `components/` directory:

- `Navigation.tsx` - Main navigation with responsive mobile menu
- Additional components can be added as needed

### Types
TypeScript types are defined in `lib/types.ts`:

- Job, Company, User, Application interfaces
- Search filters and result types
- Form data types
- API response types

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Environment Variables
Create a `.env.local` file for local development:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Set authorized redirect URIs to:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Copy the Client ID and Client Secret to your `.env.local` file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- The open-source community for inspiration and tools

---

**JobPortal** - Connecting talent with opportunity, one job at a time.