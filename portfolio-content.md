# Portfolio Content Source File
> Extracted and organized from resume (source of truth). For use by a coding agent to populate portfolio pages. No design/code instructions included.

---

# Page 2: About Me

## Name
Shaik Zeeshaan Suhail

## Contact / Professional Links
- Phone: +91 90591 49898
- Email: zeeshaansuhail23@gmail.com
- LinkedIn: linkedin.com/in/zeeshaan-suhail
- GitHub: github.com/Zeeshaan-23
- Location: Sattenapalli, Andhra Pradesh

## Professional Title / Tagline
*Note: Resume does not state an explicit title/tagline. Based strictly on resume content (education + experience + projects), a grounded tagline option is:*
"Computer Science Engineering Student | Full-Stack Developer | API & Backend Systems"

*(Marked as a derived suggestion, not an explicit resume statement — the coding agent/user may adjust wording.)*

## Portfolio-Ready Introduction (First-Person)
I'm Zeeshaan, a Computer Science Engineering student at SRM University AP, currently maintaining a 9.41/10.0 CGPA. My experience spans full-stack web development and enterprise API infrastructure — from building a complete electronic-signing platform with Django and React, to configuring IBM DataPower Gateway for production API traffic during my internship at Bottrion Systems. I enjoy working across the stack, from designing relational database schemas to securing API traffic with TLS and JWT-based authentication.

## Detailed About Me
I am currently pursuing a Bachelor of Technology in Computer Science and Engineering at SRM University AP (Aug 2024 – May 2028), with coursework covering Data Structures & Algorithms, DBMS, Object-Oriented Programming, Operating Systems, Computer Networks, and Design and Analysis of Algorithms.

Between May and July 2026, I worked as a Software Development Intern at Bottrion Systems Pvt. Ltd. (Remote), where I configured IBM DataPower Gateway (IDG) for enterprise API management — implementing XML Firewalls, Multi-Protocol Gateways, and Web Service Proxies for production clients in Saudi Arabia. I also engineered XSLT transformations, AAA policies, and TLS client profiles to secure and route enterprise API traffic, and containerized the DataPower development environment using Docker and WSL2/Ubuntu to streamline local development.

Alongside this, I built the eSign Platform — a full-stack electronic document signing system using Django, React, TypeScript, PostgreSQL, Redis, and Celery — supporting multi-user signing workflows and a complete audit trail. I've also built a university appointment management platform (UniMeet) using the MERN stack, and a Hospital Management System with a normalized MySQL schema.

I actively practice competitive programming on LeetCode and am working through Striver's A2Z DSA Sheet. I also have hands-on cybersecurity experience through TryHackMe labs covering Linux, Active Directory, Nmap, Wireshark, and Metasploit.

## Education
**SRM University AP** — Amaravati, Andhra Pradesh
Bachelor of Technology in Computer Science and Engineering
Aug 2024 – May 2028
- CGPA: 9.41 / 10.0
- Relevant Coursework: Data Structures & Algorithms, DBMS, Object-Oriented Programming (OOPs), Operating Systems, Computer Networks, Design and Analysis of Algorithms

## Core Interests
*(Grounded in resume evidence)*
- API gateway architecture and cryptographic/security workflows (from DataPower internship experience)
- Full-stack web development (Django, React, MERN stack projects)
- Database design and relational schema modeling (Hospital Management System)
- Competitive programming / DSA (active LeetCode solver, Striver's A2Z Sheet)
- Cybersecurity fundamentals (TryHackMe labs: Linux, Active Directory, Nmap, Wireshark, Metasploit)

## Technical Strengths
- Building secure, production-oriented API infrastructure (XML Firewalls, TLS client profiles, AAA policies, JWT auth)
- Full-stack application development across Django/DRF and MERN stacks
- Relational database design, optimized SQL queries, stored procedures, and triggers
- Containerization and local dev environment setup (Docker, WSL2/Ubuntu)
- Async task processing and third-party service integration (Celery, Redis, SendGrid)

## Personal/Professional Characteristics (resume-supported)
- Practical, hands-on learner — gained cybersecurity exposure through applied labs (TryHackMe) rather than only coursework
- Detail-oriented in backend/security work — implemented specific enterprise security constructs (XML Firewalls, AAA policies, TLS profiles) for real production clients
- Consistent academic performer — 9.41/10.0 CGPA
- Self-driven in skill-building — actively completing a structured DSA sheet and solving problems independently on LeetCode

*Note: Descriptors like "passionate" or "innovative" are intentionally omitted as the resume does not explicitly support such claims.*

---

# Page 4: Languages and Skills

## Programming Languages
- C
- C++
- Python
- JavaScript
- TypeScript
- SQL
- HTML/CSS

## Frameworks & Libraries
- React — used in eSign Platform and UniMeet
- Django — used in eSign Platform
- Django REST Framework (DRF) — used in eSign Platform for RESTful API design
- Node.js — used in UniMeet (MERN stack)
- Express.js — used in UniMeet (MERN stack)
- FastAPI
- Tailwind CSS

## Databases
- MySQL — used in Hospital Management System (schema design, stored procedures, triggers)
- PostgreSQL — used in eSign Platform
- MongoDB — used in UniMeet (MERN stack); also holds MongoDB Associate Developer certification
- SQLite
- Redis — used in eSign Platform for async task processing (with Celery)

## Tools / Platforms
- Git
- GitHub
- Docker — used to containerize the DataPower development environment
- Postman
- VS Code
- Figma
- WSL2
- Linux/Ubuntu

## Cloud & Networking Concepts
- Railway — deployment platform for eSign Platform (backend and frontend)
- Cloudflare R2 — document storage for eSign Platform
- IBM DataPower Gateway (IDG) — enterprise API management (internship at Bottrion Systems)
- JWT (JSON Web Tokens) — authentication in eSign Platform and UniMeet
- TLS/SSL — TLS client profiles configured during internship
- REST APIs — designed across multiple projects

## Cybersecurity (Applied / Lab-Based)
*Note: Resume lists these under "Cybersecurity" as hands-on TryHackMe labs, not formal certifications.*
- Linux
- Active Directory
- Nmap
- Wireshark
- Metasploit

## Other Technical Skills
- XSLT transformations (enterprise API traffic security/routing)
- AAA policies (Authentication, Authorization, Accounting) configuration
- XML Firewalls, Multi-Protocol Gateways, Web Service Proxies (IBM DataPower)
- Celery (async task queue)
- SendGrid (automated email notifications)

---

# Page 5: Projects

## 1. eSign Platform
**One-line description:** A full-stack electronic document signing platform supporting multi-user signing workflows and a complete audit trail.

**Technologies Used:** Django, React, TypeScript, PostgreSQL, Redis, Celery, Cloudflare R2

**Timeframe:** May – Jul 2026

**Detailed Description:**
A full-stack electronic document signing platform built to support multi-user signing workflows, package management, and a complete audit trail for all document activities.

**Problem/Purpose:**
*Not explicitly stated in resume beyond the described functionality — inferred purpose is enabling secure, trackable multi-party document signing.* (Marked as resume-implied, not explicitly stated.)

**Key Features:**
- Multi-user signing workflows
- Package management for grouping documents
- Complete audit trail for all document activities
- 10+ RESTful APIs for document upload, package creation, and multi-signer coordination
- JWT authentication and role-based access control
- Asynchronous task processing via Celery + Redis
- Automated email notifications via SendGrid
- Document storage via Cloudflare R2

**Specific Contribution:**
Designed 10+ RESTful APIs for document upload, package creation, and multi-signer coordination; secured APIs with JWT authentication and role-based access control; integrated Celery + Redis for async task processing; integrated SendGrid for automated email notifications; deployed backend and frontend on Railway.

**Notable Technical Aspects:**
- Combined Django backend with a React/TypeScript frontend
- Used Redis-backed Celery for asynchronous processing
- Used Cloudflare R2 (object storage) for document files
- Deployed on Railway

**Results/Outcomes:**
*Not explicitly quantified in resume — no metrics provided.* (Marked as not specified.)

**Links:** Not provided in resume.

---

## 2. UniMeet
**One-line description:** A university appointment management platform with role-based dashboards for Students, Teachers, and Administrators.

**Technologies Used:** MongoDB, Express.js, React, Node.js (MERN Stack)

**Timeframe:** May 2026

**Detailed Description:**
A university appointment management platform with role-based dashboards for Students, Teachers, and Administrators, designed to streamline faculty scheduling across departments.

**Problem/Purpose:**
Streamlining faculty scheduling across departments and reducing scheduling conflicts.

**Key Features:**
- Role-based dashboards for Students, Teachers, and Administrators
- Slot creation for faculty availability
- Meeting request and accept/reject approval workflows
- Real-time browsing and booking of appointments

**Specific Contribution:**
Developed the platform end-to-end; implemented secure JWT authentication and RESTful APIs for slot creation, meeting requests, and accept/reject approval workflows; built a responsive React UI enabling faculty to publish availability and students to browse/book appointments in real time.

**Notable Technical Aspects:**
- Full MERN stack implementation
- JWT-based authentication
- Real-time appointment booking UI

**Results/Outcomes:**
Reduced scheduling conflicts (as stated in resume; no numeric metric provided).

**Links:** Not provided in resume (available on GitHub profile: github.com/Zeeshaan-23, specific repo link not specified).

---

## 3. Hospital Management System
**One-line description:** A normalized relational database system for managing hospital patients, doctors, appointments, and billing.

**Technologies Used:** MySQL

**Timeframe:** May 2026

**Detailed Description:**
A hospital management system built around a normalized relational database schema to manage patients, doctors, appointments, and billing records across multiple departments.

**Problem/Purpose:**
Managing patient, doctor, appointment, and billing data across multiple hospital departments with data integrity.

**Key Features:**
- Normalized relational schema covering patients, doctors, appointments, and billing
- Optimized SQL queries
- Stored procedures and triggers to automate routine operations
- Full CRUD operations for all entities
- Enforced referential integrity

**Specific Contribution:**
Designed the full database schema; wrote optimized SQL queries, stored procedures, and triggers; implemented full CRUD for all entities.

**Notable Technical Aspects:**
- Use of stored procedures and triggers for automation
- Referential integrity enforcement across a multi-entity schema

**Results/Outcomes:**
*Not explicitly quantified in resume.* (Marked as not specified.)

**Links:** Not provided in resume.

---

# Page 6: Certifications

## 1. MongoDB Associate Developer
- **Issuing Organization:** MongoDB
- **Date/Year:** Not specified in resume
- **Relevant Skills/Topics:** MongoDB database development (aligns with UniMeet project, which uses MongoDB)
- **Credential ID/Link:** Not provided in resume
- **Portfolio-friendly note:** Validates hands-on proficiency with MongoDB, directly applied in the UniMeet (MERN stack) project.

## 2. IBM AI Fundamentals
- **Issuing Organization:** IBM
- **Date/Year:** Not specified in resume
- **Relevant Skills/Topics:** AI fundamentals
- **Credential ID/Link:** Not provided in resume
- **Portfolio-friendly note:** Foundational certification in artificial intelligence concepts from IBM.

## 3. Google Vertex AI: Prompt Design
- **Issuing Organization:** Google
- **Date/Year:** Not specified in resume
- **Relevant Skills/Topics:** Prompt design on Google's Vertex AI platform
- **Credential ID/Link:** Not provided in resume
- **Portfolio-friendly note:** Focused certification on prompt design practices within Google's Vertex AI ecosystem.

*Note: The resume does not provide dates or credential IDs/links for any certification — these fields should remain marked "Not specified" unless updated by the user.*

---

# Page 8: Fields of Study

## 1. Software Engineering / Full-Stack Web Development
**Short Explanation:** Building complete web applications spanning frontend, backend, and database layers.
**Relevant Skills/Projects/Certifications:** eSign Platform (Django, React, TypeScript, PostgreSQL), UniMeet (MERN Stack), Hospital Management System (MySQL); languages: Python, JavaScript, TypeScript, SQL; frameworks: React, Django, DRF, Node.js, Express.js, FastAPI
**Why Relevant:** Multiple end-to-end projects demonstrate full-stack capability across two different technology stacks (Django/React and MERN).

## 2. Database Systems / Data Management
**Short Explanation:** Designing, normalizing, and optimizing relational and non-relational databases.
**Relevant Skills/Projects/Certifications:** Hospital Management System (MySQL schema design, stored procedures, triggers); PostgreSQL and Redis usage in eSign Platform; MongoDB usage in UniMeet; MongoDB Associate Developer certification; DBMS coursework
**Why Relevant:** Combines formal coursework (DBMS) with applied project work across three different database technologies (MySQL, PostgreSQL, MongoDB) plus a relevant certification.

## 3. API Architecture & Enterprise Integration
**Short Explanation:** Designing, securing, and managing APIs at an enterprise/production scale.
**Relevant Skills/Projects/Certifications:** Bottrion Systems internship (IBM DataPower Gateway, XML Firewalls, Multi-Protocol Gateways, Web Service Proxies, XSLT transformations, AAA policies, TLS client profiles); RESTful API design in eSign Platform and UniMeet
**Why Relevant:** Direct professional (internship) experience configuring enterprise API gateway infrastructure for production clients, reinforced by REST API design work in personal projects.

## 4. Cybersecurity
**Short Explanation:** Applying security concepts such as authentication, encryption, and network analysis.
**Relevant Skills/Projects/Certifications:** TLS client profiles and AAA policies (internship); JWT authentication and role-based access control (eSign Platform, UniMeet); TryHackMe labs (Linux, Active Directory, Nmap, Wireshark, Metasploit)
**Why Relevant:** Security is present both in professional/production work (TLS, AAA) and in applied self-study (TryHackMe labs), plus consistent use of JWT-based auth across personal projects.

## 5. Artificial Intelligence (Foundational)
**Short Explanation:** Introductory exposure to AI concepts and prompt design.
**Relevant Skills/Projects/Certifications:** IBM AI Fundamentals certification; Google Vertex AI: Prompt Design certification
**Why Relevant:** Certifications indicate foundational, certification-level exposure to AI concepts; resume does not list AI/ML projects, so this field should be framed as foundational knowledge rather than applied project experience.

## 6. Computer Science Theory / Algorithms
**Short Explanation:** Core computer science fundamentals including data structures, algorithms, and systems.
**Relevant Skills/Projects/Certifications:** Coursework — Data Structures & Algorithms, OOPs, Operating Systems, Computer Networks, Design and Analysis of Algorithms; active LeetCode solver; completing Striver's A2Z DSA Sheet
**Why Relevant:** Strong academic foundation combined with active, ongoing competitive programming practice.

---

# Additional Information

## Achievements
- CGPA of 9.41/10.0 at SRM University AP (Aug 2024 – May 2028)

## Competitive Programming
- Active LeetCode solver
- Currently completing Striver's A2Z DSA Sheet

## Cybersecurity Lab Experience
- Hands-on TryHackMe labs covering: Linux, Active Directory, Nmap, Wireshark, Metasploit
*(Note: These are labs/practical exercises as stated in the resume, not certifications — categorized separately from the Certifications page.)*

## Professional Experience Summary
**Bottrion Systems Pvt. Ltd.** — Software Development Intern (Remote), May 2026 – Jul 2026
- Configured IBM DataPower Gateway (IDG) for enterprise API management, implementing XML Firewalls, Multi-Protocol Gateways, and Web Service Proxies for production clients in Saudi Arabia.
- Engineered XSLT transformations, AAA policies, and TLS client profiles to secure and route enterprise API traffic.
- Containerized the DataPower development environment using Docker and WSL2/Ubuntu, reducing environment setup friction.

## Links
- LinkedIn: linkedin.com/in/zeeshaan-suhail
- GitHub: github.com/Zeeshaan-23

## Contact / Professional Information
- Email: zeeshaansuhail23@gmail.com
- Phone: +91 90591 49898
- Location: Sattenapalli, Andhra Pradesh

## Items Not Found in Resume (flagged, not invented)
- No awards or leadership roles listed
- No hackathon participation listed
- No publications listed
- No volunteering activities listed
- No explicit personal interests/hobbies listed
- No certification dates or credential IDs/links provided
- No project repository/live demo links provided
- No explicit professional tagline provided by the candidate (one derived option included on About page, clearly marked as derived)
