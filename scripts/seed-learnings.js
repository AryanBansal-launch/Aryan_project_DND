/**
 * Script to seed learning resource entries to Contentstack
 * Run: node scripts/seed-learnings.js
 * 
 * This seeds curated YouTube tutorials for various technologies
 */

const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

// ⚠️ CONFIGURE THESE VALUES
const CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  MANAGEMENT_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN,
  ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  REGION: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION,
  CONTENT_TYPE_UID: 'learning_resource',
};

// Base URL based on region
const BASE_URLS = {
  us: 'api.contentstack.io',
  eu: 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com'
};

const BASE_URL = BASE_URLS[CONFIG.REGION] || BASE_URLS.us;

// Sample learning resource data (20 tutorials)
const learnings = [
  // Next.js Tutorials
  {
    title: "Next.js 14 Full Course 2024 - Build & Deploy a Full Stack App",
    slug: "nextjs-14-full-course-2024",
    description: "Master Next.js 14 from scratch in this comprehensive course. You'll build a full-stack application with App Router, Server Components, and API Routes. By the end, you'll confidently deploy production-ready Next.js apps. Perfect for React developers ready to level up!",
    technology: "nextjs",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
    youtube_video_id: "wm5gMKuwSYk",
    duration: "5:15:30",
    key_takeaways: [
      "Build full-stack applications with Next.js 14 App Router",
      "Implement Server Components and Server Actions",
      "Create dynamic routes and API endpoints",
      "Deploy to production with Vercel",
      "Handle authentication and database integration"
    ],
    skills_covered: ["Next.js", "React", "TypeScript", "App Router", "Server Components"],
    instructor: "JavaScript Mastery",
    featured: true,
    order: 1
  },
  {
    title: "Next.js App Router: Complete Beginner's Guide",
    slug: "nextjs-app-router-beginners-guide",
    description: "Get started with Next.js App Router in this beginner-friendly tutorial. Learn the fundamentals of file-based routing, layouts, and data fetching. You'll build your first Next.js application step by step. Ideal for developers new to Next.js!",
    technology: "nextjs",
    difficulty_level: "beginner",
    youtube_url: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA",
    youtube_video_id: "ZVnjOPwW4ZA",
    duration: "1:04:35",
    key_takeaways: [
      "Understand Next.js file-based routing system",
      "Create layouts and nested routes",
      "Fetch data in Server Components",
      "Handle loading and error states",
      "Build a complete starter project"
    ],
    skills_covered: ["Next.js", "React", "Routing", "Layouts"],
    instructor: "Traversy Media",
    featured: false,
    order: 2
  },

  // React Tutorials
  {
    title: "React 18 Tutorial - Full Course for Beginners",
    slug: "react-18-full-course-beginners",
    description: "Learn React 18 from the ground up in this comprehensive beginner course. Cover hooks, state management, and component patterns. You'll build real projects while mastering modern React development. The perfect starting point for your React journey!",
    technology: "react",
    difficulty_level: "beginner",
    youtube_url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    youtube_video_id: "bMknfKXIFA8",
    duration: "11:55:27",
    key_takeaways: [
      "Understand React fundamentals and JSX",
      "Master React Hooks (useState, useEffect, useContext)",
      "Build reusable component patterns",
      "Handle forms and user input",
      "Work with APIs and async data"
    ],
    skills_covered: ["React", "JavaScript", "Hooks", "Components", "State Management"],
    instructor: "freeCodeCamp",
    featured: true,
    order: 3
  },
  {
    title: "Advanced React Patterns - Build Like a Pro",
    slug: "advanced-react-patterns",
    description: "Take your React skills to the next level with advanced patterns and techniques. Learn compound components, render props, and custom hooks. These patterns are used by top companies to build scalable applications. For experienced React developers!",
    technology: "react",
    difficulty_level: "advanced",
    youtube_url: "https://www.youtube.com/watch?v=MdvzlDIdQ0o",
    youtube_video_id: "MdvzlDIdQ0o",
    duration: "2:15:00",
    key_takeaways: [
      "Implement compound component patterns",
      "Create flexible render props",
      "Build powerful custom hooks",
      "Optimize performance with memoization",
      "Apply patterns from production codebases"
    ],
    skills_covered: ["React", "Design Patterns", "Performance", "Custom Hooks"],
    instructor: "Jack Herrington",
    featured: false,
    order: 4
  },

  // TypeScript Tutorials
  {
    title: "TypeScript Full Course - Zero to Hero",
    slug: "typescript-full-course-zero-to-hero",
    description: "Master TypeScript from basics to advanced concepts in this complete course. Learn types, interfaces, generics, and best practices. You'll write safer, more maintainable code with confidence. Essential for modern web development!",
    technology: "typescript",
    difficulty_level: "beginner",
    youtube_url: "https://www.youtube.com/watch?v=30LWjhZzg50",
    youtube_video_id: "30LWjhZzg50",
    duration: "5:00:32",
    key_takeaways: [
      "Understand TypeScript fundamentals and setup",
      "Work with types, interfaces, and type aliases",
      "Master generics for reusable code",
      "Handle advanced types and utility types",
      "Integrate TypeScript with React projects"
    ],
    skills_covered: ["TypeScript", "JavaScript", "Static Typing", "Generics"],
    instructor: "Academind",
    featured: true,
    order: 5
  },

  // Node.js Tutorials
  {
    title: "Node.js and Express.js Full Course",
    slug: "nodejs-express-full-course",
    description: "Build backend applications with Node.js and Express in this hands-on course. Create REST APIs, handle authentication, and connect to databases. You'll deploy a production-ready backend by the end. Perfect for frontend developers going full-stack!",
    technology: "nodejs",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    youtube_video_id: "Oe421EPjeBE",
    duration: "8:16:47",
    key_takeaways: [
      "Build REST APIs with Express.js",
      "Implement authentication and authorization",
      "Connect to MongoDB and PostgreSQL",
      "Handle middleware and error handling",
      "Deploy to cloud platforms"
    ],
    skills_covered: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Authentication"],
    instructor: "freeCodeCamp",
    featured: false,
    order: 6
  },

  // Docker Tutorials
  {
    title: "Docker Crash Course for Absolute Beginners",
    slug: "docker-crash-course-beginners",
    description: "Get started with Docker containers in this beginner-friendly crash course. Learn to containerize applications and use Docker Compose. You'll understand containerization fundamentals in under 2 hours. Essential for modern DevOps!",
    technology: "docker",
    difficulty_level: "beginner",
    youtube_url: "https://www.youtube.com/watch?v=pg19Z8LL06w",
    youtube_video_id: "pg19Z8LL06w",
    duration: "1:46:30",
    key_takeaways: [
      "Understand containers vs virtual machines",
      "Build and run Docker images",
      "Write effective Dockerfiles",
      "Use Docker Compose for multi-container apps",
      "Push images to Docker Hub"
    ],
    skills_covered: ["Docker", "Containers", "Docker Compose", "DevOps"],
    instructor: "TechWorld with Nana",
    featured: true,
    order: 7
  },
  {
    title: "Docker for DevOps Engineers - Complete Course",
    slug: "docker-devops-complete-course",
    description: "Deep dive into Docker for production environments. Learn networking, volumes, security best practices, and orchestration basics. You'll manage containers like a DevOps pro. For developers ready to master Docker!",
    technology: "docker",
    difficulty_level: "advanced",
    youtube_url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
    youtube_video_id: "3c-iBn73dDE",
    duration: "3:21:45",
    key_takeaways: [
      "Configure Docker networking and volumes",
      "Implement container security practices",
      "Optimize Docker images for production",
      "Set up CI/CD with Docker",
      "Introduction to container orchestration"
    ],
    skills_covered: ["Docker", "Networking", "Security", "CI/CD", "DevOps"],
    instructor: "TechWorld with Nana",
    featured: false,
    order: 8
  },

  // Kubernetes Tutorials
  {
    title: "Kubernetes Tutorial for Beginners",
    slug: "kubernetes-tutorial-beginners",
    description: "Learn Kubernetes fundamentals in this comprehensive beginner tutorial. Understand pods, deployments, services, and kubectl commands. You'll orchestrate containers confidently after this course. The gateway to cloud-native development!",
    technology: "kubernetes",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=X48VuDVv0do",
    youtube_video_id: "X48VuDVv0do",
    duration: "3:36:52",
    key_takeaways: [
      "Understand Kubernetes architecture",
      "Work with pods, deployments, and services",
      "Use kubectl for cluster management",
      "Configure ConfigMaps and Secrets",
      "Deploy applications to Kubernetes"
    ],
    skills_covered: ["Kubernetes", "Container Orchestration", "kubectl", "Cloud Native"],
    instructor: "TechWorld with Nana",
    featured: true,
    order: 9
  },

  // AWS Tutorials
  {
    title: "AWS Certified Cloud Practitioner - Full Course",
    slug: "aws-cloud-practitioner-full-course",
    description: "Prepare for AWS Cloud Practitioner certification with this complete course. Learn core AWS services, pricing, and best practices. You'll understand cloud computing fundamentals thoroughly. Great for starting your cloud career!",
    technology: "aws",
    difficulty_level: "beginner",
    youtube_url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    youtube_video_id: "SOTamWNgDKc",
    duration: "13:19:51",
    key_takeaways: [
      "Understand AWS global infrastructure",
      "Learn core services (EC2, S3, RDS, Lambda)",
      "Master AWS pricing and billing",
      "Implement security best practices",
      "Pass the Cloud Practitioner exam"
    ],
    skills_covered: ["AWS", "Cloud Computing", "EC2", "S3", "Lambda"],
    instructor: "freeCodeCamp",
    featured: false,
    order: 10
  },

  // Python Tutorials
  {
    title: "Python for Beginners - Full Course",
    slug: "python-beginners-full-course",
    description: "Start your Python journey with this comprehensive beginner course. Learn syntax, data structures, functions, and OOP concepts. You'll write Python programs confidently by the end. The most popular programming language awaits!",
    technology: "python",
    difficulty_level: "beginner",
    youtube_url: "https://www.youtube.com/watch?v=eWRfhZUzrAc",
    youtube_video_id: "eWRfhZUzrAc",
    duration: "4:26:52",
    key_takeaways: [
      "Master Python syntax and fundamentals",
      "Work with data structures (lists, dicts, sets)",
      "Write functions and handle errors",
      "Understand object-oriented programming",
      "Build practical Python projects"
    ],
    skills_covered: ["Python", "Programming Fundamentals", "OOP", "Data Structures"],
    instructor: "freeCodeCamp",
    featured: true,
    order: 11
  },

  // Microservices Tutorials
  {
    title: "Microservices Architecture - Complete Guide",
    slug: "microservices-architecture-complete-guide",
    description: "Understand microservices architecture patterns and best practices. Learn service decomposition, communication, and deployment strategies. You'll design scalable distributed systems. Essential for senior developers and architects!",
    technology: "microservices",
    difficulty_level: "advanced",
    youtube_url: "https://www.youtube.com/watch?v=lTAcCNbJ7KE",
    youtube_video_id: "lTAcCNbJ7KE",
    duration: "2:08:35",
    key_takeaways: [
      "Design microservices from monoliths",
      "Implement service-to-service communication",
      "Handle distributed data management",
      "Set up API gateways and service mesh",
      "Deploy with containers and orchestration"
    ],
    skills_covered: ["Microservices", "System Design", "API Gateway", "Distributed Systems"],
    instructor: "ByteByteGo",
    featured: true,
    order: 12
  },

  // DevOps Tutorials
  {
    title: "DevOps CI/CD Pipeline Tutorial",
    slug: "devops-cicd-pipeline-tutorial",
    description: "Build automated CI/CD pipelines from scratch. Learn Jenkins, GitHub Actions, and deployment automation. You'll ship code faster and more reliably. Critical skills for modern development teams!",
    technology: "devops",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=scEDHsr3APg",
    youtube_video_id: "scEDHsr3APg",
    duration: "2:32:17",
    key_takeaways: [
      "Set up CI/CD pipelines with GitHub Actions",
      "Configure automated testing and linting",
      "Implement deployment automation",
      "Handle environment configurations",
      "Monitor pipeline performance"
    ],
    skills_covered: ["CI/CD", "GitHub Actions", "Jenkins", "Automation", "DevOps"],
    instructor: "TechWorld with Nana",
    featured: false,
    order: 13
  },

  // AI/ML Tutorials
  {
    title: "Machine Learning Full Course - 12 Hours",
    slug: "machine-learning-full-course",
    description: "Comprehensive machine learning course covering algorithms and implementation. Learn supervised and unsupervised learning with Python. You'll build ML models from scratch. The foundation for an AI career!",
    technology: "ai_ml",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
    youtube_video_id: "GwIo3gDZCVQ",
    duration: "12:15:48",
    key_takeaways: [
      "Understand ML algorithms fundamentals",
      "Implement supervised learning models",
      "Apply unsupervised learning techniques",
      "Work with scikit-learn and TensorFlow",
      "Build end-to-end ML projects"
    ],
    skills_covered: ["Machine Learning", "Python", "scikit-learn", "TensorFlow", "Data Science"],
    instructor: "freeCodeCamp",
    featured: true,
    order: 14
  },

  // Database Tutorials
  {
    title: "SQL Tutorial - Full Database Course for Beginners",
    slug: "sql-tutorial-full-database-course",
    description: "Master SQL from the basics to advanced queries. Learn database design, joins, and optimization techniques. You'll query databases like a pro. Fundamental skill for any developer!",
    technology: "database",
    difficulty_level: "beginner",
    youtube_url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    youtube_video_id: "HXV3zeQKqGY",
    duration: "4:20:30",
    key_takeaways: [
      "Write SQL queries from basic to advanced",
      "Design relational database schemas",
      "Master JOINs and subqueries",
      "Optimize query performance",
      "Work with indexes and constraints"
    ],
    skills_covered: ["SQL", "Database Design", "MySQL", "PostgreSQL"],
    instructor: "freeCodeCamp",
    featured: false,
    order: 15
  },
  {
    title: "MongoDB Complete Tutorial - NoSQL Database",
    slug: "mongodb-complete-tutorial-nosql",
    description: "Learn MongoDB for modern application development. Cover CRUD operations, aggregation, and indexing. You'll build NoSQL databases with confidence. Perfect for full-stack and backend developers!",
    technology: "database",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=ofme2o29ngU",
    youtube_video_id: "ofme2o29ngU",
    duration: "1:31:22",
    key_takeaways: [
      "Understand document-based databases",
      "Perform CRUD operations in MongoDB",
      "Use aggregation pipelines",
      "Implement indexing strategies",
      "Connect MongoDB to applications"
    ],
    skills_covered: ["MongoDB", "NoSQL", "Database", "Aggregation"],
    instructor: "Web Dev Simplified",
    featured: false,
    order: 16
  },

  // Security Tutorials
  {
    title: "Web Security - OWASP Top 10 Explained",
    slug: "web-security-owasp-top-10",
    description: "Understand and prevent the most critical web security vulnerabilities. Learn about XSS, injection attacks, and security best practices. You'll build more secure applications. Essential for every web developer!",
    technology: "security",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=F5KJVuii0Yw",
    youtube_video_id: "F5KJVuii0Yw",
    duration: "1:58:45",
    key_takeaways: [
      "Understand OWASP Top 10 vulnerabilities",
      "Prevent SQL injection and XSS attacks",
      "Implement authentication securely",
      "Handle sensitive data properly",
      "Apply security headers and CSP"
    ],
    skills_covered: ["Web Security", "OWASP", "Authentication", "Encryption"],
    instructor: "Computerphile",
    featured: true,
    order: 17
  },

  // Go Tutorials
  {
    title: "Go Programming Language - Full Course",
    slug: "go-programming-full-course",
    description: "Learn Go (Golang) from scratch in this complete course. Build concurrent programs and web services. You'll write efficient, clean Go code. Popular for cloud and DevOps tooling!",
    technology: "golang",
    difficulty_level: "beginner",
    youtube_url: "https://www.youtube.com/watch?v=YS4e4q9oBaU",
    youtube_video_id: "YS4e4q9oBaU",
    duration: "6:39:53",
    key_takeaways: [
      "Master Go syntax and fundamentals",
      "Work with goroutines and channels",
      "Build REST APIs with Go",
      "Handle errors effectively",
      "Write tested, production code"
    ],
    skills_covered: ["Go", "Concurrency", "REST APIs", "Backend Development"],
    instructor: "freeCodeCamp",
    featured: false,
    order: 18
  },

  // More Next.js
  {
    title: "Next.js Server Actions - Complete Guide",
    slug: "nextjs-server-actions-complete-guide",
    description: "Master Server Actions in Next.js for seamless full-stack development. Learn form handling, mutations, and data revalidation. You'll build interactive apps without separate APIs. The future of Next.js development!",
    technology: "nextjs",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=dDpZfOQBMaU",
    youtube_video_id: "dDpZfOQBMaU",
    duration: "45:22",
    key_takeaways: [
      "Implement Server Actions for mutations",
      "Handle forms with useFormState",
      "Manage optimistic updates",
      "Revalidate data effectively",
      "Build full-stack features seamlessly"
    ],
    skills_covered: ["Next.js", "Server Actions", "React Server Components", "Forms"],
    instructor: "Lee Robinson",
    featured: false,
    order: 19
  },
  {
    title: "Next.js Authentication with NextAuth.js",
    slug: "nextjs-authentication-nextauth",
    description: "Add authentication to your Next.js app with NextAuth.js. Learn OAuth, credentials, and session management. You'll secure your application properly. A must-know for production apps!",
    technology: "nextjs",
    difficulty_level: "intermediate",
    youtube_url: "https://www.youtube.com/watch?v=md65iBX5Gxg",
    youtube_video_id: "md65iBX5Gxg",
    duration: "1:15:44",
    key_takeaways: [
      "Set up NextAuth.js configuration",
      "Implement OAuth providers (Google, GitHub)",
      "Handle credentials authentication",
      "Manage sessions and JWT",
      "Protect routes and API endpoints"
    ],
    skills_covered: ["Next.js", "NextAuth.js", "Authentication", "OAuth", "Security"],
    instructor: "Code With Antonio",
    featured: true,
    order: 20
  }
];

// Function to make HTTPS POST request
function createEntry(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      entry: data
    });

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/v3/content_types/${CONFIG.CONTENT_TYPE_UID}/entries`,
      method: 'POST',
      headers: {
        'api_key': CONFIG.API_KEY,
        'authorization': CONFIG.MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to create entry: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Function to publish an entry
function publishEntry(entryUid) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      entry: {
        environments: [CONFIG.ENVIRONMENT],
        locales: ['en-us']
      },
      rules: {
        approvals: false
      },
      scheduled_at: null,
      publish_with_reference: true
    });

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/v3/content_types/${CONFIG.CONTENT_TYPE_UID}/entries/${entryUid}/publish`,
      method: 'POST',
      headers: {
        'api_key': CONFIG.API_KEY,
        'authorization': CONFIG.MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to publish entry: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Main function to create all learning resources
async function seedLearnings() {
  console.log('📚 Starting to seed learning resources...\n');
  
  let successCount = 0;
  let failCount = 0;
  const createdEntries = [];

  for (let i = 0; i < learnings.length; i++) {
    const learning = learnings[i];
    try {
      console.log(`[${i + 1}/${learnings.length}] Creating: ${learning.title}...`);
      
      // Create entry
      const createdEntry = await createEntry(learning);
      console.log(`✅ Created successfully (UID: ${createdEntry.entry.uid})`);
      
      // Publish entry
      await publishEntry(createdEntry.entry.uid);
      console.log(`📤 Published successfully\n`);
      
      createdEntries.push({
        title: learning.title,
        uid: createdEntry.entry.uid,
        slug: learning.slug
      });
      
      successCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Failed to create ${learning.title}:`, error.message, '\n');
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Seeding complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(60));
  
  // Print created entries
  if (createdEntries.length > 0) {
    console.log('\n📋 Created Learning Resources:');
    console.log('-'.repeat(60));
    createdEntries.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.title}`);
      console.log(`   UID: ${entry.uid}`);
      console.log(`   URL: /learnings/${entry.slug}`);
    });
  }
}

// Validate configuration
function validateConfig() {
  const errors = [];
  
  if (!CONFIG.API_KEY) {
    errors.push('API_KEY is not configured in .env');
  }
  if (!CONFIG.MANAGEMENT_TOKEN) {
    errors.push('MANAGEMENT_TOKEN is not configured in .env');
  }
  if (!CONFIG.ENVIRONMENT) {
    errors.push('ENVIRONMENT is not configured in .env');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration Error:\n');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease ensure your .env file has the required variables.\n');
    process.exit(1);
  }
  
  console.log('✅ Configuration validated');
  console.log(`   API Key: ${CONFIG.API_KEY.substring(0, 10)}...`);
  console.log(`   Region: ${CONFIG.REGION}`);
  console.log(`   Environment: ${CONFIG.ENVIRONMENT}`);
  console.log(`   Content Type: ${CONFIG.CONTENT_TYPE_UID}\n`);
}

// Run the script
validateConfig();
seedLearnings().catch(console.error);

