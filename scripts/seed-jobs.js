/**
 * Script to seed job entries to Contentstack
 * Run: node scripts/seed-jobs.js
 * 
 * IMPORTANT: Run seed-companies.js FIRST, then update COMPANY_UIDS below with actual UIDs from Contentstack
 */

const https = require('https');

// ⚠️ CONFIGURE THESE VALUES
const CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  MANAGEMENT_TOKEN: process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN,
  ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  REGION: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION,
  CONTENT_TYPE_UID: 'job', // Your job content type UID
  
  // ✅ Company UIDs from seed-companies.js run
  COMPANY_UIDS: {
    techcorp: 'blt1cc8851c7499854e',
    datasystems: 'blt92230df0f5e6d15d',
    cloudnine: 'bltb072659160cd33ed',
    financehub: 'bltb146f9387bc7f7ef',
    healthtech: 'bltab7e1afc421f7ee6',
    edulearn: 'bltc369d9eb900b1a39',
    greenenergy: 'blt09c41f512efd5095',
    retailnext: 'bltafce18f53789cccd',
    cybershield: 'blt6c9411473fca3105',
    ailabs: 'bltfa6c5a61b0d7eb15',
    mediastream: 'blt8ef008eff1eb4c41',
    logisticshub: 'blt890f8a161d07fa89',
    gameforge: 'blte737ec45764b91ef',
    robotech: 'blta8891bac277b772d',
    socialconnect: 'bltb293885a2c8b4d29',
    biomed: 'blt514165cfb2babaff',
    travelease: 'bltd2815f7c265f4607',
    foodtech: 'blte9fbcf70932d99b4',
    spaceventures: 'blt31fb8b2221becceb',
    proptech: 'blt4350eec7083681b5'
  }
};

// Base URL based on region
const BASE_URLS = {
  us: 'api.contentstack.io',
  eu: 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com'
};

const BASE_URL = BASE_URLS[CONFIG.REGION] || BASE_URLS.us;

// Helper functions for dates
const getDateString = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const getFutureDate = (daysAhead = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// Sample job data (20 entries)
const jobs = [
  {
    title: "Senior Frontend Developer",
    description: "<p>Join our team as a <strong>Senior Frontend Developer</strong> and help build amazing user experiences with modern technologies.</p><p>You'll work with cutting-edge technologies and collaborate with talented designers and engineers to create products that millions of users love.</p>",
    requirements: "<ul><li>5+ years of experience with React and TypeScript</li><li>Strong understanding of modern frontend architecture</li><li>Experience with Next.js and server-side rendering</li><li>Proficiency in CSS frameworks like Tailwind CSS</li><li>Excellent problem-solving and communication skills</li></ul>",
    responsibilities: "<ul><li>Lead frontend architecture decisions</li><li>Mentor junior developers</li><li>Collaborate with design team on UI/UX</li><li>Write clean, maintainable code</li><li>Participate in code reviews and technical discussions</li></ul>",
    company: CONFIG.COMPANY_UIDS.techcorp,
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "Senior",
    salary: {
      min: 10000,
      max: 13333,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k Match", "Remote Work", "Stock Options", "Unlimited PTO"],
    skills: [
      { skill: "React", proficiency: "Advanced" },
      { skill: "TypeScript", proficiency: "Advanced" },
      { skill: "Next.js", proficiency: "Intermediate" },
      { skill: "Tailwind CSS", proficiency: "Intermediate" },
      { skill: "Git", proficiency: "Advanced" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(5),
    expires_at: getFutureDate(60),
    applications_count: 45,
    views_count: 320,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "jobs@techcorp.com"
  },
  {
    title: "Data Scientist",
    description: "<p>Seeking an experienced <strong>Data Scientist</strong> to derive insights from complex datasets and build predictive models.</p><p>You'll work on cutting-edge ML projects that drive business decisions.</p>",
    requirements: "<ul><li>Master's or PhD in Computer Science, Statistics, or related field</li><li>3+ years of experience in data science</li><li>Strong Python and SQL skills</li><li>Experience with ML frameworks (TensorFlow, PyTorch)</li><li>Statistical modeling expertise</li></ul>",
    responsibilities: "<ul><li>Analyze large datasets to identify trends and patterns</li><li>Build and deploy machine learning models</li><li>Collaborate with stakeholders on data strategy</li><li>Present findings to technical and non-technical audiences</li><li>Optimize data pipelines for performance</li></ul>",
    company: CONFIG.COMPANY_UIDS.datasystems,
    location: "New York, NY",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 9167,
      max: 12500,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "Learning Budget", "Remote Work", "Conference Attendance"],
    skills: [
      { skill: "Python", proficiency: "Advanced" },
      { skill: "Machine Learning", proficiency: "Advanced" },
      { skill: "SQL", proficiency: "Intermediate" },
      { skill: "TensorFlow", proficiency: "Intermediate" },
      { skill: "Statistics", proficiency: "Advanced" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(3),
    expires_at: getFutureDate(45),
    applications_count: 32,
    views_count: 245,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "careers@datasystems.com"
  },
  {
    title: "DevOps Engineer",
    description: "<p>Looking for a <strong>DevOps Engineer</strong> to manage our cloud infrastructure and CI/CD pipelines.</p><p>Help us build reliable, scalable systems that power millions of users.</p>",
    requirements: "<ul><li>4+ years of DevOps experience</li><li>Strong knowledge of AWS/Azure/GCP</li><li>Experience with Kubernetes and Docker</li><li>Infrastructure as Code (Terraform, CloudFormation)</li><li>CI/CD pipeline expertise</li></ul>",
    responsibilities: "<ul><li>Manage cloud infrastructure across multiple environments</li><li>Build and maintain CI/CD pipelines</li><li>Monitor system performance and reliability</li><li>Automate deployment processes</li><li>Implement security best practices</li></ul>",
    company: CONFIG.COMPANY_UIDS.cloudnine,
    location: "Seattle, WA",
    type: "Full-time",
    experience: "Senior",
    salary: {
      min: 10833,
      max: 14167,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Remote First", "Learning Budget", "Home Office Stipend"],
    skills: [
      { skill: "AWS", proficiency: "Advanced" },
      { skill: "Kubernetes", proficiency: "Advanced" },
      { skill: "Docker", proficiency: "Advanced" },
      { skill: "Terraform", proficiency: "Intermediate" },
      { skill: "CI/CD", proficiency: "Advanced" }
    ],
    category: "Operations",
    status: "active",
    posted_at: getDateString(2),
    expires_at: getFutureDate(30),
    applications_count: 28,
    views_count: 198,
    is_remote: true,
    is_urgent: true,
    application_url: "",
    contact_email: "jobs@cloudnine.io"
  },
  {
    title: "Product Manager",
    description: "<p>Join our product team to drive strategy and execution for our <strong>fintech platform</strong>.</p><p>You'll work with engineering and design teams to build products that users love.</p>",
    requirements: "<ul><li>5+ years of product management experience</li><li>Experience in fintech or financial services</li><li>Strong analytical and problem-solving skills</li><li>Excellent communication and leadership</li><li>Track record of successful product launches</li></ul>",
    responsibilities: "<ul><li>Define product strategy and roadmap</li><li>Work with engineering and design teams</li><li>Conduct user research and gather feedback</li><li>Prioritize features and requirements</li><li>Track and analyze product metrics</li></ul>",
    company: CONFIG.COMPANY_UIDS.financehub,
    location: "Austin, TX",
    type: "Full-time",
    experience: "Senior",
    salary: {
      min: 11667,
      max: 15000,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Stock Options", "Unlimited PTO"],
    skills: [
      { skill: "Product Strategy", proficiency: "Advanced" },
      { skill: "Agile", proficiency: "Advanced" },
      { skill: "User Research", proficiency: "Intermediate" },
      { skill: "Data Analysis", proficiency: "Intermediate" },
      { skill: "Leadership", proficiency: "Advanced" }
    ],
    category: "Product",
    status: "active",
    posted_at: getDateString(7),
    expires_at: getFutureDate(45),
    applications_count: 52,
    views_count: 410,
    is_remote: false,
    is_urgent: false,
    application_url: "",
    contact_email: "careers@financehub.com"
  },
  {
    title: "UX/UI Designer",
    description: "<p>Create beautiful and intuitive user experiences for our <strong>healthcare platform</strong>.</p><p>Help us design products that improve patient outcomes.</p>",
    requirements: "<ul><li>3+ years of UX/UI design experience</li><li>Proficiency in Figma and design systems</li><li>Strong portfolio demonstrating design thinking</li><li>Experience with user research and testing</li><li>Understanding of accessibility standards</li></ul>",
    responsibilities: "<ul><li>Design user interfaces for web and mobile</li><li>Create wireframes, prototypes, and mockups</li><li>Conduct user research and usability testing</li><li>Collaborate with product and engineering teams</li><li>Maintain and evolve design system</li></ul>",
    company: CONFIG.COMPANY_UIDS.healthtech,
    location: "Boston, MA",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 7917,
      max: 10833,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "Remote Work", "Design Tools Budget", "Professional Development"],
    skills: [
      { skill: "Figma", proficiency: "Advanced" },
      { skill: "User Research", proficiency: "Intermediate" },
      { skill: "Prototyping", proficiency: "Advanced" },
      { skill: "Design Systems", proficiency: "Intermediate" },
      { skill: "Accessibility", proficiency: "Intermediate" }
    ],
    category: "Design",
    status: "active",
    posted_at: getDateString(4),
    expires_at: getFutureDate(40),
    applications_count: 38,
    views_count: 287,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "design@healthtech-innov.com"
  },
  {
    title: "Backend Engineer",
    description: "<p>Build scalable backend services for our <strong>e-learning platform</strong> serving millions of students.</p><p>Work on challenging distributed systems problems.</p>",
    requirements: "<ul><li>4+ years of backend development experience</li><li>Strong knowledge of Node.js or Python</li><li>Experience with microservices architecture</li><li>Database design expertise (SQL and NoSQL)</li><li>API design and development</li></ul>",
    responsibilities: "<ul><li>Design and implement backend services</li><li>Build RESTful and GraphQL APIs</li><li>Optimize database queries and performance</li><li>Write unit and integration tests</li><li>Collaborate with frontend team</li></ul>",
    company: CONFIG.COMPANY_UIDS.edulearn,
    location: "Chicago, IL",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 9167,
      max: 12083,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Learning Budget", "Remote Work"],
    skills: [
      { skill: "Node.js", proficiency: "Advanced" },
      { skill: "Python", proficiency: "Intermediate" },
      { skill: "PostgreSQL", proficiency: "Advanced" },
      { skill: "MongoDB", proficiency: "Intermediate" },
      { skill: "API Design", proficiency: "Advanced" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(6),
    expires_at: getFutureDate(50),
    applications_count: 41,
    views_count: 312,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "jobs@edulearn.io"
  },
  {
    title: "Marketing Manager",
    description: "<p>Lead marketing initiatives for our <strong>sustainable energy solutions</strong> company.</p><p>Help us build brand awareness and drive customer acquisition.</p>",
    requirements: "<ul><li>5+ years of marketing experience</li><li>Experience in B2B and B2C marketing</li><li>Strong digital marketing skills</li><li>Content strategy and SEO knowledge</li><li>Leadership and team management</li></ul>",
    responsibilities: "<ul><li>Develop and execute marketing strategy</li><li>Manage marketing team and budget</li><li>Create content and campaigns</li><li>Analyze marketing metrics and ROI</li><li>Build brand awareness</li></ul>",
    company: CONFIG.COMPANY_UIDS.greenenergy,
    location: "Portland, OR",
    type: "Full-time",
    experience: "Senior",
    salary: {
      min: 8333,
      max: 11250,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Remote Options", "Sustainability Programs"],
    skills: [
      { skill: "Digital Marketing", proficiency: "Advanced" },
      { skill: "Content Strategy", proficiency: "Advanced" },
      { skill: "SEO", proficiency: "Intermediate" },
      { skill: "Analytics", proficiency: "Intermediate" },
      { skill: "Leadership", proficiency: "Advanced" }
    ],
    category: "Marketing",
    status: "active",
    posted_at: getDateString(8),
    expires_at: getFutureDate(35),
    applications_count: 29,
    views_count: 195,
    is_remote: false,
    is_urgent: false,
    application_url: "",
    contact_email: "careers@greenenergy.com"
  },
  {
    title: "Mobile Developer (iOS)",
    description: "<p>Build native <strong>iOS applications</strong> for our e-commerce platform.</p><p>Create delightful mobile experiences for millions of shoppers.</p>",
    requirements: "<ul><li>4+ years of iOS development experience</li><li>Strong Swift programming skills</li><li>Experience with SwiftUI and UIKit</li><li>Understanding of iOS design patterns</li><li>App Store submission experience</li></ul>",
    responsibilities: "<ul><li>Develop and maintain iOS applications</li><li>Implement new features and improvements</li><li>Write clean, testable code</li><li>Collaborate with design and backend teams</li><li>Debug and optimize app performance</li></ul>",
    company: CONFIG.COMPANY_UIDS.retailnext,
    location: "Los Angeles, CA",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 9583,
      max: 12917,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "iPhone/MacBook", "Stock Options"],
    skills: [
      { skill: "Swift", proficiency: "Advanced" },
      { skill: "SwiftUI", proficiency: "Intermediate" },
      { skill: "iOS", proficiency: "Advanced" },
      { skill: "Xcode", proficiency: "Advanced" },
      { skill: "REST APIs", proficiency: "Intermediate" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(10),
    expires_at: getFutureDate(40),
    applications_count: 36,
    views_count: 268,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "mobile@retailnext.com"
  },
  {
    title: "Cybersecurity Analyst",
    description: "<p>Protect our systems and data as part of our <strong>security operations team</strong>.</p><p>Help defend against evolving cyber threats.</p>",
    requirements: "<ul><li>3+ years of cybersecurity experience</li><li>Knowledge of security frameworks (NIST, ISO)</li><li>Experience with SIEM tools</li><li>Security certifications (CISSP, CEH) preferred</li><li>Incident response expertise</li></ul>",
    responsibilities: "<ul><li>Monitor security systems and logs</li><li>Investigate security incidents</li><li>Conduct vulnerability assessments</li><li>Implement security controls</li><li>Document security policies and procedures</li></ul>",
    company: CONFIG.COMPANY_UIDS.cybershield,
    location: "Washington, DC",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 7917,
      max: 10833,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Security Clearance Bonus", "Training Budget"],
    skills: [
      { skill: "Network Security", proficiency: "Advanced" },
      { skill: "SIEM", proficiency: "Intermediate" },
      { skill: "Incident Response", proficiency: "Advanced" },
      { skill: "Risk Assessment", proficiency: "Intermediate" },
      { skill: "Compliance", proficiency: "Intermediate" }
    ],
    category: "Operations",
    status: "active",
    posted_at: getDateString(1),
    expires_at: getFutureDate(25),
    applications_count: 24,
    views_count: 156,
    is_remote: true,
    is_urgent: true,
    application_url: "",
    contact_email: "security@cybershield.com"
  },
  {
    title: "Machine Learning Engineer",
    description: "<p>Develop and deploy <strong>ML models</strong> for cutting-edge AI applications.</p><p>Push the boundaries of what's possible with artificial intelligence.</p>",
    requirements: "<ul><li>3+ years of ML engineering experience</li><li>Strong Python and ML frameworks knowledge</li><li>Experience with model deployment and MLOps</li><li>Computer vision or NLP expertise</li><li>Research publication experience (bonus)</li></ul>",
    responsibilities: "<ul><li>Build and train machine learning models</li><li>Deploy models to production environments</li><li>Optimize model performance and accuracy</li><li>Collaborate with research team on new approaches</li><li>Stay current with latest ML research</li></ul>",
    company: CONFIG.COMPANY_UIDS.ailabs,
    location: "Palo Alto, CA",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 11667,
      max: 15833,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Competitive Salary", "Health Insurance", "401k", "Research Budget", "Conference Attendance"],
    skills: [
      { skill: "Python", proficiency: "Advanced" },
      { skill: "TensorFlow", proficiency: "Advanced" },
      { skill: "PyTorch", proficiency: "Advanced" },
      { skill: "MLOps", proficiency: "Intermediate" },
      { skill: "Deep Learning", proficiency: "Advanced" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(3),
    expires_at: getFutureDate(45),
    applications_count: 67,
    views_count: 523,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "ml@ailabs.ai"
  },
  {
    title: "Video Editor",
    description: "<p>Create compelling <strong>video content</strong> for our streaming platform.</p><p>Work with talented creators and bring stories to life.</p>",
    requirements: "<ul><li>3+ years of professional video editing</li><li>Expert in Adobe Premiere and After Effects</li><li>Strong storytelling and creative skills</li><li>Color grading and audio mixing</li><li>Portfolio of published work</li></ul>",
    responsibilities: "<ul><li>Edit video content for the platform</li><li>Create motion graphics and animations</li><li>Collaborate with production team</li><li>Manage video assets and library</li><li>Ensure quality and consistency</li></ul>",
    company: CONFIG.COMPANY_UIDS.mediastream,
    location: "Los Angeles, CA",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 5833,
      max: 7917,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Creative Time Off", "Equipment"],
    skills: [
      { skill: "Adobe Premiere", proficiency: "Advanced" },
      { skill: "After Effects", proficiency: "Advanced" },
      { skill: "Color Grading", proficiency: "Intermediate" },
      { skill: "Storytelling", proficiency: "Advanced" },
      { skill: "Audio Editing", proficiency: "Intermediate" }
    ],
    category: "Design",
    status: "active",
    posted_at: getDateString(9),
    expires_at: getFutureDate(30),
    applications_count: 31,
    views_count: 203,
    is_remote: false,
    is_urgent: false,
    application_url: "",
    contact_email: "creative@mediastream.io"
  },
  {
    title: "Supply Chain Analyst",
    description: "<p>Optimize <strong>supply chain operations</strong> and improve logistics efficiency.</p><p>Use data to drive smarter decisions.</p>",
    requirements: "<ul><li>2+ years in supply chain or logistics</li><li>Strong analytical and Excel skills</li><li>Experience with supply chain software</li><li>Understanding of inventory management</li><li>Data visualization skills</li></ul>",
    responsibilities: "<ul><li>Analyze supply chain data and metrics</li><li>Identify optimization opportunities</li><li>Create reports and dashboards</li><li>Collaborate with operations team</li><li>Monitor KPIs and performance indicators</li></ul>",
    company: CONFIG.COMPANY_UIDS.logisticshub,
    location: "Atlanta, GA",
    type: "Full-time",
    experience: "Entry",
    salary: {
      min: 5417,
      max: 7083,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Performance Bonus", "Training"],
    skills: [
      { skill: "Excel", proficiency: "Advanced" },
      { skill: "Data Analysis", proficiency: "Intermediate" },
      { skill: "Supply Chain", proficiency: "Intermediate" },
      { skill: "Logistics", proficiency: "Beginner" },
      { skill: "SQL", proficiency: "Beginner" }
    ],
    category: "Operations",
    status: "active",
    posted_at: getDateString(12),
    expires_at: getFutureDate(50),
    applications_count: 19,
    views_count: 142,
    is_remote: false,
    is_urgent: false,
    application_url: "",
    contact_email: "careers@logisticshub.com"
  },
  {
    title: "Game Developer (Unity)",
    description: "<p>Create immersive <strong>gaming experiences</strong> using Unity engine.</p><p>Build games that players love and remember.</p>",
    requirements: "<ul><li>3+ years of Unity game development</li><li>Strong C# programming skills</li><li>Experience shipping games to market</li><li>3D graphics and physics knowledge</li><li>Passion for gaming</li></ul>",
    responsibilities: "<ul><li>Develop game features and mechanics</li><li>Implement gameplay systems</li><li>Optimize game performance</li><li>Collaborate with artists and designers</li><li>Debug and fix issues</li></ul>",
    company: CONFIG.COMPANY_UIDS.gameforge,
    location: "Austin, TX",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 7083,
      max: 10000,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Game Library", "Flex Time"],
    skills: [
      { skill: "Unity", proficiency: "Advanced" },
      { skill: "C#", proficiency: "Advanced" },
      { skill: "Game Design", proficiency: "Intermediate" },
      { skill: "3D Graphics", proficiency: "Intermediate" },
      { skill: "Version Control", proficiency: "Intermediate" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(5),
    expires_at: getFutureDate(40),
    applications_count: 44,
    views_count: 298,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "jobs@gameforge.games"
  },
  {
    title: "Robotics Engineer",
    description: "<p>Design and program <strong>industrial automation robots</strong>.</p><p>Build the future of manufacturing with intelligent robotic systems.</p>",
    requirements: "<ul><li>4+ years in robotics engineering</li><li>Strong mechanical and electrical knowledge</li><li>Experience with ROS and robotic systems</li><li>Programming in C++ and Python</li><li>CAD software proficiency</li></ul>",
    responsibilities: "<ul><li>Design robotic systems and components</li><li>Program robot controllers</li><li>Test and validate designs</li><li>Troubleshoot technical issues</li><li>Document engineering specifications</li></ul>",
    company: CONFIG.COMPANY_UIDS.robotech,
    location: "Detroit, MI",
    type: "Full-time",
    experience: "Senior",
    salary: {
      min: 8333,
      max: 11667,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Engineering Tools", "Patent Incentives"],
    skills: [
      { skill: "ROS", proficiency: "Advanced" },
      { skill: "C++", proficiency: "Advanced" },
      { skill: "Python", proficiency: "Intermediate" },
      { skill: "CAD", proficiency: "Intermediate" },
      { skill: "Control Systems", proficiency: "Advanced" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(11),
    expires_at: getFutureDate(55),
    applications_count: 21,
    views_count: 167,
    is_remote: false,
    is_urgent: false,
    application_url: "",
    contact_email: "engineering@robotech.com"
  },
  {
    title: "Content Writer",
    description: "<p>Create engaging <strong>content</strong> for our social media platform.</p><p>Help shape the voice of our brand.</p>",
    requirements: "<ul><li>2+ years of professional writing</li><li>Strong grammar and editing skills</li><li>SEO and content marketing knowledge</li><li>Social media savvy</li><li>Portfolio of published work</li></ul>",
    responsibilities: "<ul><li>Write blog posts and articles</li><li>Create social media content</li><li>Optimize content for SEO</li><li>Collaborate with marketing team</li><li>Research industry trends</li></ul>",
    company: CONFIG.COMPANY_UIDS.socialconnect,
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "Entry",
    salary: {
      min: 4583,
      max: 6250,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Remote Work", "Professional Development"],
    skills: [
      { skill: "Content Writing", proficiency: "Advanced" },
      { skill: "SEO", proficiency: "Intermediate" },
      { skill: "Social Media", proficiency: "Intermediate" },
      { skill: "Research", proficiency: "Intermediate" },
      { skill: "Editing", proficiency: "Advanced" }
    ],
    category: "Marketing",
    status: "active",
    posted_at: getDateString(7),
    expires_at: getFutureDate(35),
    applications_count: 58,
    views_count: 389,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "content@socialconnect.com"
  },
  {
    title: "Research Scientist",
    description: "<p>Conduct <strong>biomedical research</strong> to develop innovative treatments.</p><p>Make a difference in advancing medical science.</p>",
    requirements: "<ul><li>PhD in Biology, Chemistry, or related field</li><li>3+ years of research experience</li><li>Strong publication record</li><li>Laboratory techniques expertise</li><li>Grant writing experience</li></ul>",
    responsibilities: "<ul><li>Design and conduct experiments</li><li>Analyze research data</li><li>Write research papers and grants</li><li>Present findings at conferences</li><li>Collaborate with research team</li></ul>",
    company: CONFIG.COMPANY_UIDS.biomed,
    location: "San Diego, CA",
    type: "Full-time",
    experience: "Senior",
    salary: {
      min: 7500,
      max: 10417,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Research Grants", "Conference Travel"],
    skills: [
      { skill: "Research Design", proficiency: "Advanced" },
      { skill: "Data Analysis", proficiency: "Advanced" },
      { skill: "Laboratory", proficiency: "Advanced" },
      { skill: "Scientific Writing", proficiency: "Advanced" },
      { skill: "Statistics", proficiency: "Intermediate" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(14),
    expires_at: getFutureDate(60),
    applications_count: 15,
    views_count: 98,
    is_remote: false,
    is_urgent: false,
    application_url: "",
    contact_email: "research@biomedresearch.com"
  },
  {
    title: "Customer Success Manager",
    description: "<p>Ensure customer satisfaction and drive retention for our <strong>travel platform</strong>.</p><p>Help travelers have amazing experiences.</p>",
    requirements: "<ul><li>3+ years in customer success or account management</li><li>Excellent communication skills</li><li>CRM software experience (Salesforce)</li><li>Problem-solving and empathy</li><li>Data-driven mindset</li></ul>",
    responsibilities: "<ul><li>Manage customer relationships</li><li>Onboard new customers</li><li>Resolve customer issues</li><li>Identify upsell opportunities</li><li>Track customer health metrics</li></ul>",
    company: CONFIG.COMPANY_UIDS.travelease,
    location: "Miami, FL",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 5833,
      max: 7917,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Travel Credits", "Remote Work"],
    skills: [
      { skill: "Customer Success", proficiency: "Advanced" },
      { skill: "Salesforce", proficiency: "Intermediate" },
      { skill: "Communication", proficiency: "Advanced" },
      { skill: "Problem Solving", proficiency: "Advanced" },
      { skill: "Account Management", proficiency: "Intermediate" }
    ],
    category: "Sales",
    status: "active",
    posted_at: getDateString(8),
    expires_at: getFutureDate(45),
    applications_count: 34,
    views_count: 221,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "success@travelease.com"
  },
  {
    title: "Operations Manager",
    description: "<p>Manage daily operations for our <strong>food delivery platform</strong>.</p><p>Optimize processes and ensure smooth operations.</p>",
    requirements: "<ul><li>5+ years of operations management</li><li>Experience in logistics or delivery</li><li>Strong leadership skills</li><li>Data analysis and process optimization</li><li>Budget management experience</li></ul>",
    responsibilities: "<ul><li>Oversee daily operations</li><li>Manage operations team</li><li>Optimize delivery processes</li><li>Monitor operational metrics</li><li>Ensure quality standards</li></ul>",
    company: CONFIG.COMPANY_UIDS.foodtech,
    location: "Denver, CO",
    type: "Full-time",
    experience: "Senior",
    salary: {
      min: 7500,
      max: 10000,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Meal Credits", "Stock Options"],
    skills: [
      { skill: "Operations", proficiency: "Advanced" },
      { skill: "Leadership", proficiency: "Advanced" },
      { skill: "Process Optimization", proficiency: "Advanced" },
      { skill: "Analytics", proficiency: "Intermediate" },
      { skill: "Budgeting", proficiency: "Intermediate" }
    ],
    category: "Operations",
    status: "active",
    posted_at: getDateString(6),
    expires_at: getFutureDate(40),
    applications_count: 27,
    views_count: 184,
    is_remote: false,
    is_urgent: false,
    application_url: "",
    contact_email: "ops@foodtech.delivery"
  },
  {
    title: "Aerospace Engineer",
    description: "<p>Design <strong>spacecraft systems</strong> for commercial space missions.</p><p>Help build humanity's future in space.</p>",
    requirements: "<ul><li>5+ years in aerospace engineering</li><li>Experience with spacecraft design</li><li>Strong CAD and simulation skills</li><li>Knowledge of orbital mechanics</li><li>Security clearance (or ability to obtain)</li></ul>",
    responsibilities: "<ul><li>Design spacecraft components</li><li>Perform structural analysis</li><li>Conduct testing and validation</li><li>Document engineering designs</li><li>Collaborate with mission team</li></ul>",
    company: CONFIG.COMPANY_UIDS.spaceventures,
    location: "Houston, TX",
    type: "Full-time",
    experience: "Senior",
    salary: {
      min: 9167,
      max: 12500,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Competitive Salary", "Health Insurance", "401k", "Relocation"],
    skills: [
      { skill: "CAD", proficiency: "Advanced" },
      { skill: "Aerospace", proficiency: "Advanced" },
      { skill: "Structural Analysis", proficiency: "Advanced" },
      { skill: "MATLAB", proficiency: "Intermediate" },
      { skill: "Systems Engineering", proficiency: "Advanced" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(2),
    expires_at: getFutureDate(30),
    applications_count: 18,
    views_count: 134,
    is_remote: false,
    is_urgent: true,
    application_url: "",
    contact_email: "careers@spaceventures.com"
  },
  {
    title: "Full Stack Developer",
    description: "<p>Build end-to-end solutions for our <strong>real estate technology platform</strong>.</p><p>Work across the full stack from database to UI.</p>",
    requirements: "<ul><li>4+ years of full stack development</li><li>Experience with React and Node.js</li><li>Database design and optimization</li><li>RESTful API development</li><li>Agile methodology experience</li></ul>",
    responsibilities: "<ul><li>Develop full stack features</li><li>Build and maintain APIs</li><li>Optimize application performance</li><li>Write automated tests</li><li>Participate in agile ceremonies</li></ul>",
    company: CONFIG.COMPANY_UIDS.proptech,
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "Mid",
    salary: {
      min: 9583,
      max: 12500,
      currency: "$",
      period: "Monthly"
    },
    benefits: ["Health Insurance", "401k", "Remote Work", "Housing Stipend"],
    skills: [
      { skill: "React", proficiency: "Advanced" },
      { skill: "Node.js", proficiency: "Advanced" },
      { skill: "PostgreSQL", proficiency: "Intermediate" },
      { skill: "TypeScript", proficiency: "Advanced" },
      { skill: "Docker", proficiency: "Intermediate" }
    ],
    category: "Engineering",
    status: "active",
    posted_at: getDateString(4),
    expires_at: getFutureDate(45),
    applications_count: 39,
    views_count: 276,
    is_remote: true,
    is_urgent: false,
    application_url: "",
    contact_email: "dev@proptech.io"
  }
];

// Function to make HTTPS POST request
function createEntry(jobData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      entry: jobData
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
      }
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

// Main function to create all jobs
async function seedJobs() {
  console.log('🚀 Starting to seed jobs...\n');
  
  // Validate company UIDs
  const hasPlaceholders = Object.values(CONFIG.COMPANY_UIDS).some(uid => uid.startsWith('REPLACE_WITH'));
  if (hasPlaceholders) {
    console.error('❌ ERROR: Please update COMPANY_UIDS in CONFIG with actual company UIDs from Contentstack!');
    console.error('   Run seed-companies.js first, then copy the UIDs from Contentstack.\n');
    process.exit(1);
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    try {
      console.log(`[${i + 1}/${jobs.length}] Creating: ${job.title}...`);
      
      // Create entry
      const createdEntry = await createEntry(job);
      console.log(`✅ Created successfully (UID: ${createdEntry.entry.uid})`);
      
      // Publish entry
      await publishEntry(createdEntry.entry.uid);
      console.log(`📤 Published successfully\n`);
      
      successCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Failed to create ${job.title}:`, error.message, '\n');
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Seeding complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(50));
}

// Validate configuration
function validateConfig() {
  const errors = [];
  
  if (CONFIG.API_KEY === 'YOUR_API_KEY') {
    errors.push('API_KEY is not configured');
  }
  if (CONFIG.MANAGEMENT_TOKEN === 'YOUR_MANAGEMENT_TOKEN') {
    errors.push('MANAGEMENT_TOKEN is not configured');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration Error:\n');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease update the CONFIG object at the top of this file.\n');
    process.exit(1);
  }
}

// Run the script
validateConfig();
seedJobs().catch(console.error);
