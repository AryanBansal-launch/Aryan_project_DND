/**
 * Script to seed company entries to Contentstack
 * Run: node scripts/seed-companies.js
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
    CONTENT_TYPE_UID: 'company' // Your company content type UID
};

// Base URL based on region
const BASE_URLS = {
  us: 'api.contentstack.io',
  eu: 'eu-api.contentstack.com',
  'azure-na': 'azure-na-api.contentstack.com'
};

const BASE_URL = BASE_URLS[CONFIG.REGION] || BASE_URLS.us;

// Sample company data
const companies = [
  {
    title: "TechCorp Inc",
    description: "Leading technology company building innovative solutions for modern businesses. We specialize in cloud computing, AI, and enterprise software solutions.",
    logo: null,
    website: "https://techcorp.com",
    location: "San Francisco, CA",
    industry: "Technology",
    size: "201-500",
    founded: "2015-01-01",
    benefits: ["Health Insurance", "401k Match", "Remote Work", "Unlimited PTO", "Stock Options"],
    culture: "We value innovation, collaboration, and work-life balance. Our team is passionate about pushing the boundaries of what's possible with technology.",
    social_media: {
      linkedin: "https://linkedin.com/company/techcorp",
      twitter: "https://twitter.com/techcorp",
      facebook: "https://facebook.com/techcorp",
      website: "https://techcorp.com"
    }
  },
  {
    title: "DataSystems LLC",
    description: "Enterprise data analytics and business intelligence solutions provider. We help businesses make data-driven decisions with our advanced analytics platform.",
    logo: null,
    website: "https://datasystems.com",
    location: "New York, NY",
    industry: "Technology",
    size: "501-1000",
    founded: "2010-03-15",
    benefits: ["Health Insurance", "Dental", "Vision", "Stock Options", "Learning Budget"],
    culture: "Data-driven culture focused on delivering insights that matter. We believe in transparency, continuous learning, and innovation.",
    social_media: {
      linkedin: "https://linkedin.com/company/datasystems",
      twitter: "https://twitter.com/datasystems",
      facebook: "https://facebook.com/datasystems",
      website: "https://datasystems.com"
    }
  },
  {
    title: "CloudNine Solutions",
    description: "Cloud infrastructure and DevOps consulting services. We help companies migrate to and optimize their cloud infrastructure.",
    logo: null,
    website: "https://cloudnine.io",
    location: "Seattle, WA",
    industry: "Technology",
    size: "51-200",
    founded: "2018-06-01",
    benefits: ["Remote First", "Health Insurance", "401k", "Flexible Hours", "Home Office Stipend"],
    culture: "Remote-first company with focus on work-life balance and continuous learning. We empower our team to work from anywhere.",
    social_media: {
      linkedin: "https://linkedin.com/company/cloudnine",
      twitter: "https://twitter.com/cloudnine",
      facebook: "",
      website: "https://cloudnine.io"
    }
  },
  {
    title: "FinanceHub",
    description: "Modern fintech platform revolutionizing personal finance management. We make banking simple, transparent, and accessible to everyone.",
    logo: null,
    website: "https://financehub.com",
    location: "Austin, TX",
    industry: "Finance",
    size: "201-500",
    founded: "2016-09-12",
    benefits: ["Health Insurance", "401k", "Stock Options", "Gym Membership", "Catered Lunch"],
    culture: "Fast-paced fintech environment with strong focus on security and compliance. We're building the future of personal finance.",
    social_media: {
      linkedin: "https://linkedin.com/company/financehub",
      twitter: "https://twitter.com/financehub",
      facebook: "https://facebook.com/financehub",
      website: "https://financehub.com"
    }
  },
  {
    title: "HealthTech Innovations",
    description: "Healthcare technology improving patient outcomes through AI and data analytics. We're on a mission to make healthcare more accessible and effective.",
    logo: null,
    website: "https://healthtech-innov.com",
    location: "Boston, MA",
    industry: "Healthcare",
    size: "51-200",
    founded: "2017-04-20",
    benefits: ["Comprehensive Health Insurance", "401k", "Remote Work", "Professional Development", "Wellness Programs"],
    culture: "Mission-driven team working to transform healthcare delivery. We believe technology can save lives and improve patient care.",
    social_media: {
      linkedin: "https://linkedin.com/company/healthtech-innovations",
      twitter: "https://twitter.com/healthtech",
      facebook: "",
      website: "https://healthtech-innov.com"
    }
  },
  {
    title: "EduLearn Platform",
    description: "E-learning platform connecting students with world-class educators. We're democratizing education and making learning accessible to everyone.",
    logo: null,
    website: "https://edulearn.io",
    location: "Chicago, IL",
    industry: "Education",
    size: "51-200",
    founded: "2019-01-10",
    benefits: ["Health Insurance", "Learning Budget", "Remote Work", "Flexible Schedule", "Professional Development"],
    culture: "Education-first culture focused on making learning accessible to everyone. We're passionate about empowering learners worldwide.",
    social_media: {
      linkedin: "https://linkedin.com/company/edulearn",
      twitter: "https://twitter.com/edulearn",
      facebook: "https://facebook.com/edulearn",
      website: "https://edulearn.io"
    }
  },
  {
    title: "GreenEnergy Solutions",
    description: "Sustainable energy solutions for residential and commercial properties. We're helping the world transition to clean, renewable energy.",
    logo: null,
    website: "https://greenenergy.com",
    location: "Portland, OR",
    industry: "Technology",
    size: "201-500",
    founded: "2012-07-15",
    benefits: ["Health Insurance", "401k", "Electric Vehicle Incentive", "Remote Options", "Sustainability Programs"],
    culture: "Environmentally conscious team dedicated to sustainable future. We believe in combating climate change through innovative energy solutions.",
    social_media: {
      linkedin: "https://linkedin.com/company/greenenergy",
      twitter: "https://twitter.com/greenenergy",
      facebook: "https://facebook.com/greenenergy",
      website: "https://greenenergy.com"
    }
  },
  {
    title: "RetailNext",
    description: "Next-generation e-commerce platform with AI-powered recommendations. We help retailers deliver personalized shopping experiences.",
    logo: null,
    website: "https://retailnext.com",
    location: "Los Angeles, CA",
    industry: "Technology",
    size: "201-500",
    founded: "2014-02-28",
    benefits: ["Health Insurance", "401k", "Employee Discount", "Stock Options", "Flexible Work"],
    culture: "Customer-obsessed culture with focus on innovation and speed. We're transforming the retail experience for millions of shoppers.",
    social_media: {
      linkedin: "https://linkedin.com/company/retailnext",
      twitter: "https://twitter.com/retailnext",
      facebook: "https://facebook.com/retailnext",
      website: "https://retailnext.com"
    }
  },
  {
    title: "CyberShield Security",
    description: "Comprehensive cybersecurity solutions protecting businesses worldwide. We provide enterprise-grade security for companies of all sizes.",
    logo: null,
    website: "https://cybershield.com",
    location: "Washington, DC",
    industry: "Technology",
    size: "501-1000",
    founded: "2011-05-10",
    benefits: ["Health Insurance", "401k", "Security Clearance Bonus", "Remote Work", "Professional Certifications"],
    culture: "Security-first mindset with commitment to protecting digital infrastructure. We're on the front lines of defending against cyber threats.",
    social_media: {
      linkedin: "https://linkedin.com/company/cybershield",
      twitter: "https://twitter.com/cybershield",
      facebook: "",
      website: "https://cybershield.com"
    }
  },
  {
    title: "AI Labs Research",
    description: "Cutting-edge artificial intelligence research and development. We're pushing the boundaries of what's possible with AI and machine learning.",
    logo: null,
    website: "https://ailabs.ai",
    location: "Palo Alto, CA",
    industry: "Technology",
    size: "51-200",
    founded: "2020-01-15",
    benefits: ["Competitive Salary", "Health Insurance", "401k", "Research Budget", "Conference Attendance"],
    culture: "Research-driven environment pushing boundaries of AI technology. We attract the brightest minds in artificial intelligence.",
    social_media: {
      linkedin: "https://linkedin.com/company/ailabs",
      twitter: "https://twitter.com/ailabs",
      facebook: "",
      website: "https://ailabs.ai"
    }
  },
  {
    title: "MediaStream Studios",
    description: "Digital media production and streaming platform. We create and distribute compelling video content for global audiences.",
    logo: null,
    website: "https://mediastream.io",
    location: "Los Angeles, CA",
    industry: "Design",
    size: "201-500",
    founded: "2015-08-20",
    benefits: ["Health Insurance", "401k", "Creative Time Off", "Production Equipment", "Streaming Subscriptions"],
    culture: "Creative environment celebrating artistic expression and innovation. We empower creators to tell their stories.",
    social_media: {
      linkedin: "https://linkedin.com/company/mediastream",
      twitter: "https://twitter.com/mediastream",
      facebook: "https://facebook.com/mediastream",
      website: "https://mediastream.io"
    }
  },
  {
    title: "LogisticsHub",
    description: "Smart logistics and supply chain management solutions. We optimize delivery routes and warehouse operations using advanced algorithms.",
    logo: null,
    website: "https://logisticshub.com",
    location: "Atlanta, GA",
    industry: "Technology",
    size: "501-1000",
    founded: "2013-11-05",
    benefits: ["Health Insurance", "401k", "Performance Bonus", "Career Development", "Relocation Assistance"],
    culture: "Efficiency-driven culture optimizing global supply chains. We're making logistics smarter and more sustainable.",
    social_media: {
      linkedin: "https://linkedin.com/company/logisticshub",
      twitter: "https://twitter.com/logisticshub",
      facebook: "",
      website: "https://logisticshub.com"
    }
  },
  {
    title: "GameForge Studios",
    description: "Independent game development studio creating immersive gaming experiences. We craft games that players love and remember.",
    logo: null,
    website: "https://gameforge.games",
    location: "Austin, TX",
    industry: "Design",
    size: "51-200",
    founded: "2018-03-22",
    benefits: ["Health Insurance", "401k", "Game Library Access", "Flex Time", "Gaming Equipment"],
    culture: "Passionate gamers building games they love to play. We believe in player-first design and creative freedom.",
    social_media: {
      linkedin: "https://linkedin.com/company/gameforge",
      twitter: "https://twitter.com/gameforge",
      facebook: "https://facebook.com/gameforge",
      website: "https://gameforge.games"
    }
  },
  {
    title: "RoboTech Automation",
    description: "Industrial automation and robotics solutions for manufacturing. We're advancing Industry 4.0 with intelligent robotic systems.",
    logo: null,
    website: "https://robotech.com",
    location: "Detroit, MI",
    industry: "Technology",
    size: "201-500",
    founded: "2010-12-01",
    benefits: ["Health Insurance", "401k", "Engineering Tools", "Patent Incentives", "Continuing Education"],
    culture: "Engineering excellence driving the future of automation. We're building the robots that will transform manufacturing.",
    social_media: {
      linkedin: "https://linkedin.com/company/robotech",
      twitter: "https://twitter.com/robotech",
      facebook: "",
      website: "https://robotech.com"
    }
  },
  {
    title: "SocialConnect",
    description: "Social networking platform connecting communities worldwide. We help people build meaningful relationships and share their stories.",
    logo: null,
    website: "https://socialconnect.com",
    location: "San Francisco, CA",
    industry: "Technology",
    size: "1000+",
    founded: "2012-02-14",
    benefits: ["Health Insurance", "401k", "Stock Options", "Unlimited PTO", "Wellness Programs"],
    culture: "Community-focused culture building meaningful connections. We believe technology should bring people together, not apart.",
    social_media: {
      linkedin: "https://linkedin.com/company/socialconnect",
      twitter: "https://twitter.com/socialconnect",
      facebook: "https://facebook.com/socialconnect",
      website: "https://socialconnect.com"
    }
  },
  {
    title: "BioMed Research Corp",
    description: "Biotechnology research developing next-generation medical treatments. We're pioneering breakthrough therapies for serious diseases.",
    logo: null,
    website: "https://biomedresearch.com",
    location: "San Diego, CA",
    industry: "Healthcare",
    size: "201-500",
    founded: "2011-06-30",
    benefits: ["Health Insurance", "401k", "Research Grants", "Conference Travel", "Lab Equipment"],
    culture: "Scientific rigor and innovation improving human health. We're committed to advancing medical science and patient care.",
    social_media: {
      linkedin: "https://linkedin.com/company/biomedresearch",
      twitter: "https://twitter.com/biomedresearch",
      facebook: "",
      website: "https://biomedresearch.com"
    }
  },
  {
    title: "TravelEase",
    description: "Travel booking platform with personalized recommendations. We make travel planning simple and help you discover amazing destinations.",
    logo: null,
    website: "https://travelease.com",
    location: "Miami, FL",
    industry: "Technology",
    size: "51-200",
    founded: "2016-04-18",
    benefits: ["Health Insurance", "401k", "Travel Credits", "Remote Work", "Flexible Schedule"],
    culture: "Wanderlust-inspired team helping people explore the world. We're passionate about making travel accessible and enjoyable.",
    social_media: {
      linkedin: "https://linkedin.com/company/travelease",
      twitter: "https://twitter.com/travelease",
      facebook: "https://facebook.com/travelease",
      website: "https://travelease.com"
    }
  },
  {
    title: "FoodTech Delivery",
    description: "Food delivery and restaurant technology solutions. We connect hungry customers with their favorite restaurants through seamless technology.",
    logo: null,
    website: "https://foodtech.delivery",
    location: "Denver, CO",
    industry: "Technology",
    size: "501-1000",
    founded: "2015-10-25",
    benefits: ["Health Insurance", "401k", "Meal Credits", "Stock Options", "Transit Benefits"],
    culture: "Fast-paced environment serving delicious food experiences. We're obsessed with delivering joy through food.",
    social_media: {
      linkedin: "https://linkedin.com/company/foodtech",
      twitter: "https://twitter.com/foodtech",
      facebook: "https://facebook.com/foodtech",
      website: "https://foodtech.delivery"
    }
  },
  {
    title: "SpaceVentures",
    description: "Commercial space technology and satellite services. We're making space accessible for research, communication, and exploration.",
    logo: null,
    website: "https://spaceventures.com",
    location: "Houston, TX",
    industry: "Technology",
    size: "201-500",
    founded: "2019-07-20",
    benefits: ["Competitive Salary", "Health Insurance", "401k", "Relocation Assistance", "Professional Development"],
    culture: "Pioneering the future of commercial space exploration. We're building the infrastructure for humanity's future in space.",
    social_media: {
      linkedin: "https://linkedin.com/company/spaceventures",
      twitter: "https://twitter.com/spaceventures",
      facebook: "https://facebook.com/spaceventures",
      website: "https://spaceventures.com"
    }
  },
  {
    title: "PropTech Solutions",
    description: "Real estate technology platform modernizing property management. We streamline operations for landlords and improve experiences for tenants.",
    logo: null,
    website: "https://proptech.io",
    location: "San Francisco, CA",
    industry: "Technology",
    size: "51-200",
    founded: "2017-09-08",
    benefits: ["Health Insurance", "401k", "Remote Work", "Housing Stipend", "Commuter Benefits"],
    culture: "Innovative team transforming the real estate industry. We're making property management efficient and tenant-friendly.",
    social_media: {
      linkedin: "https://linkedin.com/company/proptech",
      twitter: "https://twitter.com/proptech",
      facebook: "https://facebook.com/proptech",
      website: "https://proptech.io"
    }
  }
];

// Function to make HTTPS POST request
function createEntry(companyData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      entry: companyData
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

// Main function to create all companies
async function seedCompanies() {
  console.log('🚀 Starting to seed companies...\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    try {
      console.log(`[${i + 1}/${companies.length}] Creating: ${company.title}...`);
      
      // Create entry
      const createdEntry = await createEntry(company);
      console.log(`✅ Created successfully (UID: ${createdEntry.entry.uid})`);
      
      // Publish entry
      await publishEntry(createdEntry.entry.uid);
      console.log(`📤 Published successfully\n`);
      
      successCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Failed to create ${company.name}:`, error.message, '\n');
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
seedCompanies().catch(console.error);

