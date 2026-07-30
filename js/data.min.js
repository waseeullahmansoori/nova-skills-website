/* ============================================================
   NOVA SKILLS — Course Data (V1.1 Restructured Architecture)
   Single source of truth for all course & academy information
   12 Academies · 3 Program Levels (Career, Professional, Certification)
   ============================================================ */

const NS_COURSES = [
  {
    "id": "dm-mastery",
    "slug": "ai-digital-marketing-master",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Career Program",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #8B5CF6)",
    "name": "AI Digital Marketing Master",
    "shortDesc": "Complete 6-month mastery: SEO, GEO, Google Ads, Meta Ads, AI Automation and Agency Skills.",
    "fullDesc": "The ultimate 6-month career program in modern digital marketing. Master Google Ads, Meta Ads, SEO & GEO, Social Media, Performance Marketing, ChatGPT, Claude, Gemini and AI marketing automation to land high-paying roles.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Advanced",
    "price": 31499,
    "originalPrice": 89999,
    "rating": 4.9,
    "reviews": 198,
    "students": 920,
    "liveProjects": 20,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Google Ads",
      "Meta Ads",
      "SEMrush",
      "Ahrefs",
      "GA4",
      "HubSpot",
      "Mailchimp",
      "n8n",
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Digital Marketing Foundation",
        "lessons": 20
      },
      {
        "module": "Phase 2",
        "title": "Paid Advertising & Performance Marketing",
        "lessons": 24
      },
      {
        "module": "Phase 3",
        "title": "SEO & GEO (AI Search Optimisation)",
        "lessons": 16
      },
      {
        "module": "Phase 4",
        "title": "E-Commerce & Social Media",
        "lessons": 16
      },
      {
        "module": "Phase 5",
        "title": "AI Marketing Automation & Workflows",
        "lessons": 16
      },
      {
        "module": "Phase 6",
        "title": "Freelancing & Agency Scaled Skills",
        "lessons": 12
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "dm-professional",
    "slug": "ai-digital-marketing-professional",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Professional Program",
    "icon": "📊",
    "color": "linear-gradient(135deg, #FF6B00, #FF9A3C)",
    "name": "AI Digital Marketing Professional",
    "shortDesc": "Master Google Ads, SEO & GEO, Meta Ads, Social Media, Content & AI-powered marketing from scratch.",
    "fullDesc": "A comprehensive 4-month professional program covering every aspect of modern digital marketing — from SEO and Google Ads to Meta Ads, AI marketing automation and performance analytics.",
    "duration": "4 Months",
    "durationMonths": 4,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 17499,
    "originalPrice": 49999,
    "rating": 4.8,
    "reviews": 312,
    "students": 1840,
    "liveProjects": 10,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Google Ads",
      "Meta Ads Manager",
      "SEMrush",
      "GA4",
      "ChatGPT",
      "Canva",
      "HubSpot"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Digital Marketing Fundamentals",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "SEO & GEO (AI Search Optimisation)",
        "lessons": 12
      },
      {
        "module": "Module 3",
        "title": "Google Ads & SEM Strategy",
        "lessons": 10
      },
      {
        "module": "Module 4",
        "title": "Meta Ads & Retargeting",
        "lessons": 10
      },
      {
        "module": "Module 5",
        "title": "Performance Marketing & AI Automation",
        "lessons": 10
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "perf-marketing-pro",
    "slug": "performance-marketing-professional",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Professional Program",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #EF4444)",
    "name": "Performance Marketing Professional",
    "shortDesc": "Scale paid acquisition campaigns, optimize ROAS, and master media buying across channels.",
    "fullDesc": "Intensive 3-month professional program focused on media buying, funnel conversion optimization, attribution modeling, and data-driven ad spend allocation.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Intermediate",
    "price": 12999,
    "originalPrice": 34999,
    "rating": 4.8,
    "reviews": 142,
    "students": 640,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Google Ads",
      "Meta Ads Manager",
      "TikTok Ads",
      "GA4",
      "Triple Whale",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Advanced Media Buying & Budget Allocation",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Funnel Optimization & Landing Pages",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Conversion Rate Optimization (CRO)",
        "lessons": 6
      },
      {
        "module": "Module 4",
        "title": "Attribution & Performance Analytics",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "digital-marketing-pro",
    "slug": "digital-marketing-professional",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Professional Program",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #F59E0B)",
    "name": "Digital Marketing Professional",
    "shortDesc": "3-month professional course covering SEO, SEM, SMM, and AI Content Creation.",
    "fullDesc": "A practical 3-month course designed to equip professionals and business owners with core marketing strategies, paid ads execution, and organic growth frameworks.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 11999,
    "originalPrice": 29999,
    "rating": 4.7,
    "reviews": 165,
    "students": 710,
    "liveProjects": 6,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Google Ads",
      "Meta Ads",
      "SEMrush",
      "ChatGPT",
      "Canva"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Core Digital Marketing Principles",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Search & Social Campaign Setup",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Content & Email Automation",
        "lessons": 6
      },
      {
        "module": "Module 4",
        "title": "Analytics & Campaign Tuning",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "google-ads",
    "slug": "google-ads",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #FF9A3C)",
    "name": "Google Ads",
    "shortDesc": "From zero to certified Google Ads expert. Search, Display, Shopping, YouTube & Performance Max.",
    "fullDesc": "A focused 2-month deep-dive into Google Ads ecosystem covering all campaign types, bidding strategies, conversion tracking and Google Ads certification.",
    "duration": "2 Months",
    "durationMonths": 2,
    "mode": "Online",
    "level": "Beginner",
    "price": 6999,
    "originalPrice": 19999,
    "rating": 4.6,
    "reviews": 211,
    "students": 1240,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Google Ads",
      "Google Analytics 4",
      "Google Tag Manager",
      "Google Merchant Centre"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Google Ads Account Setup & Structure",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Search Campaigns & Keyword Mastery",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Display, Video & Shopping Campaigns",
        "lessons": 8
      },
      {
        "module": "Module 4",
        "title": "Performance Max & Smart Campaigns",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "meta-ads",
    "slug": "meta-ads-facebook-instagram",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #FF9A3C)",
    "name": "Meta Ads (Facebook & Instagram)",
    "shortDesc": "Master Facebook and Instagram advertising \u2014 from campaign setup to ROAS optimisation.",
    "fullDesc": "Complete Meta Ads training covering Facebook & Instagram advertising, audience targeting, creative strategy, retargeting and campaign optimisation for maximum ROI.",
    "duration": "2 Months",
    "durationMonths": 2,
    "mode": "Online",
    "level": "Beginner",
    "price": 6999,
    "originalPrice": 19999,
    "rating": 4.7,
    "reviews": 188,
    "students": 1100,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Meta Business Suite",
      "Meta Ads Manager",
      "Meta Pixel",
      "Canva"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Meta Ads Ecosystem & Account Setup",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Audience Research & Targeting",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Campaign Types & Creative Strategy",
        "lessons": 8
      },
      {
        "module": "Module 4",
        "title": "Retargeting & Lookalike Audiences",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "seo-geo",
    "slug": "seo-geo-ai-search-optimisation",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #FF9A3C)",
    "name": "SEO & GEO",
    "shortDesc": "Master traditional SEO and next-gen GEO \u2014 optimise for AI-powered search engines.",
    "fullDesc": "The only course in India teaching both traditional SEO and Generative Engine Optimisation (GEO) \u2014 the future of search visibility in AI-driven search engines like Google AI Mode and Perplexity.",
    "duration": "2 Months",
    "durationMonths": 2,
    "mode": "Online",
    "level": "Intermediate",
    "price": 6999,
    "originalPrice": 19999,
    "rating": 4.7,
    "reviews": 145,
    "students": 876,
    "liveProjects": 5,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "SEMrush",
      "Ahrefs",
      "Google Search Console",
      "ChatGPT",
      "Screaming Frog"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "SEO Fundamentals & Technical SEO",
        "lessons": 10
      },
      {
        "module": "Module 2",
        "title": "On-Page & Off-Page Optimisation",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "GEO \u2014 Generative Engine Optimisation",
        "lessons": 8
      }
    ],
    "tags": [
      "trending"
    ],
    "featured": false
  },
  {
    "id": "social-media-marketing",
    "slug": "social-media-marketing",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #EC4899)",
    "name": "Social Media Marketing",
    "shortDesc": "Build brand presence, create viral content strategies, and engage audiences on social platforms.",
    "fullDesc": "Learn organic and viral social media marketing techniques for Instagram, LinkedIn, YouTube, and X (Twitter).",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.6,
    "reviews": 98,
    "students": 540,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Buffer",
      "Hootsuite",
      "Canva",
      "ChatGPT",
      "CapCut"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Social Media Strategy & Planning",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Content Creation & Community Management",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "content-marketing",
    "slug": "content-marketing",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #F59E0B)",
    "name": "Content Marketing",
    "shortDesc": "Craft high-converting content, brand storytelling strategies, and blogs with AI tools.",
    "fullDesc": "Master content strategy, copywriting, blogging, lead magnet creation, and AI-assisted editorial workflows.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.6,
    "reviews": 84,
    "students": 420,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "ChatGPT",
      "Grammarly",
      "Notion",
      "WordPress",
      "SurferSEO"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Brand Storytelling & Content Strategy",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "AI Copywriting & Lead Generation",
        "lessons": 6
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "email-marketing",
    "slug": "email-marketing",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #2563EB)",
    "name": "Email Marketing",
    "shortDesc": "Build automated email drip sequences, newsletter campaigns, and lead nurture funnels.",
    "fullDesc": "Learn list building, email deliverability, Mailchimp & Klaviyo automation, and high-conversion copywriting.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.5,
    "reviews": 72,
    "students": 380,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Mailchimp",
      "Klaviyo",
      "HubSpot",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "List Building & Email Deliverability",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Automated Flows & Drip Campaigns",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "google-analytics-ga4",
    "slug": "google-analytics-ga4",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #75d766)",
    "name": "Google Analytics (GA4)",
    "shortDesc": "Master Google Analytics 4, custom reports, event tracking, and data analysis.",
    "fullDesc": "Complete certification course on setup, event tracking, custom explore reports, and data visualization in GA4.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 110,
    "students": 620,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "GA4",
      "Google Tag Manager",
      "Looker Studio"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "GA4 Property Configuration & Event Setup",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Custom Reports & Conversion Attribution",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "google-search-console",
    "slug": "google-search-console",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #0599a8)",
    "name": "Google Search Console",
    "shortDesc": "Monitor indexation, audit technical site errors, and boost organic search rankings.",
    "fullDesc": "Hands-on training in Google Search Console audit, indexing issues, sitemaps, core web vitals, and performance reporting.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.6,
    "reviews": 64,
    "students": 310,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Google Search Console",
      "Screaming Frog",
      "PageSpeed Insights"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "GSC Setup & Indexation Auditing",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Performance Analysis & Fixes",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "local-seo",
    "slug": "local-seo",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #10B981)",
    "name": "Local SEO",
    "shortDesc": "Rank local businesses on Google Maps & Google Business Profile for high-intent customer leads.",
    "fullDesc": "Master Google Business Profile optimization, local citations, map pack rankings, and review management.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 92,
    "students": 490,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Google Business Profile",
      "BrightLocal",
      "Whitespark"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Google Business Profile Optimisation",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Local Citations & Map Pack Ranking",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "youtube-marketing",
    "slug": "youtube-marketing",
    "academy": "Digital Marketing Academy",
    "academyId": "digital-marketing",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg, #FF6B00, #EF4444)",
    "name": "YouTube Marketing",
    "shortDesc": "Optimize video SEO, run YouTube Video Ads, and build organic channel subscriber growth.",
    "fullDesc": "Learn video keyword research, YouTube algorithm optimization, card/screen setup, and video ad campaigns.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 88,
    "students": 510,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "VidIQ",
      "TubeBuddy",
      "Google Ads",
      "YouTube Studio"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "YouTube Channel & Video SEO",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "YouTube Video Ads & Monetisation",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "ai-mastery",
    "slug": "ai-mastery-program",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Career Program",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #75d766)",
    "name": "AI Mastery Program",
    "shortDesc": "Complete AI: ChatGPT, Prompt Engineering, AI Agents, n8n Automation, AI Coding & more.",
    "fullDesc": "The most comprehensive AI skills programme in India. In 6 months, master ChatGPT, Prompt Engineering, AI for Business, AI Agents, n8n Workflow Automation, AI Video, Image Generation, AI Coding and real-world AI projects.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 27999,
    "originalPrice": 79999,
    "rating": 4.9,
    "reviews": 284,
    "students": 1560,
    "liveProjects": 20,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "ChatGPT",
      "Claude",
      "Gemini",
      "Midjourney",
      "n8n",
      "Make.com",
      "Cursor AI",
      "Sora"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "AI Fundamentals & ChatGPT Mastery",
        "lessons": 14
      },
      {
        "module": "Phase 2",
        "title": "Prompt Engineering & Content Creation",
        "lessons": 14
      },
      {
        "module": "Phase 3",
        "title": "AI for Business & Productivity",
        "lessons": 12
      },
      {
        "module": "Phase 4",
        "title": "AI Image & Video Generation",
        "lessons": 10
      },
      {
        "module": "Phase 5",
        "title": "AI Automation with n8n & Make",
        "lessons": 12
      },
      {
        "module": "Phase 6",
        "title": "AI Agents & AI Coding Projects",
        "lessons": 14
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement",
      "trending"
    ],
    "featured": true
  },
  {
    "id": "ai-productivity",
    "slug": "ai-productivity-professional",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Professional Program",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #75d766)",
    "name": "AI Productivity Professional",
    "shortDesc": "Use AI tools to 10x your work output: ChatGPT, Prompt Engineering, AI Automation & AI Research.",
    "fullDesc": "A focused 3-month programme teaching professionals how to leverage AI tools to dramatically increase productivity, automate repetitive tasks, and deliver better results in less time.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 13999,
    "originalPrice": 39999,
    "rating": 4.8,
    "reviews": 176,
    "students": 980,
    "liveProjects": 10,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "ChatGPT",
      "Perplexity",
      "Notion AI",
      "Make.com",
      "Zapier",
      "Claude"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "AI Fundamentals & ChatGPT",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Prompt Engineering Secrets",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "AI Workflow Automation",
        "lessons": 10
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "ai-for-business-pro",
    "slug": "ai-for-business-professional",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Professional Program",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #2563EB)",
    "name": "AI for Business Professional",
    "shortDesc": "Deploy AI solutions, custom GPTs, enterprise automation, and AI business strategy.",
    "fullDesc": "A 3-month strategic executive program for business leaders, managers, and entrepreneurs to integrate AI models, automate ops, and drive revenue.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Intermediate",
    "price": 14999,
    "originalPrice": 42999,
    "rating": 4.9,
    "reviews": 128,
    "students": 590,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "ChatGPT Enterprise",
      "Claude",
      "Custom GPTs",
      "Make.com",
      "n8n"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "AI Business Transformation Framework",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Building Enterprise AI Workflows",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Custom Knowledge Base & AI Chatbots",
        "lessons": 8
      }
    ],
    "tags": [
      "placement"
    ],
    "featured": false
  },
  {
    "id": "prompt-engineering",
    "slug": "prompt-engineering",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Certification Course",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #8B5CF6)",
    "name": "Prompt Engineering",
    "shortDesc": "Master advanced prompting techniques: Few-shot, Chain-of-Thought, and System Persona design.",
    "fullDesc": "Learn professional prompt engineering frameworks for ChatGPT, Claude, and Gemini to get precise, high-value outputs every time.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 210,
    "students": 1320,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "ChatGPT",
      "Claude 3.5",
      "Gemini",
      "OpenAI Playground"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Core Prompt Engineering Tactics",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Advanced Reasoning & System Prompts",
        "lessons": 6
      }
    ],
    "tags": [
      "popular",
      "trending"
    ],
    "featured": false
  },
  {
    "id": "ai-automation-n8n",
    "slug": "ai-automation-n8n",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Certification Course",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #FF6B00)",
    "name": "AI Automation with n8n",
    "shortDesc": "Build zero-code AI automation workflows using n8n, webhook APIs, and LLM nodes.",
    "fullDesc": "Step-by-step masterclass in creating powerful self-hosted or cloud n8n automation pipelines integrated with OpenAI, Claude, and database webhooks.",
    "duration": "2 Months",
    "durationMonths": 2,
    "mode": "Online",
    "level": "Intermediate",
    "price": 6999,
    "originalPrice": 19999,
    "rating": 4.9,
    "reviews": 164,
    "students": 820,
    "liveProjects": 6,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "n8n",
      "Make.com",
      "OpenAI API",
      "Webhooks",
      "PostgreSQL"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "n8n Architecture & Node Fundamentals",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Connecting AI LLMs & Vector Stores",
        "lessons": 8
      }
    ],
    "tags": [
      "trending"
    ],
    "featured": false
  },
  {
    "id": "ai-agents-fundamentals",
    "slug": "ai-agents-fundamentals",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Certification Course",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #EC4899)",
    "name": "AI Agents Fundamentals",
    "shortDesc": "Design autonomous AI agents capable of reasoning, executing tasks, and calling external APIs.",
    "fullDesc": "Learn autonomous agent architectures, multi-agent collaboration, memory persistence, and tool use.",
    "duration": "2 Months",
    "durationMonths": 2,
    "mode": "Online",
    "level": "Intermediate",
    "price": 6999,
    "originalPrice": 19999,
    "rating": 4.8,
    "reviews": 115,
    "students": 640,
    "liveProjects": 5,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "CrewAI",
      "LangChain",
      "AutoGPT",
      "ChatGPT",
      "n8n"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Agent Architectures & Memory Systems",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Building Autonomous Multi-Agent Workflows",
        "lessons": 8
      }
    ],
    "tags": [
      "trending"
    ],
    "featured": false
  },
  {
    "id": "chatgpt-mastery",
    "slug": "chatgpt-mastery",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Certification Course",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #10B981)",
    "name": "ChatGPT Mastery",
    "shortDesc": "Unlock the full potential of ChatGPT Plus: Custom GPTs, Code Interpreter, Advanced Voice, and Data Analysis.",
    "fullDesc": "Complete 1-month masterclass on using ChatGPT Plus effectively for content creation, data analysis, custom GPT building, and daily tasks.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 230,
    "students": 1450,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "ChatGPT Plus",
      "Custom GPTs",
      "Advanced Data Analysis"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "ChatGPT Features & Data Analysis",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Creating Custom GPTs & Actions",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "gemini-mastery",
    "slug": "gemini-mastery",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Certification Course",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #2563EB)",
    "name": "Gemini Mastery",
    "shortDesc": "Leverage Google Gemini Advanced, multimodal search, Google Workspace AI integration, and NotebookLM.",
    "fullDesc": "Learn Google's flagship AI ecosystem: Gemini Advanced, NotebookLM, Google Workspace extensions, and multimodal reasoning.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 95,
    "students": 560,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Google Gemini",
      "NotebookLM",
      "Google AI Studio"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Gemini Multimodal Features & Extensions",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "NotebookLM & Research Automation",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "claude-productivity",
    "slug": "claude-for-productivity",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Certification Course",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #F59E0B)",
    "name": "Claude for Productivity",
    "shortDesc": "Master Anthropic Claude 3.5 Sonnet, Artifacts, Project Knowledge Bases, and long-context analysis.",
    "fullDesc": "Learn how to use Claude's superior writing, coding, and Artifacts feature to synthesize complex documents and automate writing.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 140,
    "students": 890,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Claude 3.5 Sonnet",
      "Claude Projects",
      "Claude Artifacts"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Claude Artifacts & Long-Context Synthesis",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Custom Projects & Knowledge Uploads",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "ai-research-tools",
    "slug": "ai-research-tools",
    "academy": "AI Academy",
    "academyId": "ai",
    "programLevel": "Certification Course",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg, #0599a8, #75d766)",
    "name": "AI Research Tools",
    "shortDesc": "Automate academic, market, and data research using Perplexity Pro, Consensus, and Elicit.",
    "fullDesc": "Learn modern AI-powered research workflows for instant data extraction, citation verification, and literature review.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 86,
    "students": 470,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Perplexity Pro",
      "Consensus",
      "Elicit",
      "ChatPDF"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Perplexity Search & Fact-Checking",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Academic & Market Intelligence Automation",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "creative-design",
    "slug": "creative-design-master",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Career Program",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #EC4899)",
    "name": "Creative Design Master",
    "shortDesc": "Complete 6-month program: Graphic Design, Figma UI/UX, Motion Graphics, Branding & AI Design.",
    "fullDesc": "A complete 6-month career program in creative design covering graphic design, UI/UX in Figma, brand design, packaging, and generative AI design tools.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 24999,
    "originalPrice": 69999,
    "rating": 4.8,
    "reviews": 210,
    "students": 1120,
    "liveProjects": 18,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Photoshop",
      "Illustrator",
      "Figma",
      "Canva",
      "Midjourney",
      "Adobe Firefly",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Design Fundamentals & Photoshop",
        "lessons": 16
      },
      {
        "module": "Phase 2",
        "title": "Vector Design with Illustrator",
        "lessons": 16
      },
      {
        "module": "Phase 3",
        "title": "Figma UI/UX & Web Design",
        "lessons": 16
      },
      {
        "module": "Phase 4",
        "title": "Brand Identity & Packaging",
        "lessons": 14
      },
      {
        "module": "Phase 5",
        "title": "Generative AI Design & Portfolio",
        "lessons": 14
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "graphic-design-pro",
    "slug": "graphic-design-professional",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Professional Program",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #0599a8)",
    "name": "Graphic Design Professional",
    "shortDesc": "Photoshop, Illustrator, Canva, Adobe Firefly, Midjourney, ChatGPT & AI Branding tools.",
    "fullDesc": "Comprehensive 3-month program teaching professional visual design skills along with cutting-edge AI design tools like Midjourney, Adobe Firefly, and ChatGPT for rapid concept ideation.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 13999,
    "originalPrice": 39999,
    "rating": 4.7,
    "reviews": 164,
    "students": 890,
    "liveProjects": 10,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Photoshop",
      "Illustrator",
      "Canva",
      "Adobe Firefly",
      "Midjourney",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Visual Design Principles & Photoshop",
        "lessons": 10
      },
      {
        "module": "Module 2",
        "title": "Vector Graphics & Branding",
        "lessons": 10
      },
      {
        "module": "Module 3",
        "title": "AI Design Tools (Midjourney & Firefly)",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "uiux-design-pro",
    "slug": "ui-ux-design-professional",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Professional Program",
    "icon": "🎨",
    "color": "linear-gradient(135deg, #8B5CF6, #EC4899)",
    "name": "UI/UX Design Professional",
    "shortDesc": "In-depth 3-month professional program in Figma UI/UX design, wireframing, interactive prototyping, user research, and Design Systems.",
    "fullDesc": "A complete 3-month professional program for aspiring UI/UX designers. Master Figma, user research, wireframing, visual design systems, usability testing, and interactive prototyping to build job-ready portfolios.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Hybrid",
    "level": "Intermediate",
    "price": 14999,
    "originalPrice": 39999,
    "rating": 4.8,
    "reviews": 115,
    "students": 430,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Figma",
      "Adobe XD",
      "FigJam",
      "Prototyping",
      "Wireframing",
      "Design Systems"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "UX Research & User Personas",
        "lessons": 10
      },
      {
        "module": "Module 2",
        "title": "Wireframing & Information Architecture",
        "lessons": 12
      },
      {
        "module": "Module 3",
        "title": "Figma Visual Design & Auto Layout",
        "lessons": 14
      },
      {
        "module": "Module 4",
        "title": "Interactive Prototyping & Design Systems",
        "lessons": 12
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "adobe-photoshop",
    "slug": "adobe-photoshop",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #2563EB)",
    "name": "Adobe Photoshop",
    "shortDesc": "Master photo editing, manipulation, digital retouching, and AI Generative Fill in Photoshop.",
    "fullDesc": "Learn Adobe Photoshop from scratch: layers, masking, color grading, photo manipulation, poster design, and Adobe Firefly integration.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 195,
    "students": 1280,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Adobe Photoshop",
      "Adobe Firefly"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Photoshop Essentials & Masking",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Photo Manipulation & Generative Fill",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "adobe-illustrator",
    "slug": "adobe-illustrator",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #FF6B00)",
    "name": "Adobe Illustrator",
    "shortDesc": "Create scalable vector graphics, logos, illustrations, typography, and brand assets.",
    "fullDesc": "Master pen tool, vector shaping, color palettes, logo construction, icon design, and typography in Illustrator.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 150,
    "students": 960,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Adobe Illustrator"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Vector Drawing & Pen Tool Mastery",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Logo & Brand Asset Construction",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "canva-pro",
    "slug": "canva-professional",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #0599a8)",
    "name": "Canva Professional",
    "shortDesc": "Create stunning social media graphics, presentations, and marketing collateral with Canva Pro AI.",
    "fullDesc": "Learn fast, professional graphic design using Canva Pro's Magic Studio, brand kits, animation tools, and bulk generation features.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 210,
    "students": 1410,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Canva Pro",
      "Canva Magic Studio"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Canva Pro & Brand Kit Setup",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Magic Studio AI & Video Creation",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "figma-ui-design",
    "slug": "figma-ui-design",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #10B981)",
    "name": "Figma UI Design",
    "shortDesc": "Design interactive web and mobile user interfaces, design systems, and wireframes in Figma.",
    "fullDesc": "Complete guide to Figma: Auto-layout, components, variants, design systems, prototyping, and developer handoff.",
    "duration": "2 Months",
    "durationMonths": 2,
    "mode": "Online",
    "level": "Intermediate",
    "price": 6999,
    "originalPrice": 19999,
    "rating": 4.9,
    "reviews": 180,
    "students": 1150,
    "liveProjects": 5,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Figma",
      "FigJam",
      "Figma AI"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Figma Layouts, Auto-Layout & Components",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Design Systems & Interactive Prototypes",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "trending"
    ],
    "featured": false
  },
  {
    "id": "brand-identity-design",
    "slug": "brand-identity-design",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #F59E0B)",
    "name": "Brand Identity Design",
    "shortDesc": "Craft complete visual brand identities, brand guidelines books, and logo suites for clients.",
    "fullDesc": "Learn color psychology, typography pairing, brand strategy, logo concepts, and professional brand style guide creation.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 94,
    "students": 580,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Illustrator",
      "Photoshop",
      "InDesign"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Brand Strategy & Visual Direction",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Building Brand Style Guides & Assets",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "packaging-design",
    "slug": "packaging-design",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #EF4444)",
    "name": "Packaging Design",
    "shortDesc": "Design 3D print-ready product packaging, dielines, and retail box layouts.",
    "fullDesc": "Master box dielines, pouch packaging, print specifications, CMYK color management, and 3D mockup presentation.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 68,
    "students": 340,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Illustrator",
      "Photoshop",
      "Dimension"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Packaging Dielines & Print Specs",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "3D Mockups & Retail Presentation",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "logo-design",
    "slug": "logo-design",
    "academy": "Design Academy",
    "academyId": "design",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg, #8B5CF6, #75d766)",
    "name": "Logo Design",
    "shortDesc": "Master geometric logo grid alignment, symbol ideation, and vector logo design.",
    "fullDesc": "Learn golden ratio grids, wordmarks, monograms, abstract marks, and professional client delivery packages.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 120,
    "students": 790,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Adobe Illustrator",
      "Midjourney"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Logo Grids & Sketch Execution",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Vector Precision & File Delivery",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "fullstack-foundation",
    "slug": "full-stack-programming-foundation",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Career Program",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #0599a8)",
    "name": "Full Stack Programming Foundation",
    "shortDesc": "HTML/CSS, JavaScript, React, Node.js, Python, SQL, REST APIs, Git & Deployment.",
    "fullDesc": "A complete 6-month software development program for beginners. Build production web apps with React, Node.js, Python, SQL, APIs, and AI coding tools like Cursor.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 29999,
    "originalPrice": 84999,
    "rating": 4.9,
    "reviews": 230,
    "students": 1340,
    "liveProjects": 15,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "SQL",
      "Git",
      "GitHub",
      "Cursor AI"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Web Foundations (HTML, CSS & JS)",
        "lessons": 20
      },
      {
        "module": "Phase 2",
        "title": "Frontend Mastery with React",
        "lessons": 20
      },
      {
        "module": "Phase 3",
        "title": "Backend Development with Node.js & Express",
        "lessons": 18
      },
      {
        "module": "Phase 4",
        "title": "Python & Database Architecture (SQL)",
        "lessons": 16
      },
      {
        "module": "Phase 5",
        "title": "REST APIs, Git & Cloud Deployment",
        "lessons": 14
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "python-developer",
    "slug": "python-developer-professional",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Professional Program",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #75d766)",
    "name": "Python Developer Professional",
    "shortDesc": "Master Python programming, FastAPI, Web Scraping, Automation, Data Structures, and SQL.",
    "fullDesc": "A practical 3-month program covering core Python syntax, OOP, database integrations, API development with FastAPI, and web scraping.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 14999,
    "originalPrice": 39999,
    "rating": 4.8,
    "reviews": 160,
    "students": 920,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "BeautifulSoup",
      "Git",
      "VS Code"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Python Syntax & OOP Basics",
        "lessons": 10
      },
      {
        "module": "Module 2",
        "title": "Databases & SQL Integration",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "FastAPI & Web Scraping Projects",
        "lessons": 10
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "ai-web-dev-pro",
    "slug": "ai-web-development-professional",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Professional Program",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #8B5CF6)",
    "name": "AI Web Development Professional",
    "shortDesc": "Build modern AI-powered web applications with React, Next.js, OpenAI API, and Cursor AI.",
    "fullDesc": "Learn to integrate LLM APIs, vector databases, authentication, and AI code generation into full-stack web applications.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Intermediate",
    "price": 15999,
    "originalPrice": 44999,
    "rating": 4.9,
    "reviews": 145,
    "students": 780,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "React",
      "Next.js",
      "OpenAI API",
      "Pinecone",
      "TailwindCSS",
      "Cursor AI"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Next.js & React Architecture",
        "lessons": 10
      },
      {
        "module": "Module 2",
        "title": "OpenAI API & RAG Vector Integration",
        "lessons": 10
      },
      {
        "module": "Module 3",
        "title": "Deploying Full-Stack AI SaaS",
        "lessons": 8
      }
    ],
    "tags": [
      "trending",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "html-css",
    "slug": "html-css",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #FF6B00)",
    "name": "HTML & CSS",
    "shortDesc": "Build modern, responsive, mobile-friendly websites using semantic HTML5 and CSS3.",
    "fullDesc": "Master flexbox, grid, CSS animations, responsive media queries, and web accessibility standards.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 180,
    "students": 1120,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "HTML5",
      "CSS3",
      "VS Code"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Semantic HTML5 Structure",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "CSS Flexbox, Grid & Responsive Design",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "javascript-cert",
    "slug": "javascript",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #F59E0B)",
    "name": "JavaScript",
    "shortDesc": "Master modern JavaScript (ES6+): DOM manipulation, async/await, fetch API, and promises.",
    "fullDesc": "Core JavaScript programming course covering variables, closures, array methods, async programming, and interactive UI logic.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 210,
    "students": 1400,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "JavaScript ES6+",
      "Chrome DevTools"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "JS Logic & DOM Manipulation",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Async JS, Promises & Fetch API",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "react-cert",
    "slug": "react-javascript",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #0599a8)",
    "name": "React",
    "shortDesc": "Build scalable single-page web applications with React component state, hooks, and context API.",
    "fullDesc": "Learn React hooks (useState, useEffect), custom hooks, routing, component architecture, and state management.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 190,
    "students": 1250,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "React.js",
      "Vite",
      "React Router"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "React Components & State Management",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Hooks, Effects & API Consumption",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "node-js",
    "slug": "node-js",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #75d766)",
    "name": "Node.js",
    "shortDesc": "Build server-side JavaScript applications, Express routing, middleware, and backend microservices.",
    "fullDesc": "Learn backend development with Node.js runtime, Express framework, JWT authentication, and database connectivity.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 140,
    "students": 890,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Postman"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Node Event Loop & Express Servers",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Authentication & Database Integration",
        "lessons": 6
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "sql-basics",
    "slug": "sql-basics",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #EC4899)",
    "name": "SQL Basics",
    "shortDesc": "Master relational database design, SQL queries, JOINs, subqueries, and data management.",
    "fullDesc": "Hands-on database course covering PostgreSQL/MySQL syntax, table schema design, aggregation, and query performance.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 115,
    "students": 720,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "PostgreSQL",
      "pgAdmin",
      "MySQL Workbench"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Relational Schemas & SELECT Queries",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "JOINs, Aggregates & Subqueries",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "git-github",
    "slug": "git-github",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #011731)",
    "name": "Git & GitHub",
    "shortDesc": "Master version control, Git branching, pull requests, merge conflict resolution, and open-source workflows.",
    "fullDesc": "Essential course for developers: Git commits, rebase, branching strategies, GitHub Actions, and team collaboration.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 170,
    "students": 1100,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Git",
      "GitHub",
      "Git CLI"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Version Control & Branching Workflow",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Pull Requests, Merge Conflicts & Actions",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "rest-apis",
    "slug": "rest-apis",
    "academy": "Programming Academy",
    "academyId": "programming",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg, #2563EB, #10B981)",
    "name": "REST APIs",
    "shortDesc": "Design, build, document, and test scalable RESTful web APIs using JSON, HTTP methods, and Postman.",
    "fullDesc": "Learn API design conventions, status codes, authentication tokens (JWT), API rate limiting, and OpenAPI/Swagger docs.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 105,
    "students": 650,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Postman",
      "Swagger",
      "Express",
      "FastAPI"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "REST Architecture & HTTP Methods",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "JWT Auth, Rate Limiting & Swagger Specs",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "ecommerce-mastery",
    "slug": "ecommerce-website-mastery",
    "academy": "No-Code Web Academy",
    "academyId": "nocode",
    "programLevel": "Career Program",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg, #F59E0B, #EF4444)",
    "name": "E-Commerce Website Mastery",
    "shortDesc": "Build & scale high-converting online stores using Shopify, WooCommerce, Webflow & payment gateways.",
    "fullDesc": "A complete 6-month career program in e-commerce web development. Master WordPress, Elementor, WooCommerce, Shopify theme setup, app integrations, payment gateways, and site speed optimization.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 22999,
    "originalPrice": 64999,
    "rating": 4.8,
    "reviews": 164,
    "students": 890,
    "liveProjects": 12,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "WordPress",
      "Elementor",
      "WooCommerce",
      "Shopify",
      "Webflow",
      "Framer",
      "Razorpay"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "WordPress & Elementor Foundations",
        "lessons": 16
      },
      {
        "module": "Phase 2",
        "title": "WooCommerce Store Architecture",
        "lessons": 16
      },
      {
        "module": "Phase 3",
        "title": "Shopify Store Building & Apps",
        "lessons": 16
      },
      {
        "module": "Phase 4",
        "title": "Webflow & Framer Custom Sites",
        "lessons": 14
      },
      {
        "module": "Phase 5",
        "title": "Payment Gateways & Speed Optimisation",
        "lessons": 12
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "nocode-web-pro",
    "slug": "nocode-website-professional",
    "academy": "No-Code Web Academy",
    "academyId": "nocode",
    "programLevel": "Professional Program",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg, #F59E0B, #8B5CF6)",
    "name": "No-Code Website Professional",
    "shortDesc": "Build responsive websites for clients without coding using WordPress, Webflow, Framer, and Elementor.",
    "fullDesc": "A 3-month professional course teaching how to quickly build and deliver client websites, landing pages, and business portals using no-code visual builders.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 12999,
    "originalPrice": 34999,
    "rating": 4.7,
    "reviews": 142,
    "students": 720,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "WordPress",
      "Elementor Pro",
      "Webflow",
      "Framer",
      "Figma"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "WordPress & Elementor Pro",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Webflow CMS & Layout Engine",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Framer Interactive Site Building",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "wordpress-cert",
    "slug": "wordpress",
    "academy": "No-Code Web Academy",
    "academyId": "nocode",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg, #F59E0B, #2563EB)",
    "name": "WordPress",
    "shortDesc": "Master WordPress installation, themes, plugins, security, and site administration.",
    "fullDesc": "Learn complete WordPress site management: hosting setup, theme customization, security hardening, SEO plugins, and backups.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 190,
    "students": 1290,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "WordPress",
      "Yoast SEO",
      "WP Rocket"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "WordPress Core Setup & Themes",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Plugins, Security & Maintenance",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "woocommerce-cert",
    "slug": "woocommerce",
    "academy": "No-Code Web Academy",
    "academyId": "nocode",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg, #F59E0B, #8B5CF6)",
    "name": "WooCommerce",
    "shortDesc": "Build scalable e-commerce online stores on WordPress with payment gateways and shipping rules.",
    "fullDesc": "Set up WooCommerce products, variations, checkout flows, payment gateways (Razorpay/Stripe), and order management.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 110,
    "students": 760,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "WooCommerce",
      "WordPress",
      "Razorpay"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "WooCommerce Product & Store Setup",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Payment Gateways & Shipping Automation",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "shopify-cert",
    "slug": "shopify",
    "academy": "No-Code Web Academy",
    "academyId": "nocode",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg, #F59E0B, #75d766)",
    "name": "Shopify",
    "shortDesc": "Launch e-commerce stores on Shopify: theme customization, app store, and conversion tracking.",
    "fullDesc": "Step-by-step Shopify store setup, product uploading, liquid theme tweaking, app integrations, and conversion rate optimization.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 210,
    "students": 1380,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Shopify",
      "Klaviyo",
      "Loox Reviews"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Shopify Store Setup & Themes",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "E-Commerce Apps & High-Converting Checkout",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "elementor-cert",
    "slug": "elementor",
    "academy": "No-Code Web Academy",
    "academyId": "nocode",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg, #F59E0B, #EC4899)",
    "name": "Elementor",
    "shortDesc": "Build custom WordPress pages using Elementor drag-and-drop builder, theme builder, and popups.",
    "fullDesc": "Master Elementor Pro: header/footer builders, dynamic tags, motion effects, popup forms, and responsive visual design.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 160,
    "students": 990,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Elementor Pro",
      "WordPress"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Elementor Visual Design & Widgets",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Theme Builder & Dynamic Content",
        "lessons": 6
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "webflow-cert",
    "slug": "webflow",
    "academy": "No-Code Web Academy",
    "academyId": "nocode",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg, #F59E0B, #2563EB)",
    "name": "Webflow",
    "shortDesc": "Build clean, production-grade custom websites with Webflow visual CSS grid, flexbox, and CMS.",
    "fullDesc": "Learn Webflow boxed layout model, CMS collections, interactions, micro-animations, and client handoff.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 130,
    "students": 820,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Webflow",
      "Webflow CMS"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Webflow CSS Box Model & Layout",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "CMS Collections & Interactions",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "framer-cert",
    "slug": "framer",
    "academy": "No-Code Web Academy",
    "academyId": "nocode",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg, #F59E0B, #0599a8)",
    "name": "Framer",
    "shortDesc": "Design and publish animated websites directly from Figma concepts using Framer.",
    "fullDesc": "Learn Framer visual builder, spring animations, scroll effects, component variants, and instant publishing.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 115,
    "students": 710,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Framer",
      "Figma"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Framer Canvas & Figma Import",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Animations, Components & Hosting",
        "lessons": 5
      }
    ],
    "tags": [
      "trending"
    ],
    "featured": false
  },
  {
    "id": "motion-mastery",
    "slug": "motion-graphics-master",
    "academy": "Video & Motion Academy",
    "academyId": "video",
    "programLevel": "Career Program",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg, #EF4444, #F97316)",
    "name": "Motion Graphics Master",
    "shortDesc": "Premiere Pro, After Effects, DaVinci Resolve, Motion Graphics, 3D Animation & AI Video tools.",
    "fullDesc": "A comprehensive 6-month career program in professional video editing, color grading, motion graphics, visual effects, and AI video creation tools.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 26999,
    "originalPrice": 74999,
    "rating": 4.9,
    "reviews": 188,
    "students": 960,
    "liveProjects": 16,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Premiere Pro",
      "After Effects",
      "DaVinci Resolve",
      "Audition",
      "Runway Gen-2",
      "Kling",
      "Veo",
      "ElevenLabs"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Video Editing Fundamentals (Premiere Pro)",
        "lessons": 16
      },
      {
        "module": "Phase 2",
        "title": "Motion Graphics & VFX (After Effects)",
        "lessons": 16
      },
      {
        "module": "Phase 3",
        "title": "Color Grading & Audio (DaVinci Resolve)",
        "lessons": 14
      },
      {
        "module": "Phase 4",
        "title": "Reels & Short Form Video Strategy",
        "lessons": 12
      },
      {
        "module": "Phase 5",
        "title": "Generative AI Video Workflows",
        "lessons": 12
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "video-pro",
    "slug": "professional-video-editing",
    "academy": "Video & Motion Academy",
    "academyId": "video",
    "programLevel": "Professional Program",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg, #EF4444, #8B5CF6)",
    "name": "Professional Video Editing",
    "shortDesc": "Premiere Pro, After Effects, Runway, Kling, Veo, AI Voice, AI Subtitles & commercial edits.",
    "fullDesc": "A 3-month professional course teaching industry-standard timeline editing in Premiere Pro, After Effects motion graphics, and modern generative AI video creation tools.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 13999,
    "originalPrice": 39999,
    "rating": 4.8,
    "reviews": 172,
    "students": 840,
    "liveProjects": 10,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Premiere Pro",
      "After Effects",
      "Runway",
      "Kling",
      "Veo",
      "ElevenLabs",
      "CapCut"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Premiere Pro Timeline & Cutting",
        "lessons": 10
      },
      {
        "module": "Module 2",
        "title": "After Effects Motion Essentials",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "AI Video Tools & Sound Design",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "ai-video-pro",
    "slug": "ai-video-editing-professional",
    "academy": "Video & Motion Academy",
    "academyId": "video",
    "programLevel": "Professional Program",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg, #EF4444, #75d766)",
    "name": "AI Video Editing Professional",
    "shortDesc": "Create commercial AI video ads, synthetic avatars, automated subtitles, and generative video clips.",
    "fullDesc": "3-month specialized program in AI video production using Runway, Sora, Kling, HeyGen, Midjourney, and ElevenLabs.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Intermediate",
    "price": 14999,
    "originalPrice": 42999,
    "rating": 4.9,
    "reviews": 135,
    "students": 690,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Runway Gen-3",
      "Kling AI",
      "HeyGen",
      "ElevenLabs",
      "CapCut Desktop"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Generative Text-to-Video Pipelines",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "AI Avatars & Voice Cloning",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Commercial Ad Production Workflows",
        "lessons": 8
      }
    ],
    "tags": [
      "trending",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "adobe-premiere-pro",
    "slug": "adobe-premiere-pro",
    "academy": "Video & Motion Academy",
    "academyId": "video",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg, #EF4444, #2563EB)",
    "name": "Adobe Premiere Pro",
    "shortDesc": "Master video cutting, audio mixing, Lumetri color grading, and speed ramping in Premiere Pro.",
    "fullDesc": "Complete hands-on Premiere Pro course covering multi-cam editing, audio cleaning, transitions, and export settings.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 195,
    "students": 1240,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Adobe Premiere Pro",
      "Media Encoder"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Timeline Editing & Cutting Techniques",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Lumetri Color Grading & Audio Mixing",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "after-effects",
    "slug": "after-effects",
    "academy": "Video & Motion Academy",
    "academyId": "video",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg, #EF4444, #8B5CF6)",
    "name": "After Effects",
    "shortDesc": "Create motion graphics, kinetic typography, lower thirds, and visual effects in After Effects.",
    "fullDesc": "Learn keyframe animation, graph editor, shape layers, compositing, chroma keying, and expressions.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 180,
    "students": 1150,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Adobe After Effects"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Keyframe Animation & Graph Editor",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Kinetic Typography & VFX Compositing",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "davinci-resolve",
    "slug": "davinci-resolve",
    "academy": "Video & Motion Academy",
    "academyId": "video",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg, #EF4444, #0599a8)",
    "name": "DaVinci Resolve",
    "shortDesc": "Master hollywood-grade color grading, node-based editing, and Fairlight audio in DaVinci Resolve.",
    "fullDesc": "Complete training in DaVinci Resolve color wheels, curves, LUTs, tracking, node trees, and Fairlight audio post.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 140,
    "students": 820,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "DaVinci Resolve"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Color Wheels, Curves & LUT Management",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Node Trees, Tracking & Fairlight Audio",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "reels-editing",
    "slug": "reels-editing",
    "academy": "Video & Motion Academy",
    "academyId": "video",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg, #EF4444, #EC4899)",
    "name": "Reels Editing",
    "shortDesc": "Edit high-retention Instagram Reels, YouTube Shorts, and TikTok videos with CapCut & Premiere.",
    "fullDesc": "Learn fast-paced hook editing, auto-captions, sound effects, trending transitions, and short-form pacing.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 230,
    "students": 1520,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "CapCut Desktop",
      "Premiere Pro",
      "AutoCap"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Hook Pacing & Auto-Captions",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Sound FX, Zoom Cuts & Trending Edits",
        "lessons": 5
      }
    ],
    "tags": [
      "popular",
      "trending"
    ],
    "featured": false
  },
  {
    "id": "motion-graphics-essentials",
    "slug": "motion-graphics-essentials",
    "academy": "Video & Motion Academy",
    "academyId": "video",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg, #EF4444, #F59E0B)",
    "name": "Motion Graphics Essentials",
    "shortDesc": "Learn principles of motion: easing, timing, anticipation, and logo reveal animation.",
    "fullDesc": "Essential motion design concepts covering 12 principles of animation applied to UI/UX and commercial motion graphics.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 95,
    "students": 610,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "After Effects",
      "LottieFiles"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Animation Principles & Easing",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Logo Reveals & UI Motion",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "archviz-mastery",
    "slug": "architectural-visualisation-master",
    "academy": "3D Academy",
    "academyId": "3d",
    "programLevel": "Career Program",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg, #10B981, #059669)",
    "name": "Architectural Visualisation Master",
    "shortDesc": "3ds Max, Blender, V-Ray, Corona, Twinmotion, Unreal Engine architectural rendering.",
    "fullDesc": "A complete 6-month career program in 3D architectural visualization. Master 3ds Max, Blender, V-Ray lighting, photorealistic textures, walkthrough animation, and Unreal Engine real-time rendering.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 28999,
    "originalPrice": 79999,
    "rating": 4.9,
    "reviews": 142,
    "students": 710,
    "liveProjects": 12,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "3ds Max",
      "Blender",
      "V-Ray",
      "Twinmotion",
      "Unreal Engine 5",
      "Photoshop"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "3D Modeling & Box Modeling (3ds Max)",
        "lessons": 16
      },
      {
        "module": "Phase 2",
        "title": "Architectural Lighting & Materials (V-Ray)",
        "lessons": 16
      },
      {
        "module": "Phase 3",
        "title": "Interior & Exterior Photorealism",
        "lessons": 14
      },
      {
        "module": "Phase 4",
        "title": "Twinmotion & Real-Time Walkthroughs",
        "lessons": 12
      },
      {
        "module": "Phase 5",
        "title": "Unreal Engine 5 ArchViz",
        "lessons": 12
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "3d-viz-pro",
    "slug": "3d-visualisation-professional",
    "academy": "3D Academy",
    "academyId": "3d",
    "programLevel": "Professional Program",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg, #10B981, #2563EB)",
    "name": "3D Visualisation Professional",
    "shortDesc": "3-month professional course covering 3D product rendering, lighting, materials, and Blender.",
    "fullDesc": "Learn professional 3D asset modeling, studio product lighting, realistic PBR materials, and camera rendering in 3ds Max and Blender.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 14999,
    "originalPrice": 39999,
    "rating": 4.8,
    "reviews": 110,
    "students": 540,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "3ds Max",
      "Blender",
      "V-Ray",
      "Substance Painter"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "3D Poly Modeling & Mesh Topology",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "PBR Materials & Studio Lighting",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Rendering & Post-Production",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "blender-cert",
    "slug": "blender",
    "academy": "3D Academy",
    "academyId": "3d",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg, #10B981, #FF6B00)",
    "name": "Blender",
    "shortDesc": "Master free open-source 3D modeling, sculpting, Cycles rendering, and animation in Blender.",
    "fullDesc": "Complete beginner-to-pro guide in Blender: mesh modeling, geometry nodes, sculpting, shading, and Cycles rendering.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 190,
    "students": 1180,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Blender 4.x",
      "Cycles Engine"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Blender Interface & Mesh Modeling",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Shading, Lighting & Cycles Render",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "3ds-max-cert",
    "slug": "3ds-max",
    "academy": "3D Academy",
    "academyId": "3d",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg, #10B981, #8B5CF6)",
    "name": "3ds Max",
    "shortDesc": "Master Autodesk 3ds Max for precision architectural modeling, CAD imports, and box modeling.",
    "fullDesc": "Learn industry-standard 3ds Max spline modeling, poly editing, modifier stack, CAD file imports, and scene management.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 130,
    "students": 790,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Autodesk 3ds Max",
      "AutoCAD"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "CAD Import & Poly Modeling",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Scene Assembly & Modifiers",
        "lessons": 6
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "v-ray-cert",
    "slug": "v-ray",
    "academy": "3D Academy",
    "academyId": "3d",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg, #10B981, #0599a8)",
    "name": "V-Ray",
    "shortDesc": "Master Chaos V-Ray photorealistic GI lighting, materials, displacement, and render setups.",
    "fullDesc": "Learn V-Ray sun/sky setups, HDRI dome lighting, realistic glass/wood/metal shaders, and render element passes.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 110,
    "students": 670,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Chaos V-Ray",
      "Photoshop"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "V-Ray Sun, HDRI & GI Lighting",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Photorealistic Shaders & Render Passes",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "twinmotion-cert",
    "slug": "twinmotion",
    "academy": "3D Academy",
    "academyId": "3d",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg, #10B981, #75d766)",
    "name": "Twinmotion",
    "shortDesc": "Create real-time architectural walkthrough videos and VR presentations in Twinmotion.",
    "fullDesc": "Master Twinmotion live-sync, weather effects, vegetation scatter, animated characters, and 4K video walkthrough rendering.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.8,
    "reviews": 90,
    "students": 520,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Twinmotion",
      "Revit",
      "SketchUp"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Model Import & Environment Setup",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Camera Walkthroughs & 4K Video Export",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "cinema-4d-cert",
    "slug": "cinema-4d",
    "academy": "3D Academy",
    "academyId": "3d",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg, #10B981, #EC4899)",
    "name": "Cinema 4D",
    "shortDesc": "Master Maxon Cinema 4D MoGraph tools, dynamics, and 3D motion design.",
    "fullDesc": "Learn C4D cloners, effectors, rigid body dynamics, Redshift renderer, and 3D broadcast graphics.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Intermediate",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.7,
    "reviews": 85,
    "students": 490,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Cinema 4D",
      "Redshift"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "MoGraph Cloners & Effectors",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Dynamics & 3D Motion Graphics",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "unreal-engine-basics",
    "slug": "unreal-engine-basics",
    "academy": "3D Academy",
    "academyId": "3d",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg, #10B981, #2563EB)",
    "name": "Unreal Engine Basics",
    "shortDesc": "Learn real-time 3D environments, Lumen global illumination, and Nanite geometry in Unreal Engine 5.",
    "fullDesc": "Get started with Unreal Engine 5: project setup, Quixel Megascans, Lumen lighting, Blueprint basics, and movie render queue.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 4999,
    "originalPrice": 14999,
    "rating": 4.9,
    "reviews": 130,
    "students": 810,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Unreal Engine 5",
      "Quixel Bridge"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "UE5 Interface, Lumen & Nanite",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Environment Lighting & Cinematic Render",
        "lessons": 6
      }
    ],
    "tags": [
      "trending"
    ],
    "featured": false
  },
  {
    "id": "freelancing-mastery",
    "slug": "freelancing-mastery",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Career Program",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #0599a8)",
    "name": "Freelancing Mastery",
    "shortDesc": "Earn $1,000+/month on Fiverr, Upwork & direct client acquisition. Profile design, proposals & pricing.",
    "fullDesc": "Complete 6-month career program in building a sustainable freelance career and digital agency. Master Fiverr, Upwork, LinkedIn client acquisition, proposal writing, pricing strategy, contracts, and agency scaling.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Online",
    "level": "Beginner",
    "price": 18999,
    "originalPrice": 49999,
    "rating": 4.9,
    "reviews": 210,
    "students": 1350,
    "liveProjects": 10,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Fiverr",
      "Upwork",
      "LinkedIn",
      "Notion",
      "Calendly",
      "Razorpay",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Freelance Mindset & High-Ticket Niche Selection",
        "lessons": 10
      },
      {
        "module": "Phase 2",
        "title": "Fiverr & Upwork Top-Rated Profile Setup",
        "lessons": 12
      },
      {
        "module": "Phase 3",
        "title": "Winning Proposal Writing & Cold Outreach",
        "lessons": 12
      },
      {
        "module": "Phase 4",
        "title": "Client Communication & Contract Management",
        "lessons": 10
      },
      {
        "module": "Phase 5",
        "title": "Scaling into a Digital Agency",
        "lessons": 10
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement",
      "trending"
    ],
    "featured": true
  },
  {
    "id": "career-launch",
    "slug": "career-launch-program",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Professional Program",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #75d766)",
    "name": "Career Launch Program",
    "shortDesc": "Resume Building, LinkedIn Optimisation, Portfolio, Interview Prep & Job Search strategy.",
    "fullDesc": "A 3-month intensive professional program for fresh graduates and job seekers \u2014 covering ATS resume writing, LinkedIn personal branding, portfolio creation, mock interviews, and placement strategies.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 9099,
    "originalPrice": 24999,
    "rating": 4.8,
    "reviews": 176,
    "students": 1240,
    "liveProjects": 6,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "LinkedIn",
      "Canva",
      "Grammarly",
      "Notion",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "ATS Resume Building & Cover Letters",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "LinkedIn Optimization & Networking",
        "lessons": 6
      },
      {
        "module": "Module 3",
        "title": "Portfolio Development & Case Studies",
        "lessons": 6
      },
      {
        "module": "Module 4",
        "title": "Mock Interviews & Salary Negotiation",
        "lessons": 6
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "resume-building",
    "slug": "resume-building",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #2563EB)",
    "name": "Resume Building",
    "shortDesc": "Build high-scoring ATS-friendly resumes and cover letters using proven frameworks.",
    "fullDesc": "Learn how to format resumes for ATS screeners, highlight quantifiable achievements, and tailor resumes for specific job descriptions.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 150,
    "students": 980,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Canva",
      "ChatGPT",
      "Overleaf"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "ATS Optimization & Action Verbs",
        "lessons": 4
      },
      {
        "module": "Module 2",
        "title": "Cover Letter Writing & Tailoring",
        "lessons": 4
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "linkedin-optimisation",
    "slug": "linkedin-optimisation",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #0599a8)",
    "name": "LinkedIn Optimisation",
    "shortDesc": "Optimize your LinkedIn headline, summary, featured section, and inbound recruiter outreach.",
    "fullDesc": "Master LinkedIn personal branding: profile keyword indexing, banner design, content posting, and messaging recruiters.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 190,
    "students": 1320,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "LinkedIn",
      "Canva",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Headline, Summary & Visual Branding",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Recruiter Inbound Strategy & Outreach",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "interview-preparation",
    "slug": "interview-preparation",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #8B5CF6)",
    "name": "Interview Preparation",
    "shortDesc": "Master STAR method answers, technical interviews, behavioral rounds, and salary negotiation.",
    "fullDesc": "Learn behavioral interview techniques, mock interview drills, handling tricky questions, and negotiating job offers.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 130,
    "students": 840,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Zoom",
      "ChatGPT Mock Interviewer"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "STAR Technique & Core Behavioral Q&A",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Technical Round Prep & Offer Negotiation",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "client-communication",
    "slug": "client-communication",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #F59E0B)",
    "name": "Client Communication",
    "shortDesc": "Conduct discovery calls, manage client expectations, and build long-term retention.",
    "fullDesc": "Master client onboarding, email etiquette, boundary setting, handling scope creep, and reporting progress.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.7,
    "reviews": 95,
    "students": 620,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Loom",
      "Calendly",
      "Slack"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Discovery Calls & Onboarding",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Managing Scope Creep & Retention",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "proposal-writing",
    "slug": "proposal-writing",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #EF4444)",
    "name": "Proposal Writing",
    "shortDesc": "Write high-converting client proposals, project scopes, and pricing estimates that win bids.",
    "fullDesc": "Learn problem-agitation-solution proposal frameworks, custom video audits, and pricing options.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 110,
    "students": 710,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Notion",
      "PandaDoc",
      "Loom"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "High-Converting Proposal Structures",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Loom Video Audits & Value Pricing",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "agency-building",
    "slug": "agency-building",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #10B981)",
    "name": "Agency Building",
    "shortDesc": "Scale from solo freelancer to a boutique digital agency: hiring contractors, SOPs & retainers.",
    "fullDesc": "Learn how to build standard operating procedures (SOPs), hire sub-contractors, productize services, and sign monthly retainers.",
    "duration": "2 Months",
    "durationMonths": 2,
    "mode": "Online",
    "level": "Intermediate",
    "price": 6999,
    "originalPrice": 19999,
    "rating": 4.9,
    "reviews": 85,
    "students": 510,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "ClickUp",
      "Notion",
      "Stripe",
      "Deel"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Productizing Services & SOP Creation",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Hiring Contractors & Retainer Contracts",
        "lessons": 6
      }
    ],
    "tags": [
      "trending"
    ],
    "featured": false
  },
  {
    "id": "fiverr-success",
    "slug": "fiverr-success",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #75d766)",
    "name": "Fiverr Success",
    "shortDesc": "Rank Gig listings on page 1, earn Top Rated Seller status, and automate gig fulfillment.",
    "fullDesc": "Complete Fiverr masterclass: gig keyword research, thumbnail design, pricing packages, secret algorithm ranking factors, and fast delivery techniques.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 240,
    "students": 1580,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Fiverr Seller Hub",
      "Canva",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Gig SEO & Keyword Indexing",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Order Fulfillment & 5-Star Review Strategy",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "upwork-success",
    "slug": "upwork-success",
    "academy": "Career & Freelancing Academy",
    "academyId": "career",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg, #011731, #FF6B00)",
    "name": "Upwork Success",
    "shortDesc": "Win high-paying hourly and fixed-price jobs on Upwork: Top Rated profile, Connects optimization.",
    "fullDesc": "Learn Upwork profile specialized setup, searching for ideal clients, submitting proposals that get opened, and earning Top Rated status.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 195,
    "students": 1290,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Upwork",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Upwork Specialized Profile Setup",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Connects Strategy & Proposal Execution",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "business-english",
    "slug": "business-english-personality-development",
    "academy": "Communication Academy",
    "academyId": "communication",
    "programLevel": "Career Program",
    "icon": "\ud83d\udcac",
    "color": "linear-gradient(135deg, #75d766, #011731)",
    "name": "Business English & Personality Development",
    "shortDesc": "Spoken English, Business Writing, Public Speaking, Executive Presence & Soft Skills.",
    "fullDesc": "A complete 6-month career program designed to build fluent spoken English, professional writing skills, public speaking confidence, body language, and corporate etiquette.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 14999,
    "originalPrice": 39999,
    "rating": 4.9,
    "reviews": 240,
    "students": 1480,
    "liveProjects": 12,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "Grammarly",
      "ELSA Speak",
      "ChatGPT",
      "Zoom"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Fluency & Vocabulary Building",
        "lessons": 16
      },
      {
        "module": "Phase 2",
        "title": "Grammar & Professional Sentence Construction",
        "lessons": 16
      },
      {
        "module": "Phase 3",
        "title": "Corporate Email & Written Communication",
        "lessons": 14
      },
      {
        "module": "Phase 4",
        "title": "Public Speaking & Presentation Skills",
        "lessons": 14
      },
      {
        "module": "Phase 5",
        "title": "Personality Development & Executive Presence",
        "lessons": 12
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "spoken-english-pro",
    "slug": "professional-spoken-english",
    "academy": "Communication Academy",
    "academyId": "communication",
    "programLevel": "Professional Program",
    "icon": "\ud83d\udcac",
    "color": "linear-gradient(135deg, #75d766, #0599a8)",
    "name": "Professional Spoken English",
    "shortDesc": "Speak English fluently and confidently in workplace meetings, interviews, and presentations.",
    "fullDesc": "3-month practical course focusing on accent neutralization, daily conversation drills, meeting participation, and overcoming hesitation.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 8999,
    "originalPrice": 22999,
    "rating": 4.8,
    "reviews": 190,
    "students": 1150,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "ELSA Speak",
      "Grammarly",
      "ChatGPT"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Overcoming Hesitation & Accent Basics",
        "lessons": 10
      },
      {
        "module": "Module 2",
        "title": "Workplace Vocabulary & Conversation Drills",
        "lessons": 10
      },
      {
        "module": "Module 3",
        "title": "Live Roleplay & Meeting Simulation",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "spoken-english-cert",
    "slug": "spoken-english",
    "academy": "Communication Academy",
    "academyId": "communication",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcac",
    "color": "linear-gradient(135deg, #75d766, #2563EB)",
    "name": "Spoken English",
    "shortDesc": "Build everyday English speaking confidence, vocabulary, and correct pronunciation.",
    "fullDesc": "1-month foundational speaking course covering daily conversation phrases, listening comprehension, and pronunciation.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 160,
    "students": 980,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "ELSA Speak",
      "Grammarly"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Daily Vocabulary & Conversation Starters",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Pronunciation & Sentence Building",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "business-communication",
    "slug": "business-communication",
    "academy": "Communication Academy",
    "academyId": "communication",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcac",
    "color": "linear-gradient(135deg, #75d766, #8B5CF6)",
    "name": "Business Communication",
    "shortDesc": "Write professional emails, reports, proposals, and lead clear workplace communications.",
    "fullDesc": "Learn corporate email etiquette, slack communication, report writing, and stakeholder alignment.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.7,
    "reviews": 120,
    "students": 740,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Grammarly",
      "ChatGPT",
      "Notion"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Corporate Email Etiquette & Formatting",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Report Writing & Internal Communication",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "presentation-skills",
    "slug": "presentation-skills",
    "academy": "Communication Academy",
    "academyId": "communication",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcac",
    "color": "linear-gradient(135deg, #75d766, #FF6B00)",
    "name": "Presentation Skills",
    "shortDesc": "Deliver engaging slide decks, pitch ideas convincingly, and handle Q&A sessions smoothly.",
    "fullDesc": "Master slide structuring, visual storytelling, body posture, voice modulation, and audience Q&A.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 90,
    "students": 560,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "PowerPoint",
      "Canva",
      "Pitch"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Slide Storytelling & Structure",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Delivery, Body Language & Q&A Management",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "public-speaking",
    "slug": "public-speaking",
    "academy": "Communication Academy",
    "academyId": "communication",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcac",
    "color": "linear-gradient(135deg, #75d766, #EF4444)",
    "name": "Public Speaking",
    "shortDesc": "Overcome stage fright, command attention, and speak with impact on stage or video.",
    "fullDesc": "Learn speech structuring, opening hooks, vocal variety, posture control, and overcoming stage anxiety.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 115,
    "students": 690,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Teleprompter",
      "Zoom"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Overcoming Stage Anxiety & Speech Hooks",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Vocal Dynamics & Audience Connection",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "soft-skills",
    "slug": "soft-skills",
    "academy": "Communication Academy",
    "academyId": "communication",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udcac",
    "color": "linear-gradient(135deg, #75d766, #F59E0B)",
    "name": "Soft Skills",
    "shortDesc": "Develop emotional intelligence, teamwork, conflict resolution, and problem-solving.",
    "fullDesc": "Essential interpersonal skills course covering workplace empathy, active listening, time management, and adaptability.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.7,
    "reviews": 80,
    "students": 490,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Mindmeister",
      "Trello"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Emotional Intelligence & Active Listening",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Conflict Resolution & Teamwork",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "kids-mastery",
    "slug": "future-tech-kids-mastery",
    "academy": "Kids Tech Academy",
    "academyId": "kids",
    "programLevel": "Career Program",
    "icon": "\ud83d\udc68\u200d\ud83d\udcbb",
    "color": "linear-gradient(135deg, #EC4899, #8B5CF6)",
    "name": "Future Tech Kids Mastery",
    "shortDesc": "Scratch Block Coding, Python for Kids, AI Basics, Web Design & Game Development.",
    "fullDesc": "A complete 6-month foundational tech program for young learners (ages 8\u201316). Kids build games in Scratch, code Python programs, explore AI tools, and design personal websites.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Online",
    "level": "Beginner",
    "price": 19999,
    "originalPrice": 49999,
    "rating": 4.9,
    "reviews": 160,
    "students": 840,
    "liveProjects": 15,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Scratch",
      "Python IDLE",
      "MIT App Inventor",
      "HTML/CSS",
      "Teachable Machine"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Block Coding & Logic (Scratch)",
        "lessons": 16
      },
      {
        "module": "Phase 2",
        "title": "Python Programming Fundamentals",
        "lessons": 16
      },
      {
        "module": "Phase 3",
        "title": "Web Design & HTML Basics",
        "lessons": 14
      },
      {
        "module": "Phase 4",
        "title": "AI & Robotics Concepts for Kids",
        "lessons": 14
      }
    ],
    "tags": [
      "bestseller",
      "popular"
    ],
    "featured": true
  },
  {
    "id": "young-coders",
    "slug": "young-coders-program",
    "academy": "Kids Tech Academy",
    "academyId": "kids",
    "programLevel": "Professional Program",
    "icon": "\ud83d\udc68\u200d\ud83d\udcbb",
    "color": "linear-gradient(135deg, #EC4899, #2563EB)",
    "name": "Young Coders Program",
    "shortDesc": "3-month coding program teaching children Python, logic building, and game creation.",
    "fullDesc": "A hands-on 3-month course for kids to transition from visual blocks to text-based Python code and build mini games.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 11999,
    "originalPrice": 29999,
    "rating": 4.8,
    "reviews": 110,
    "students": 590,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Scratch",
      "Python",
      "Replit"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Logic Building & Scratch Games",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Text Coding with Python",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Interactive Game Project",
        "lessons": 8
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "scratch-programming",
    "slug": "scratch-programming",
    "academy": "Kids Tech Academy",
    "academyId": "kids",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udc68\u200d\ud83d\udcbb",
    "color": "linear-gradient(135deg, #EC4899, #FF6B00)",
    "name": "Scratch Programming",
    "shortDesc": "Learn visual drag-and-drop block coding, animation, and game creation in MIT Scratch.",
    "fullDesc": "Fun 1-month course for kids (ages 7-12) to learn loops, conditionals, sprites, and build retro games.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 190,
    "students": 1120,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "MIT Scratch 3.0"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Sprites, Animation & Sounds",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Variables, Scorekeeping & Game Physics",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "python-for-kids",
    "slug": "python-for-kids",
    "academy": "Kids Tech Academy",
    "academyId": "kids",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udc68\u200d\ud83d\udcbb",
    "color": "linear-gradient(135deg, #EC4899, #75d766)",
    "name": "Python for Kids",
    "shortDesc": "Introduce kids to text-based Python programming with Turtle graphics and fun exercises.",
    "fullDesc": "Learn Python variables, loops, functions, and draw cool shapes with Python Turtle graphics.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 140,
    "students": 810,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Python Turtle",
      "Thonny IDE"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Python Syntax & Turtle Art",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Loops, If Statements & Quiz Games",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "ai-for-kids",
    "slug": "ai-for-kids",
    "academy": "Kids Tech Academy",
    "academyId": "kids",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udc68\u200d\ud83d\udcbb",
    "color": "linear-gradient(135deg, #EC4899, #0599a8)",
    "name": "AI for Kids",
    "shortDesc": "Discover how artificial intelligence works with fun machine learning models and image recognition.",
    "fullDesc": "Kids train simple AI models using Google Teachable Machine to recognize images, sounds, and poses.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 160,
    "students": 930,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Teachable Machine",
      "Scratch AI"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Training Image & Sound AI Models",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Connecting AI Models to Scratch Games",
        "lessons": 5
      }
    ],
    "tags": [
      "trending"
    ],
    "featured": false
  },
  {
    "id": "robotics-basics",
    "slug": "robotics-basics",
    "academy": "Kids Tech Academy",
    "academyId": "kids",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udc68\u200d\ud83d\udcbb",
    "color": "linear-gradient(135deg, #EC4899, #F59E0B)",
    "name": "Robotics Basics",
    "shortDesc": "Learn circuits, sensors, and micro:bit / Tinkercad virtual robotics simulation.",
    "fullDesc": "Explore virtual electronics, LED circuits, ultrasonic distance sensors, and micro:bit block programming.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.7,
    "reviews": 95,
    "students": 540,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Tinkercad Circuits",
      "micro:bit"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Circuits & Virtual Components",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Sensors & Microcontroller Code",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "web-design-for-kids",
    "slug": "web-design-for-kids",
    "academy": "Kids Tech Academy",
    "academyId": "kids",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udc68\u200d\ud83d\udcbb",
    "color": "linear-gradient(135deg, #EC4899, #10B981)",
    "name": "Web Design for Kids",
    "shortDesc": "Teach kids how to build and customize their very first personal website using HTML & CSS.",
    "fullDesc": "Learn web tags, colors, fonts, images, and publish a personal blog or hobby page online.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 110,
    "students": 670,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "HTML5",
      "CSS3",
      "Replit"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "HTML Tags, Headings & Images",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "CSS Styling, Colors & Publishing",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "youtube-mastery",
    "slug": "youtube-growth-mastery",
    "academy": "Creator Academy",
    "academyId": "creator",
    "programLevel": "Career Program",
    "icon": "\ud83c\udfa5",
    "color": "linear-gradient(135deg, #FF6B00, #EC4899)",
    "name": "YouTube Growth Mastery",
    "shortDesc": "Channel Strategy, Scripting, Filming, Editing, SEO, Thumbnails & Monetisation.",
    "fullDesc": "A complete 6-month career program for content creators and YouTubers. Master content strategy, scripting, camera setup, editing, thumbnail CTR, YouTube algorithm SEO, and brand sponsorship monetization.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 19999,
    "originalPrice": 54999,
    "rating": 4.9,
    "reviews": 195,
    "students": 1020,
    "liveProjects": 12,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "YouTube Studio",
      "VidIQ",
      "Premiere Pro",
      "Photoshop",
      "OBS Studio",
      "CapCut"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Niche Research & Channel Branding",
        "lessons": 12
      },
      {
        "module": "Phase 2",
        "title": "Scriptwriting & On-Camera Confidence",
        "lessons": 14
      },
      {
        "module": "Phase 3",
        "title": "High-CTR Thumbnails & Video Editing",
        "lessons": 16
      },
      {
        "module": "Phase 4",
        "title": "YouTube Algorithm, SEO & Analytics",
        "lessons": 14
      },
      {
        "module": "Phase 5",
        "title": "Monetisation, Brand Deals & Sponsorships",
        "lessons": 12
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "content-creator-pro",
    "slug": "content-creator-professional",
    "academy": "Creator Academy",
    "academyId": "creator",
    "programLevel": "Professional Program",
    "icon": "\ud83c\udfa5",
    "color": "linear-gradient(135deg, #FF6B00, #8B5CF6)",
    "name": "Content Creator Professional",
    "shortDesc": "3-month program covering video creation, short-form Reels, podcasting, and personal branding.",
    "fullDesc": "Learn end-to-end multi-platform content creation across YouTube, Instagram, LinkedIn, and Spotify Podcasts.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 11999,
    "originalPrice": 29999,
    "rating": 4.8,
    "reviews": 140,
    "students": 710,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "CapCut",
      "Canva Pro",
      "Descript",
      "YouTube Studio"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Multi-Platform Content Strategy",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Short-Form Video Production",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Audience Building & Personal Brand",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "youtube-seo",
    "slug": "youtube-seo",
    "academy": "Creator Academy",
    "academyId": "creator",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa5",
    "color": "linear-gradient(135deg, #FF6B00, #2563EB)",
    "name": "YouTube SEO",
    "shortDesc": "Rank YouTube videos at the top of search results and suggested video recommendations.",
    "fullDesc": "Learn VidIQ/TubeBuddy keyword optimization, title writing, tags, description formatting, and playlist indexing.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 160,
    "students": 980,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "VidIQ",
      "TubeBuddy",
      "YouTube Studio"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Video Keyword Research & Titles",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Tags, Descriptions & Suggested Traffic",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "thumbnail-design",
    "slug": "thumbnail-design",
    "academy": "Creator Academy",
    "academyId": "creator",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa5",
    "color": "linear-gradient(135deg, #FF6B00, #F59E0B)",
    "name": "Thumbnail Design",
    "shortDesc": "Design high-CTR YouTube thumbnails using Photoshop, Canva Pro, and AI image generation.",
    "fullDesc": "Learn color contrast, face expressions, bold typography, glowing effects, and CTR A/B testing for thumbnails.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 210,
    "students": 1340,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Photoshop",
      "Canva Pro",
      "Midjourney"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "CTR Psychology & Thumbnail Grids",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Photoshop Effects & A/B Testing",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "podcast-production",
    "slug": "podcast-production",
    "academy": "Creator Academy",
    "academyId": "creator",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa5",
    "color": "linear-gradient(135deg, #FF6B00, #75d766)",
    "name": "Podcast Production",
    "shortDesc": "Record, edit, host, and distribute audio and video podcasts on Spotify and Apple Podcasts.",
    "fullDesc": "Learn mic selection, audio noise removal, Descript editing, RSS feed setup, and Spotify/Apple publishing.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.7,
    "reviews": 90,
    "students": 540,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Audacity",
      "Descript",
      "Spotify for Podcasters"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Audio Setup & Recording Techniques",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Editing, RSS Feeds & Distribution",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "personal-branding",
    "slug": "personal-branding",
    "academy": "Creator Academy",
    "academyId": "creator",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa5",
    "color": "linear-gradient(135deg, #FF6B00, #0599a8)",
    "name": "Personal Branding",
    "shortDesc": "Position yourself as an industry expert across social media, newsletters, and public platforms.",
    "fullDesc": "Master authority building, content pillars, personal story crafting, and cross-platform growth strategies.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 130,
    "students": 810,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "LinkedIn",
      "Substack",
      "X (Twitter)"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Core Positioning & Brand Narrative",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Content Engines & Audience Growth",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "short-video-strategy",
    "slug": "short-video-strategy",
    "academy": "Creator Academy",
    "academyId": "creator",
    "programLevel": "Certification Course",
    "icon": "\ud83c\udfa5",
    "color": "linear-gradient(135deg, #FF6B00, #EF4444)",
    "name": "Short Video Strategy",
    "shortDesc": "Master short-form video algorithms for Instagram Reels, YouTube Shorts, and TikTok.",
    "fullDesc": "Learn viral hooks, retention pacing, sound selection, and converting views into followers and customers.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 180,
    "students": 1210,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "CapCut",
      "Instagram Analytics"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Reels & Shorts Algorithm Mechanics",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Viral Hook Writing & Analytics Tuning",
        "lessons": 5
      }
    ],
    "tags": [
      "popular",
      "trending"
    ],
    "featured": false
  },
  {
    "id": "biz-productivity",
    "slug": "business-productivity-mastery",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Career Program",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #2563EB)",
    "name": "Business Productivity Mastery",
    "shortDesc": "Advanced Excel, Word, PowerPoint, Google Workspace, Notion, ClickUp, Copilot & Tally.",
    "fullDesc": "A complete 6-month career program in business operations and office productivity. Master Excel formulas, Power Query, Word documentation, PowerPoint pitching, Google Workspace, Notion workspaces, ClickUp project management, Microsoft Copilot AI, and Tally with GST accounting.",
    "duration": "6 Months",
    "durationMonths": 6,
    "mode": "Hybrid",
    "level": "Beginner",
    "price": 16999,
    "originalPrice": 44999,
    "rating": 4.8,
    "reviews": 230,
    "students": 1420,
    "liveProjects": 15,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "MS Excel",
      "MS Word",
      "MS PowerPoint",
      "Google Workspace",
      "Notion",
      "ClickUp",
      "Microsoft Copilot",
      "Tally Prime"
    ],
    "curriculum": [
      {
        "module": "Phase 1",
        "title": "Advanced Excel & Data Analytics",
        "lessons": 18
      },
      {
        "module": "Phase 2",
        "title": "MS Word & Executive Documentation",
        "lessons": 12
      },
      {
        "module": "Phase 3",
        "title": "PowerPoint & Visual Executive Pitching",
        "lessons": 12
      },
      {
        "module": "Phase 4",
        "title": "Google Workspace & Notion Workflows",
        "lessons": 14
      },
      {
        "module": "Phase 5",
        "title": "Microsoft Copilot AI & Tally GST Accounting",
        "lessons": 14
      }
    ],
    "tags": [
      "bestseller",
      "popular",
      "placement"
    ],
    "featured": true
  },
  {
    "id": "office-pro",
    "slug": "office-productivity-professional",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Professional Program",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #75d766)",
    "name": "Office Productivity Professional",
    "shortDesc": "3-month professional course covering Excel, Google Workspace, Notion, and Microsoft Copilot AI.",
    "fullDesc": "Supercharge your workplace productivity with advanced spreadsheet modeling, automated document generation, and AI-assisted workflows.",
    "duration": "3 Months",
    "durationMonths": 3,
    "mode": "Online",
    "level": "Beginner",
    "price": 9999,
    "originalPrice": 24999,
    "rating": 4.8,
    "reviews": 160,
    "students": 980,
    "liveProjects": 8,
    "certificate": true,
    "placementSupport": true,
    "tools": [
      "MS Excel",
      "Google Sheets",
      "Notion",
      "Microsoft Copilot"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Advanced Excel Formulas & Dashboards",
        "lessons": 8
      },
      {
        "module": "Module 2",
        "title": "Google Workspace & Collaborative Tools",
        "lessons": 8
      },
      {
        "module": "Module 3",
        "title": "Microsoft Copilot AI Integration",
        "lessons": 8
      }
    ],
    "tags": [
      "popular",
      "placement"
    ],
    "featured": false
  },
  {
    "id": "microsoft-excel",
    "slug": "microsoft-excel",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #10B981)",
    "name": "Microsoft Excel",
    "shortDesc": "Master VLOOKUP, XLOOKUP, Pivot Tables, Power Query, and dynamic dashboard creation.",
    "fullDesc": "From beginner to advanced Excel wizard: data cleaning, logic formulas, pivot charts, dynamic arrays, and macro automation.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 320,
    "students": 2100,
    "liveProjects": 5,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Microsoft Excel",
      "Power Query"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "XLOOKUP, Nested IFs & Pivot Tables",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "Power Query Data Cleaning & Dashboards",
        "lessons": 6
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "microsoft-word",
    "slug": "microsoft-word",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #2563EB)",
    "name": "Microsoft Word",
    "shortDesc": "Create formal business reports, mail merges, automated tables of contents, and document templates.",
    "fullDesc": "Learn professional MS Word formatting, styles, section breaks, mail merge, headers/footers, and PDF publishing.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.7,
    "reviews": 110,
    "students": 690,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Microsoft Word"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Styles, Section Breaks & Formatting",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Mail Merge & Automated TOC Reports",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "microsoft-powerpoint",
    "slug": "microsoft-powerpoint",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #FF6B00)",
    "name": "Microsoft PowerPoint",
    "shortDesc": "Design executive presentation decks, slide masters, morph transitions, and infographics.",
    "fullDesc": "Master PowerPoint slide master layouts, morph animations, data charts, iconography, and slide design principles.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 180,
    "students": 1150,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Microsoft PowerPoint"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Slide Master & Design Grids",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Morph Animations & Executive Decks",
        "lessons": 5
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  },
  {
    "id": "google-workspace",
    "slug": "google-workspace",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #F59E0B)",
    "name": "Google Workspace",
    "shortDesc": "Master Gmail, Google Docs, Sheets, Slides, Drive, Forms, and Meet for seamless team collaboration.",
    "fullDesc": "Learn cloud collaboration: Google Drive permissions, Google Forms quizzes, Sheets formulas, Docs commenting, and Google Meet integration.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.8,
    "reviews": 140,
    "students": 870,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Google Docs",
      "Google Sheets",
      "Google Slides",
      "Google Forms"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Google Drive, Docs & Form Workflows",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Google Sheets Collaboration & Sharing",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "notion-cert",
    "slug": "notion",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #011731)",
    "name": "Notion",
    "shortDesc": "Build custom digital Second Brain systems, project trackers, wikis, and databases in Notion.",
    "fullDesc": "Master Notion relational databases, rollups, formulas, board views, templates, and team workspaces.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 210,
    "students": 1390,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Notion",
      "Notion AI"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Notion Databases, Views & Filters",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Relations, Rollups & Personal OS Templates",
        "lessons": 5
      }
    ],
    "tags": [
      "popular",
      "trending"
    ],
    "featured": false
  },
  {
    "id": "clickup-cert",
    "slug": "clickup",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #8B5CF6)",
    "name": "ClickUp",
    "shortDesc": "Manage team projects, Gantt charts, custom statuses, and task automation in ClickUp.",
    "fullDesc": "Learn ClickUp workspace hierarchy, custom fields, automations, time tracking, and dashboard reporting.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.7,
    "reviews": 90,
    "students": 560,
    "liveProjects": 3,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "ClickUp"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "ClickUp Hierarchy & Task Management",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Automations, Gantt Charts & Reporting",
        "lessons": 5
      }
    ],
    "tags": [],
    "featured": false
  },
  {
    "id": "microsoft-copilot",
    "slug": "microsoft-copilot",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #75d766)",
    "name": "Microsoft Copilot",
    "shortDesc": "Integrate AI inside Word, Excel, PowerPoint, and Outlook to draft documents and analyze data instantly.",
    "fullDesc": "Master Copilot in Microsoft 365: automated slide generation in PowerPoint, formula drafting in Excel, and email summaries in Outlook.",
    "duration": "1 Month",
    "durationMonths": 1,
    "mode": "Online",
    "level": "Beginner",
    "price": 3999,
    "originalPrice": 11999,
    "rating": 4.9,
    "reviews": 175,
    "students": 1100,
    "liveProjects": 4,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Microsoft Copilot",
      "MS 365"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Copilot in Word & PowerPoint Deck Creation",
        "lessons": 5
      },
      {
        "module": "Module 2",
        "title": "Copilot in Excel Analysis & Outlook Email",
        "lessons": 5
      }
    ],
    "tags": [
      "popular",
      "trending"
    ],
    "featured": false
  },
  {
    "id": "tally-gst",
    "slug": "tally-with-gst",
    "academy": "Office Productivity Academy",
    "academyId": "office",
    "programLevel": "Certification Course",
    "icon": "\ud83d\udccb",
    "color": "linear-gradient(135deg, #0599a8, #FF6B00)",
    "name": "Tally with GST",
    "shortDesc": "Master Tally Prime accounting, GST filing, vouchers, inventory management, and payroll.",
    "fullDesc": "Complete practical training in Tally Prime: ledger creation, GST invoicing, GSTR-1/3B returns, inventory tracking, and balance sheet preparation.",
    "duration": "2 Months",
    "durationMonths": 2,
    "mode": "Online",
    "level": "Beginner",
    "price": 5999,
    "originalPrice": 16999,
    "rating": 4.8,
    "reviews": 210,
    "students": 1420,
    "liveProjects": 5,
    "certificate": true,
    "placementSupport": false,
    "tools": [
      "Tally Prime",
      "GST Portal"
    ],
    "curriculum": [
      {
        "module": "Module 1",
        "title": "Tally Prime Ledgers & Vouchers",
        "lessons": 6
      },
      {
        "module": "Module 2",
        "title": "GST Invoicing, GSTR Returns & Inventory",
        "lessons": 8
      }
    ],
    "tags": [
      "popular"
    ],
    "featured": false
  }
];

/* Academy metadata for filters and display */
const NS_ACADEMIES = [
  {
    "id": "digital-marketing",
    "name": "Digital Marketing Academy",
    "icon": "\ud83d\udcca",
    "color": "linear-gradient(135deg,#FF6B00,#FF9A3C)"
  },
  {
    "id": "ai",
    "name": "AI Academy",
    "icon": "\ud83e\udd16",
    "color": "linear-gradient(135deg,#0599a8,#75d766)"
  },
  {
    "id": "design",
    "name": "Design Academy",
    "icon": "\ud83c\udfa8",
    "color": "linear-gradient(135deg,#8B5CF6,#EC4899)"
  },
  {
    "id": "programming",
    "name": "Programming Academy",
    "icon": "\ud83d\udcbb",
    "color": "linear-gradient(135deg,#2563EB,#0599a8)"
  },
  {
    "id": "nocode",
    "name": "No-Code Web Academy",
    "icon": "\ud83c\udf10",
    "color": "linear-gradient(135deg,#F59E0B,#EF4444)"
  },
  {
    "id": "video",
    "name": "Video & Motion Academy",
    "icon": "\ud83c\udfac",
    "color": "linear-gradient(135deg,#EF4444,#F97316)"
  },
  {
    "id": "3d",
    "name": "3D Academy",
    "icon": "\ud83c\udfd7\ufe0f",
    "color": "linear-gradient(135deg,#10B981,#059669)"
  },
  {
    "id": "career",
    "name": "Career & Freelancing Academy",
    "icon": "\ud83d\udcbc",
    "color": "linear-gradient(135deg,#011731,#0599a8)"
  },
  {
    "id": "communication",
    "name": "Communication Academy",
    "icon": "\ud83d\udcac",
    "color": "linear-gradient(135deg,#75d766,#0599a8)"
  },
  {
    "id": "kids",
    "name": "Kids Tech Academy",
    "icon": "\ud83d\udc68\u200d\ud83d\udcbb",
    "color": "linear-gradient(135deg,#EC4899,#8B5CF6)"
  },
  {
    "id": "creator",
    "name": "Creator Academy",
    "icon": "\ud83c\udfa5",
    "color": "linear-gradient(135deg,#FF6B00,#EC4899)"
  },
  {
    "id": "office",
    "name": "Office Productivity Academy",
    "icon": "📋",
    "color": "linear-gradient(135deg,#0599a8,#2563EB)"
  }
];

/* Program Levels Architecture Specification (V1.1 Foundation) */
const NS_PROGRAM_LEVELS = [
  {
    "id": "career",
    "name": "Career Program",
    "label": "Career Programs",
    "durationRange": "6–12 Months",
    "description": "Comprehensive 6–12 month career transformation programs with live client projects and 100% placement support."
  },
  {
    "id": "professional",
    "name": "Professional Program",
    "label": "Professional Programs",
    "durationRange": "3–6 Months",
    "description": "In-depth 3–6 month skill mastery programs designed for career acceleration and industry readiness."
  },
  {
    "id": "certification",
    "name": "Certification Course",
    "label": "Certification Courses",
    "durationRange": "1–2 Months",
    "description": "Focused 1–2 month specialized certification courses for rapid skill acquisition and tool mastery."
  }
];

/**
 * Normalizes program level string to canonical names:
 * 'Career Program' | 'Professional Program' | 'Certification Course'
 */
function normalizeProgramLevel(level) {
  if (!level) return '';
  const str = String(level).trim().toLowerCase();
  if (str.includes('career')) return 'Career Program';
  if (str.includes('professional')) return 'Professional Program';
  if (str.includes('cert')) return 'Certification Course';
  return level;
}

/**
 * Get courses filtered by Academy ID and optional Program Level
 */
function getCoursesByAcademyAndLevel(academyId, programLevel) {
  const courses = (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES)) ? NS_COURSES : [];
  return courses.filter(c => {
    const matchAcademy = !academyId || c.academyId === academyId;
    const matchLevel = !programLevel || normalizeProgramLevel(c.programLevel) === normalizeProgramLevel(programLevel);
    return matchAcademy && matchLevel;
  });
}

/**
 * Build scalable Academy -> Program Level -> Courses hierarchy object
 */
function getAcademyHierarchy() {
  const academies = (typeof NS_ACADEMIES !== 'undefined' && Array.isArray(NS_ACADEMIES)) ? NS_ACADEMIES : [];
  const courses = (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES)) ? NS_COURSES : [];
  const hierarchy = {};

  academies.forEach(acad => {
    hierarchy[acad.id] = {
      academy: acad,
      levels: {
        'Career Program': courses.filter(c => c.academyId === acad.id && normalizeProgramLevel(c.programLevel) === 'Career Program'),
        'Professional Program': courses.filter(c => c.academyId === acad.id && normalizeProgramLevel(c.programLevel) === 'Professional Program'),
        'Certification Course': courses.filter(c => c.academyId === acad.id && normalizeProgramLevel(c.programLevel) === 'Certification Course')
      }
    };
  });

  return hierarchy;
}

/* Data Model Alias Normalization for Backward & Forward Compatibility */
if (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES)) {
  NS_COURSES.forEach(c => {
    if (!c.title) c.title = c.name;
    if (!c.description) c.description = c.shortDesc || c.fullDesc;
    if (c.projects === undefined) c.projects = c.liveProjects || 0;
    if (!c.category) c.category = c.academy;
  });
}

// Global exports attachment
if (typeof window !== 'undefined') {
  window.NS_PROGRAM_LEVELS = NS_PROGRAM_LEVELS;
  window.normalizeProgramLevel = normalizeProgramLevel;
  window.getCoursesByAcademyAndLevel = getCoursesByAcademyAndLevel;
  window.getAcademyHierarchy = getAcademyHierarchy;
}

/* Blog posts data */
const NS_BLOG_POSTS = [
  {
    "id": "waseeullah-mansoori",
    "slug": "waseeullah-mansoori",
    "url": "/blog/waseeullah-mansoori/",
    "title": "From Creative Designer to AI Educator: Meet Waseeullah Mansoori",
    "excerpt": "Discover Waseeullah Mansoori's 11+ year journey from multimedia designer & marketer to founding Nova Skills — empowering careers with practical AI & tech skills.",
    "category": "Founder Story",
    "author": "Waseeullah Mansoori",
    "authorRole": "Founder, Nova Skills",
    "readTime": 15,
    "date": "2026-07-30",
    "tags": [
      "Founder Story",
      "Career Journey",
      "AI Education",
      "Nova Skills",
      "Multimedia"
    ],
    "featured": true,
    "trending": true,
    "image": "/public/images/seo/waseeullah-mansoori.png"
  },
  {
    "id": 1,
    "slug": "ai-jobs-india-2026",
    "title": "Top 15 AI Jobs in India 2026: Salaries, Skills & How to Get Hired",
    "excerpt": "AI is not replacing jobs \u2014 it's creating them. Discover the highest-paying AI roles in India, what skills they require, and how Nova Skills can get you there in 6 months.",
    "category": "Career Advice",
    "author": "Sanya Puri",
    "authorRole": "Lead AI Trainer",
    "readTime": 8,
    "date": "2026-07-20",
    "tags": [
      "AI",
      "Career",
      "Jobs",
      "India"
    ],
    "featured": true,
    "trending": true,
    "image": null
  },
  {
    "id": 2,
    "slug": "digital-marketing-salary-india",
    "title": "Digital Marketing Salary in India 2026: Complete Guide",
    "excerpt": "From freshers to senior marketers \u2014 everything you need to know about digital marketing salaries across India's top cities, industries and job roles.",
    "category": "Digital Marketing",
    "author": "Arjun Kapoor",
    "authorRole": "Head of Digital Marketing",
    "readTime": 6,
    "date": "2026-07-15",
    "tags": [
      "Digital Marketing",
      "Salary",
      "Career"
    ],
    "featured": false,
    "trending": true,
    "image": null
  },
  {
    "id": 3,
    "slug": "learn-graphic-design-beginner-guide",
    "title": "How to Learn Graphic Design from Scratch: Complete 2026 Guide",
    "excerpt": "Whether you're a complete beginner or want to go professional, this step-by-step guide covers tools, techniques, portfolio building and landing your first design client.",
    "category": "Design",
    "author": "Rajan Verma",
    "authorRole": "Senior Design Trainer",
    "readTime": 10,
    "date": "2026-07-10",
    "tags": [
      "Graphic Design",
      "Beginner",
      "Photoshop",
      "Figma"
    ],
    "featured": false,
    "trending": false,
    "image": null
  },
  {
    "id": 4,
    "slug": "freelancing-fiverr-india-guide",
    "title": "How to Earn \u20b91 Lakh/Month Freelancing on Fiverr in India",
    "excerpt": "A practical, no-fluff guide to building a 6-figure freelance income on Fiverr from India \u2014 niche selection, profile optimisation, proposals and scaling strategies.",
    "category": "Freelancing",
    "author": "Priya Kumar",
    "authorRole": "Freelancing Success Coach",
    "readTime": 7,
    "date": "2026-07-05",
    "tags": [
      "Freelancing",
      "Fiverr",
      "Income"
    ],
    "featured": false,
    "trending": true,
    "image": null
  },
  {
    "id": 5,
    "slug": "n8n-ai-automation-beginners",
    "title": "n8n AI Automation for Beginners: Build Your First AI Workflow",
    "excerpt": "Step-by-step tutorial to build a powerful AI automation workflow using n8n \u2014 no coding required. Automate repetitive tasks, connect APIs and build AI agents.",
    "category": "AI & Technology",
    "author": "Sanya Puri",
    "authorRole": "Lead AI Trainer",
    "readTime": 12,
    "date": "2026-07-01",
    "tags": [
      "n8n",
      "AI Automation",
      "No-Code"
    ],
    "featured": false,
    "trending": false,
    "image": null
  },
  {
    "id": 6,
    "slug": "youtube-channel-monetise-2026",
    "title": "How to Start & Monetise a YouTube Channel in 2026: Step-by-Step",
    "excerpt": "From zero subscribers to YouTube Partner \u2014 a complete, updated guide to growing a successful YouTube channel with the latest 2026 algorithm changes and strategies.",
    "category": "Content Creation",
    "author": "Mohammed Tahir",
    "authorRole": "Creator Academy Lead",
    "readTime": 9,
    "date": "2026-06-25",
    "tags": [
      "YouTube",
      "Creator",
      "Monetisation"
    ],
    "featured": false,
    "trending": false,
    "image": null
  },
  {
    "id": 7,
    "slug": "chatgpt-prompts-marketing",
    "title": "50 ChatGPT Prompts That Will Transform Your Marketing",
    "excerpt": "Stop wasting time on generic AI outputs. These 50 expert-crafted prompts will give you high-converting ad copy, SEO content, email sequences and campaign strategies.",
    "category": "AI & Technology",
    "author": "Arjun Kapoor",
    "authorRole": "Head of Digital Marketing",
    "readTime": 5,
    "date": "2026-06-18",
    "tags": [
      "ChatGPT",
      "AI",
      "Marketing",
      "Prompts"
    ],
    "featured": false,
    "trending": false,
    "image": null
  },
  {
    "id": 8,
    "slug": "kids-coding-benefits-india",
    "title": "Why Every Indian Child Should Learn to Code Before Age 12",
    "excerpt": "The future belongs to children who understand technology. Discover why coding education is critical for Indian kids and how parents can get their child started.",
    "category": "Kids Education",
    "author": "Dr. Sunita Rao",
    "authorRole": "Kids Tech Academy Director",
    "readTime": 6,
    "date": "2026-06-12",
    "tags": [
      "Kids",
      "Coding",
      "Education",
      "Parents"
    ],
    "featured": false,
    "trending": false,
    "image": null
  },
  {
    "id": 9,
    "slug": "python-vs-javascript-2026",
    "title": "Python vs JavaScript in 2026: Which Should You Learn First?",
    "excerpt": "The ultimate comparison for beginners \u2014 Python or JavaScript? We break down career paths, job market demand, salary potential and which language suits your goals.",
    "category": "Programming",
    "author": "Vikram Nair",
    "authorRole": "Programming Academy Lead",
    "readTime": 8,
    "date": "2026-06-08",
    "tags": [
      "Python",
      "JavaScript",
      "Programming"
    ],
    "featured": false,
    "trending": false,
    "image": null
  }
];

if (typeof window !== 'undefined') {
  window.NS_COURSES = NS_COURSES;
  window.NS_ACADEMIES = NS_ACADEMIES;
  window.NS_BLOG_POSTS = NS_BLOG_POSTS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NS_COURSES, NS_ACADEMIES, NS_BLOG_POSTS };
}
