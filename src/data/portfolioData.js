/**
 * Portfolio Data Configuration (Single Source of Truth)
 * Derived strictly from resume.pdf with zero fabricated metrics or links.
 */

export const portfolioData = {
  personal: {
    name: 'Shaik Zeeshaan Suhail',
    shortName: 'Zeeshaan Suhail',
    brandName: 'Zeeshaan',
    headline: 'Full-Stack Developer & Computer Science Student',
    tagline: 'Building Fast, Shipping even Faster',
    location: 'Sattenapalli, Andhra Pradesh',
    email: 'zeeshaansuhail23@gmail.com',
    phone: '+91 90591 49898',
    linkedin: {
      label: 'linkedin.com/in/zeeshaan-suhail',
      url: 'https://linkedin.com/in/zeeshaan-suhail'
    },
    github: {
      username: 'Zeeshaan-23',
      label: 'github.com/Zeeshaan-23',
      url: 'https://github.com/Zeeshaan-23'
    },
    // Add the LeetCode handle here, then run `npm run sync:leetcode` to build
    // the real calendar snapshot used by the activity dashboard.
    leetcode: {
      username: '',
      url: ''
    }
  },

  education: {
    institution: 'SRM University AP',
    location: 'Amaravati, AP',
    degree: 'B.Tech in Computer Science and Engineering',
    period: 'Aug. 2024 – Expected May 2028',
    cgpa: '9.41 / 10.0',
    coursework: [
      'Data Structures & Algorithms',
      'DBMS',
      'OOPs',
      'Operating Systems',
      'Computer Networks',
      'Design & Analysis of Algorithms'
    ]
  },

  experience: [
    {
      id: 'open-idea',
      company: 'Open Idea Ecosyz',
      role: 'Full-Stack Developer Intern',
      period: 'August 2026 – October 2026',
      location: 'Remote',
      isCurrent: false,
      description:
        'Built and audited Bhojpatra, a feast and caterer booking platform, and helped build the official Open Idea website.',
      bullets: [
        "Built Bhojpatra's feast-booking frontend with Next.js, React, TypeScript, and Tailwind CSS.",
        'Audited payments, authentication, rate limits, and sessions, surfacing critical security gaps.',
        'Covered checkout with manual and AI-assisted QA and helped build the official Open Idea site.'
      ],
      stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Security Auditing', 'AI-assisted QA']
    },
    {
      id: 'bottrion',
      company: 'Bottrion Systems Pvt. Ltd.',
      role: 'Software Development Intern',
      period: 'May 2026 – July 2026',
      location: 'Remote',
      isCurrent: false,
      description:
        'Built the eSign Platform and configured IBM DataPower gateways in a containerised development environment.',
      bullets: [
        'Built the eSign Platform with serial and parallel signing workflows.',
        'Replicated IBM DataPower gateways, XSLT transformations, AAA policies, and TLS profiles.',
        'Containerised the DataPower development environment with Docker and WSL2/Ubuntu.'
      ],
      stack: ['Django', 'React', 'PostgreSQL', 'Docker', 'IBM DataPower']
    }
  ],

  projects: [
    {
      id: 'esign',
      title: 'eSign Platform',
      role: 'Backend / Frontend',
      timeline: 'May – July 2026',
      stack: ['Django', 'React', 'PostgreSQL', 'Redis', 'Celery', 'Cloudflare R2'],
      deployment: 'Railway',
      repo: 'https://github.com/Zeeshaan-23/esign-platform',
      description:
        'A multi-signer e-signature platform with audit trails, JWT-secured APIs, and automated document workflows.',
      bullets: [
        'Built multi-signer workflows with serial and parallel routing, package management, and an audit trail.',
        'Designed 10+ JWT-secured APIs; automated jobs with Celery and stored documents on Cloudflare R2.'
      ]
    },
    {
      id: 'unimeet',
      title: 'UniMeet',
      role: 'Code',
      timeline: 'May 2026',
      stack: ['MongoDB', 'Express.js', 'React', 'Node.js'],
      repo: 'https://github.com/Zeeshaan-23/UniMeet',
      description:
        'A faculty appointment platform with role-based dashboards and JWT-secured booking.',
      bullets: [
        'Built an appointment platform with dashboards for students, teachers, and admins.',
        'Enabled JWT-secured booking, requests, and approvals with a responsive React UI.'
      ]
    },
    {
      id: 'hospital-mgmt',
      title: 'Hospital Management System',
      role: 'Code',
      timeline: 'May 2026',
      stack: ['MySQL'],
      repo: 'https://github.com/Zeeshaan-23/DBMS-Hospital-Management',
      description:
        'A normalised MySQL database for patient, doctor, appointment, and billing records.',
      bullets: [
        'Designed a normalised schema with full CRUD for patients, doctors, appointments, and billing.',
        'Automated operations with optimised queries, stored procedures, and triggers.'
      ]
    }
  ],

  technicalSkills: {
    categories: [
      {
        name: 'Languages',
        skills: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS']
      },
      {
        name: 'Frameworks & Libraries',
        skills: ['Next.js', 'React', 'Django', 'Django REST Framework', 'Node.js', 'Express.js', 'FastAPI', 'Tailwind CSS', 'Framer Motion']
      },
      {
        name: 'Databases',
        skills: ['PostgreSQL (Neon)', 'MySQL', 'MongoDB', 'SQLite', 'Redis']
      },
      {
        name: 'Tools & Cloud',
        skills: ['Git', 'GitHub', 'Docker', 'Postman', 'Figma', 'WSL2', 'Linux', 'Vercel', 'Railway', 'Cloudflare R2']
      },
      {
        name: 'Concepts',
        skills: ['REST APIs', 'JWT', 'TLS/SSL', 'IBM DataPower', 'QA Testing', 'Security Auditing', 'AI-Assisted Development']
      }
    ]
  },

  certifications: [
    {
      name: 'MongoDB Associate Developer',
      issuer: 'MongoDB'
    },
    {
      name: 'IBM AI Fundamentals',
      issuer: 'IBM'
    },
    {
      name: 'Google Vertex AI: Prompt Design',
      issuer: 'Google'
    }
  ],

  achievements: {
    competitiveProgramming: {
      title: 'Competitive Programming',
      description: "Active LeetCode solver; completing Striver’s A2Z DSA Sheet"
    },
    cybersecurity: {
      title: 'Cybersecurity',
      description: 'Hands-on TryHackMe labs in Linux, Active Directory, and network security',
      topics: ['Linux', 'Active Directory', 'Nmap', 'Wireshark', 'Metasploit']
    }
  },

  timeline: [
    {
      date: 'August 2024',
      badge: 'EDUCATION',
      title: 'SRM University AP',
      subtitle: 'B.Tech in Computer Science and Engineering',
      location: 'Amaravati, AP',
      description: 'Started B.Tech in Computer Science and Engineering at SRM University AP. Maintaining CGPA: 9.41 / 10.0 with core CS coursework in Data Structures & Algorithms, DBMS, OOPs, Operating Systems, Computer Networks, and Design & Analysis of Algorithms.'
    },
    {
      date: 'May 2026',
      badge: 'PROJECTS',
      title: 'Academic & Full-Stack Projects',
      subtitle: 'UniMeet & Hospital Management System',
      description: 'Built UniMeet (MERN appointment platform with role-based dashboards and JWT-secured REST APIs) and Hospital Management System (normalized MySQL database schema with complete CRUD, stored procedures, and triggers).'
    },
    {
      date: 'May – July 2026',
      badge: 'INTERNSHIP',
      title: 'Bottrion Systems Pvt. Ltd.',
      subtitle: 'Software Development Intern (Remote)',
      description: 'Built the eSign Platform with serial and parallel signing workflows. Developed hands-on proficiency in IBM DataPower Gateway replicating XML Firewalls, Multi-Protocol Gateways, Web Service Proxies, XSLT transformations, AAA policies, and TLS client profiles. Containerised development environment with Docker and WSL2/Ubuntu.'
    },
    {
      date: 'August 2026 – October 2026',
      badge: 'INTERNSHIP',
      title: 'Open Idea Ecosyz',
      subtitle: 'Full-Stack Developer Intern (Remote)',
      description: 'Built Bhojpatra’s booking frontend, audited payment and authentication flows, and helped build the official Open Idea website.'
    }
  ],

  fieldsOfStudy: [
    {
      id: 'cs',
      title: 'Computer Science',
      tag: 'CORE FOUNDATIONS',
      description: 'Fundamental algorithmic theories, data structures, and computer systems studied at SRM University AP.',
      skills: [
        'Data Structures & Algorithms',
        'DBMS',
        'OOPs',
        'Operating Systems',
        'Computer Networks',
        'Design & Analysis of Algorithms'
      ]
    },
    {
      id: 'fullstack',
      title: 'Full-Stack Development',
      tag: 'WEB ARCHITECTURE',
      description: 'End-to-end full-stack application development across modern frontend and scalable backend environments.',
      skills: [
        'React',
        'Next.js',
        'Django',
        'Django REST Framework',
        'Node.js',
        'Express.js',
        'REST APIs'
      ]
    },
    {
      id: 'backend',
      title: 'Backend & Infrastructure',
      tag: 'SYSTEMS & CLOUD',
      description: 'Relational & NoSQL database architecture, asynchronous job workers, caching, containerization, and cloud hosting.',
      skills: [
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Redis',
        'Docker',
        'Cloudflare R2',
        'Railway'
      ]
    },
    {
      id: 'security',
      title: 'Security',
      tag: 'INFRASTRUCTURE & PROTOCOLS',
      description: 'Cryptographic profiles, access tokens, API firewalls, vulnerability auditing, and hands-on laboratory security testing.',
      skills: [
        'JWT',
        'TLS/SSL',
        'Security Auditing',
        'Linux',
        'Active Directory',
        'Nmap',
        'Wireshark',
        'Metasploit',
        'IBM DataPower'
      ]
    },
    {
      id: 'ai',
      title: 'AI-Assisted Development',
      tag: 'AGENTIC ENGINEERING',
      description: 'Leveraging frontier language models and autonomous agent skills to accelerate development, audit vulnerabilities, and automate QA.',
      skills: [
        'Claude',
        'Gemini',
        'Antigravity',
        'AI-Assisted Development'
      ]
    }
  ]
};

export default portfolioData;
