/**
 * Portfolio Data Configuration (Single Source of Truth)
 * Derived strictly from resume.pdf with zero fabricated metrics or links.
 */

export const portfolioData = {
  personal: {
    name: 'Shaik Zeeshaan Suhail',
    shortName: 'Zeeshaan Suhail',
    brandName: 'Zeeshaan',
    headline: 'Full-Stack Developer Intern & Computer Science Student',
    tagline: 'Building Fast, Shipping even Faster',
    location: 'Sattenapalli, Andhra Pradesh',
    email: 'zeeshaansuhail23@gmail.com',
    phone: '+91 90591 49898',
    linkedin: {
      label: 'linkedin.com/in/zeeshaan-suhail',
      url: 'https://linkedin.com/in/zeeshaan-suhail'
    },
    github: {
      label: 'github.com/Zeeshaan-23',
      url: 'https://github.com/Zeeshaan-23'
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
      period: 'August 2026 – Present',
      location: 'Remote',
      isCurrent: true,
      description:
        'Built frontend features for Bhojpatra, a premium feast and caterer booking platform, using Next.js 16, React 19, TypeScript, Tailwind CSS, and Framer Motion. Accelerated development with Claude, Gemini, and Antigravity alongside documented Git/GitHub workflows. Secured the platform by running a security audit with Antigravity agent skills sourced from GitHub and Google, uncovering client-controlled payment amounts, an exposed database, missing rate limits, and duplicate sessions. Improved release quality through manual QA and AI-driven automated testing run from an Excel test plan, covering the checkout and payment flow. Building the official Open Idea website on the same stack, studying user behaviour and UI/UX complexities to guide design decisions.',
      bullets: [
        'Built frontend features for Bhojpatra, a premium feast and caterer booking platform, using Next.js 16, React 19, TypeScript, Tailwind CSS, and Framer Motion.',
        'Accelerated development with Claude, Gemini, and Antigravity alongside documented Git/GitHub workflows.',
        'Secured the platform by running a security audit with Antigravity agent skills sourced from GitHub and Google, uncovering client-controlled payment amounts, an exposed database, missing rate limits, and duplicate sessions.',
        'Improved release quality through manual QA and AI-driven automated testing run from an Excel test plan, covering the checkout and payment flow.',
        'Building the official Open Idea website on the same stack, studying user behaviour and UI/UX complexities to guide design decisions.'
      ],
      stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Claude', 'Gemini', 'Antigravity', 'Git/GitHub']
    },
    {
      id: 'bottrion',
      company: 'Bottrion Systems Pvt. Ltd.',
      role: 'Software Development Intern',
      period: 'May 2026 – July 2026',
      location: 'Remote',
      isCurrent: false,
      description:
        'Built the eSign Platform, an e-signature system with serial and parallel signing workflows. Developed hands-on proficiency in IBM DataPower Gateway by replicating its XML Firewalls, Multi-Protocol Gateways, and Web Service Proxies, plus XSLT transformations, AAA policies, and TLS client profiles. Reduced environment setup friction by containerising the DataPower development environment with Docker and WSL2/Ubuntu.',
      bullets: [
        'Built the eSign Platform, an e-signature system with serial and parallel signing workflows.',
        'Developed hands-on proficiency in IBM DataPower Gateway by replicating its XML Firewalls, Multi-Protocol Gateways, and Web Service Proxies.',
        'Worked with XSLT transformations, AAA policies, and TLS client profiles.',
        'Reduced environment setup friction by containerising the DataPower development environment with Docker and WSL2/Ubuntu.'
      ],
      stack: ['Django', 'Django REST Framework', 'React', 'PostgreSQL', 'Redis', 'Celery', 'Cloudflare R2', 'IBM DataPower', 'Docker', 'WSL2/Ubuntu']
    }
  ],

  projects: [
    {
      id: 'esign',
      title: 'eSign Platform',
      role: 'Backend / Frontend',
      timeline: 'May – July 2026',
      stack: ['Django', 'Django REST Framework', 'React', 'PostgreSQL', 'Redis', 'Celery', 'Cloudflare R2'],
      deployment: 'Railway',
      description:
        'Built a signing platform supporting serial and parallel multi-signer workflows, package management, and a complete audit trail. Designed 10+ REST APIs with JWT authentication and role-based access control. Automated notifications and background jobs using Celery, Redis, and SendGrid; stored documents using Cloudflare R2 and deployed on Railway.',
      bullets: [
        'Streamlined multi-signer workflows by building a signing platform with serial and parallel routing, package management, and a full audit trail.',
        'Secured document handling by designing 10+ REST APIs with JWT authentication and role-based access control.',
        'Automated notifications and background jobs with Celery, Redis, and SendGrid.',
        'Stored documents on Cloudflare R2 and deployed on Railway.'
      ]
    },
    {
      id: 'unimeet',
      title: 'UniMeet',
      role: 'Code',
      timeline: 'May 2026',
      stack: ['MongoDB', 'Express.js', 'React', 'Node.js (MERN)'],
      description:
        'Built an appointment platform for faculty scheduling with dashboards for 3 user roles: Students, Teachers, and Admins. Enabled real-time booking via JWT-secured REST APIs for slots, requests, and approvals, with a responsive React UI.',
      bullets: [
        'Simplified faculty scheduling by building an appointment platform with dashboards for 3 user roles (Students, Teachers, Admins).',
        'Enabled real-time booking via JWT-secured REST APIs for slots, requests, and approvals.',
        'Built a responsive React interface.'
      ]
    },
    {
      id: 'hospital-mgmt',
      title: 'Hospital Management System',
      role: 'Code',
      timeline: 'May 2026',
      stack: ['MySQL'],
      description:
        'Centralised patient, doctor, appointment, and billing data by designing a normalised MySQL schema with full CRUD functionality. Automated operations and enforced data integrity with optimised SQL queries, stored procedures, and triggers.',
      bullets: [
        'Centralised patient, doctor, appointment, and billing data by designing a normalised MySQL schema with full CRUD.',
        'Automated operations and enforced integrity with optimised SQL queries, stored procedures, and triggers.'
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
      description: 'Hands-on TryHackMe labs — Linux, Active Directory, Nmap, Wireshark, Metasploit',
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
      date: 'August 2026 – Present',
      badge: 'CURRENT ROLE',
      title: 'Open Idea Ecosyz',
      subtitle: 'Full-Stack Developer Intern (Remote)',
      isCurrent: true,
      description: 'Built frontend features for Bhojpatra using Next.js 16, React 19, TypeScript, Tailwind CSS, and Framer Motion. Accelerated development with Claude, Gemini, and Antigravity. Secured platform by executing a security audit with Antigravity agent skills uncovering critical payment, database, and rate limit vulnerabilities. Improved release quality via manual QA & AI-driven testing. Building official Open Idea website.'
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
