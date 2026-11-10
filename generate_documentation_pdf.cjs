const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function createDocumentationPDF() {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 45, bottom: 45, left: 50, right: 50 },
    bufferPages: true,
  });

  const outputPath = path.join(__dirname, 'PROJECT_DOCUMENTATION.pdf');
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Color Palette
  const primaryColor = '#e11d48';     // Crimson Rose
  const darkNavy = '#0f172a';         // Deep Slate / Navy
  const textDark = '#1e293b';         // Primary Text
  const textMuted = '#64748b';        // Secondary Text
  const bgLight = '#f8fafc';          // Light Card Fill
  const borderColor = '#e2e8f0';      // Subtle Border

  // Helper: Section Header
  function drawSectionHeader(title, subtitle) {
    doc.moveDown(0.8);
    doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text(title.toUpperCase(), { tracking: 1.5 });
    if (subtitle) {
      doc.fillColor(textMuted).fontSize(9.5).font('Helvetica').text(subtitle);
    }
    doc.moveDown(0.3);
    doc.strokeColor(primaryColor).lineWidth(1.5).moveTo(doc.x, doc.y).lineTo(doc.x + 495, doc.y).stroke();
    doc.moveDown(0.6);
  }

  // Helper: Card Box
  function drawCard(x, y, width, height, title, desc) {
    doc.roundedRect(x, y, width, height, 6).fillAndStroke(bgLight, borderColor);
    doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text(title, x + 10, y + 8);
    doc.fillColor(textDark).fontSize(8.5).font('Helvetica').text(desc, x + 10, y + 22, { width: width - 20, lineGap: 2 });
  }

  // ==========================================
  // PAGE 1: TITLE & EXECUTIVE SUMMARY
  // ==========================================
  
  // Header Accent Band
  doc.rect(50, 40, 495, 6).fill(primaryColor);

  doc.moveDown(1.5);
  doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('ENTERPRISE DATA ANALYTICS & FULL-STACK PORTFOLIO', { tracking: 2 });
  doc.moveDown(0.2);
  doc.fillColor(darkNavy).fontSize(24).font('Helvetica-Bold').text('System Architecture & Project Blueprint');
  doc.fillColor(textMuted).fontSize(10.5).font('Helvetica').text('Author: Sagar Singh  |  BCA (Data Analytics & BI)  |  Public Release Specification');
  
  doc.moveDown(0.5);
  doc.strokeColor(borderColor).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.8);

  // Executive Summary Card
  const execCardY = doc.y;
  doc.roundedRect(50, execCardY, 495, 82, 8).fillAndStroke('#fff1f2', '#fecdd3');
  doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Executive Overview', 65, execCardY + 10);
  doc.fillColor(textDark).fontSize(9).font('Helvetica').text(
    'A production-grade, full-stack Data Analytics showcase engineered with React 18, TypeScript, Three.js, Node.js, and relational database persistence. ' +
    'The application features interactive 3D WebGL data visualizations, flagship Power BI dashboard case studies analyzing $2.4M+ in enterprise sales, ' +
    'a real-time dual contact communication suite with automated Gmail SMTP notification dispatch, and a secure decoupled admin management portal.',
    65, execCardY + 26, { width: 465, lineGap: 3 }
  );

  doc.y = execCardY + 95;

  // Key System Metrics
  drawSectionHeader('1. Core Performance & Project Impact Metrics', 'Quantified accomplishments delivered within this platform');

  const metricY = doc.y;
  const colW = 115;
  const gutter = 11;

  const metrics = [
    { value: '$2.4M+', label: 'Sales Analyzed', sub: 'Flagship Power BI Dashboard' },
    { value: '50,000+', label: 'Records Handled', sub: 'ETL & SQL Optimization' },
    { value: '100% Free', label: 'Gmail Automation', sub: 'Direct Nodemailer SMTP Relay' },
    { value: '< 1.2s', label: 'Initial Page Load', sub: 'Optimized Edge CDN Delivery' },
  ];

  metrics.forEach((m, idx) => {
    const mx = 50 + idx * (colW + gutter);
    doc.roundedRect(mx, metricY, colW, 64, 6).fillAndStroke(bgLight, borderColor);
    doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text(m.value, mx, metricY + 8, { width: colW, align: 'center' });
    doc.fillColor(textDark).fontSize(8.5).font('Helvetica-Bold').text(m.label, mx, metricY + 28, { width: colW, align: 'center' });
    doc.fillColor(textMuted).fontSize(7.5).font('Helvetica').text(m.sub, mx, metricY + 44, { width: colW, align: 'center' });
  });

  doc.y = metricY + 76;

  // Public Access & Decoupled Security Model
  drawSectionHeader('2. Public Access & Zero-Trust Security Model', 'Strict separation of public client and private cloud resources');

  doc.fillColor(textDark).fontSize(9).font('Helvetica').text(
    'In strict accordance with modern security standards, this repository maintains an absolute zero-trust boundary:',
    { lineGap: 3 }
  );
  doc.moveDown(0.4);

  const securityPoints = [
    { title: 'Public Client Deployment', desc: 'The public user portal is hosted on high-performance Edge infrastructure and accessible at https://ssportfoliomines.vercel.app/. No backend database connection strings or internal service credentials are ever exposed.' },
    { title: 'Isolated Cloud Backend', desc: 'The relational backend and database operate in an isolated cloud environment. Access is gated by strict CORS allowlists, IP restrictions, and rate limiters.' },
    { title: 'Credential Obfuscation', desc: 'All API keys, JWT secrets, and database passwords reside exclusively in protected cloud environment variables. Tracked repository files include only sanitized .env.example templates.' },
    { title: 'Automated Contact Relay', desc: 'Form submissions trigger server-side sanitized validation, transactional database insertion, and instant Nodemailer SMTP dispatch to the administrator without exposing mail server credentials.' }
  ];

  securityPoints.forEach(pt => {
    doc.circle(58, doc.y + 4.5, 2.5).fill(primaryColor);
    doc.fillColor(textDark).fontSize(9).font('Helvetica-Bold').text(pt.title + ': ', 68, doc.y, { continued: true });
    doc.fillColor(textDark).font('Helvetica').text(pt.desc, { lineGap: 2 });
    doc.moveDown(0.4);
  });

  // ==========================================
  // PAGE 2: FULL-STACK ARCHITECTURE & WORKFLOW
  // ==========================================
  doc.addPage();

  drawSectionHeader('3. System Architecture & Component Interaction Flow', 'End-to-end request lifecycle and automated event pipelines');

  doc.fillColor(textDark).fontSize(9).font('Helvetica').text(
    'The diagram below illustrates the end-to-end data lifecycle across the public visitor interface, client-side rendering engines, ' +
    'cloud API microservices, relational persistence layers, and external notification gateways.',
    { lineGap: 3 }
  );
  doc.moveDown(0.8);

  // Text-based High-Res Architecture Diagram Box
  const archBoxY = doc.y;
  doc.roundedRect(50, archBoxY, 495, 185, 8).fillAndStroke('#0f172a', '#1e293b');

  doc.fillColor('#38bdf8').fontSize(9).font('Helvetica-Bold').text('VISITOR & CLIENT LAYER (Edge CDN / Vercel)', 65, archBoxY + 12);
  doc.fillColor('#f8fafc').fontSize(8).font('Helvetica').text(
    'Interactive 3D WebGL Canvas  |  Audio Engine  |  Glassmorphic Responsive UI  |  Live Capstone Gallery',
    65, archBoxY + 26
  );

  doc.strokeColor('#334155').lineWidth(1).moveTo(65, archBoxY + 42).lineTo(530, archBoxY + 42).stroke();

  doc.fillColor('#fbbf24').fontSize(9).font('Helvetica-Bold').text('COMMUNICATION & API GATEWAY LAYER (Node.js & Express)', 65, archBoxY + 52);
  doc.fillColor('#f8fafc').fontSize(8).font('Helvetica').text(
    'Strict CORS  *  Input Validation  *  JWT Authentication  *  Rate Limiting  *  Real-Time SSE Event Stream',
    65, archBoxY + 66
  );

  doc.strokeColor('#334155').lineWidth(1).moveTo(65, archBoxY + 82).lineTo(530, archBoxY + 82).stroke();

  doc.fillColor('#4ade80').fontSize(9).font('Helvetica-Bold').text('DATA PERSISTENCE LAYER (Relational MySQL Database)', 65, archBoxY + 92);
  doc.fillColor('#f8fafc').fontSize(8).font('Helvetica').text(
    'Connection Pooling  *  Automated SQL Schema Migrations  *  Normalized Relational Tables  *  Offline Fallback',
    65, archBoxY + 106
  );

  doc.strokeColor('#334155').lineWidth(1).moveTo(65, archBoxY + 122).lineTo(530, archBoxY + 122).stroke();

  doc.fillColor('#f43f5e').fontSize(9).font('Helvetica-Bold').text('NOTIFICATION & EXTERNAL AUTOMATION GATEWAYS', 65, archBoxY + 132);
  doc.fillColor('#f8fafc').fontSize(8).font('Helvetica').text(
    '1. Nodemailer SMTP: Instant direct alert to sirroshan999@gmail.com\n' +
    '2. Webhook Forwarding: Optional Make.com / Zapier trigger payloads\n' +
    '3. Instant WhatsApp & Phone Actions: Client-side dynamic protocol deep-linking',
    65, archBoxY + 146, { lineGap: 2 }
  );

  doc.y = archBoxY + 200;

  // Contact Automation Deep Dive
  drawSectionHeader('4. Contact Form Automated Pipeline (Nodemailer)', 'Zero-cost, unlimited instant Gmail notification engine');

  doc.fillColor(textDark).fontSize(9).font('Helvetica').text(
    'When a recruiter or prospective collaborator submits an inquiry on the portfolio, the backend triggers a synchronized dual-path workflow:',
    { lineGap: 3 }
  );
  doc.moveDown(0.4);

  const contactFlow = [
    'Path A - Transactional Storage: Sanitized payloads (Name, Email, Subject, Company, Message, IP, Timestamp) are saved to MySQL.',
    'Path B - Real-Time Admin Alert: Server-Sent Events (SSE) immediately broadcast a notification to the Netlify Admin Inbox.',
    'Path C - Direct Gmail Forwarding: Nodemailer establishes an encrypted TLS SMTP handshake and sends a formatted HTML email directly to the administrator’s Gmail inbox, bypassing third-party subscription charges.',
    'Path D - Optional Webhook Relay: If configured, a JSON payload is dispatched to Make.com/Zapier for CRM integration.'
  ];

  contactFlow.forEach((item, i) => {
    doc.fillColor(primaryColor).fontSize(8.5).font('Helvetica-Bold').text(`Step ${i + 1}: `, 55, doc.y, { continued: true });
    doc.fillColor(textDark).font('Helvetica').text(item, { lineGap: 2 });
    doc.moveDown(0.3);
  });

  // ==========================================
  // PAGE 3: RELATIONAL DATABASE & ER DIAGRAM
  // ==========================================
  doc.addPage();

  drawSectionHeader('5. Relational Database Schema & Entity-Relationship (ERD)', 'Normalized structure ensuring data integrity and fast retrieval');

  doc.fillColor(textDark).fontSize(9).font('Helvetica').text(
    'The database architecture utilizes normalized MySQL schemas with indexed foreign keys, relational join tables, ' +
    'and transactional audit fields. Below is the specification of core entities:',
    { lineGap: 3 }
  );
  doc.moveDown(0.6);

  const tables = [
    {
      name: 'PROFILES',
      desc: 'Stores core identity, designation, executive bio, social URLs, and live KPI stats.',
      fields: 'id (PK), name, designation, tagline, about_bio, email, phone, location, linkedin_url, github_url, stats_json'
    },
    {
      name: 'PROJECTS',
      desc: 'Contains portfolio projects, difficulty ratings, live demo links, and comprehensive case studies.',
      fields: 'id (PK), title, project_type, short_description, category, difficulty, featured, case_study_json, date_created'
    },
    {
      name: 'SKILLS & PROJECT_SKILLS',
      desc: 'Technical competency catalog linked via many-to-many relationship mapping projects to applied skills.',
      fields: 'id (PK), name, category, proficiency_level, icon_url, description, tools_used_json | project_id (FK), skill_id (FK)'
    },
    {
      name: 'EDUCATION & ACHIEVEMENTS',
      desc: 'Academic timeline (Presidency College BCA) alongside certified honors (IT Quiz 2nd Place, NCC Sergeant).',
      fields: 'id (PK), degree/title, institution/issuer, period/issue_date, grade_gpa, highlights_json, credential_url'
    },
    {
      name: 'CONTACT_MESSAGES & REPLIES',
      desc: 'Incoming visitor inquiries tracked through lifecycle states (unread, read, replied, archived) with audit logs.',
      fields: 'id (PK), name, email, subject, company, message, status, reply_content, ip_address, created_at, updated_at'
    }
  ];

  tables.forEach(t => {
    const cardY = doc.y;
    doc.roundedRect(50, cardY, 495, 46, 5).fillAndStroke(bgLight, borderColor);
    doc.fillColor(primaryColor).fontSize(9.5).font('Helvetica-Bold').text(t.name, 62, cardY + 7);
    doc.fillColor(textDark).fontSize(8.5).font('Helvetica').text(t.desc, 62, cardY + 20, { width: 470 });
    doc.fillColor(textMuted).fontSize(7.5).font('Courier').text('Fields: ' + t.fields, 62, cardY + 32, { width: 470 });
    doc.y = cardY + 52;
  });

  doc.moveDown(0.4);

  // ERD Visual Schema Summary
  drawSectionHeader('6. Entity-Relationship Cardinality Overview', 'Key relational dependencies and foreign constraints');

  const erdY = doc.y;
  doc.roundedRect(50, erdY, 495, 105, 6).fillAndStroke('#0f172a', '#1e293b');

  doc.fillColor('#38bdf8').fontSize(8.5).font('Courier-Bold').text('[PROFILES]  1  ────  *  [METRICS] (Dashboard delivery, experience years)', 65, erdY + 12);
  doc.fillColor('#fbbf24').fontSize(8.5).font('Courier-Bold').text('[PROJECTS]  1  ────  *  [PROJECT_SKILLS]  *  ────  1  [SKILLS]', 65, erdY + 34);
  doc.fillColor('#a78bfa').fontSize(8.5).font('Courier-Bold').text('[EDUCATION] 1  ────  *  [ACHIEVEMENTS] (BCA coursework & NCC honors)', 65, erdY + 56);
  doc.fillColor('#f43f5e').fontSize(8.5).font('Courier-Bold').text('[CONTACT_MESSAGES] 1 ────  *  [CONTACT_REPLIES] (Email communication trail)', 65, erdY + 78);

  doc.y = erdY + 118;

  // ==========================================
  // PAGE 4: PROJECT SHOWCASE & TECH MATRIX
  // ==========================================
  doc.addPage();

  drawSectionHeader('7. Flagship Project Showcase', 'Detailed breakdown of featured analytical implementations');

  const showcaseProjects = [
    {
      title: 'Sales Performance & Customer Analytics Dashboard (Flagship)',
      stack: 'Power BI  |  Advanced Excel  |  MySQL  |  DAX Measures  |  ETL Pipeline',
      details: 'Conducted end-to-end exploratory and predictive analysis across 50,000+ enterprise sales records representing $2.4M in revenue. Designed dynamic KPI cards, customer acquisition cohorts, profit margin waterfalls, and automated monthly forecasting models with 96.4% precision.'
    },
    {
      title: 'PG Rental Management Web Application',
      stack: 'React.js  |  Node.js  |  MySQL  |  RESTful API  |  Role-Based Access Control',
      details: 'Engineered a full-stack property management platform featuring room allocation matrices, automated monthly billing, tenant verification workflows, and relational schema optimization across tenants, leases, and payments.'
    },
    {
      title: 'Healthcare Patient Inpatient & Financial Risk Analysis',
      stack: 'Python  |  Pandas  |  NumPy  |  Matplotlib  |  Statistical Aggregation',
      details: 'Cleaned and evaluated hospital admission datasets to uncover length-of-stay bottlenecks, insurance claim rejection correlations, and financial risk indicators for clinical operational efficiency.'
    }
  ];

  showcaseProjects.forEach(proj => {
    const cardY = doc.y;
    doc.roundedRect(50, cardY, 495, 68, 6).fillAndStroke(bgLight, borderColor);
    doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text(proj.title, 62, cardY + 8);
    doc.fillColor(textMuted).fontSize(8).font('Helvetica-Bold').text(proj.stack, 62, cardY + 22);
    doc.fillColor(textDark).fontSize(8).font('Helvetica').text(proj.details, 62, cardY + 34, { width: 470, lineGap: 2 });
    doc.y = cardY + 76;
  });

  doc.moveDown(0.2);

  drawSectionHeader('8. Comprehensive Technology Stack Matrix', 'Modular technologies utilized across the software lifecycle');

  const techStack = [
    { domain: 'Frontend & UI', tech: 'React 18, TypeScript, Vite, Tailwind CSS, Motion (Framer Motion), Three.js WebGL, Lucide Icons' },
    { domain: 'Backend & APIs', tech: 'Node.js, Express.js, TypeScript, RESTful Endpoints, Server-Sent Events (SSE), Nodemailer TLS SMTP' },
    { domain: 'Databases & ORM', tech: 'MySQL Relational Database, Connection Pooling, Raw SQL Prepared Statements, Automated Migrations' },
    { domain: 'Data Analytics & BI', tech: 'Power BI, DAX Measures, Advanced Excel (Pivot/XLOOKUP), Python (Pandas/NumPy), SQL Aggregations' },
    { domain: 'DevOps & Hosting', tech: 'Vercel (Client Portal), Netlify (Admin Console), Cloud Microservices, Git/GitHub CI/CD' },
    { domain: 'Security & Auth', tech: 'JWT Token Verification, Bcrypt Password Encryption, Rate Limiting, Input Sanitization' }
  ];

  techStack.forEach(t => {
    doc.circle(58, doc.y + 4.5, 2.5).fill(primaryColor);
    doc.fillColor(primaryColor).fontSize(8.5).font('Helvetica-Bold').text(t.domain + ': ', 68, doc.y, { continued: true });
    doc.fillColor(textDark).font('Helvetica').text(t.tech, { lineGap: 1.5 });
    doc.moveDown(0.25);
  });

  // Footer on all pages
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.strokeColor(borderColor).lineWidth(0.8).moveTo(50, 792).lineTo(545, 792).stroke();
    doc.fillColor(textMuted).fontSize(8).font('Helvetica').text(
      'Sagar Singh Portfolio System Blueprint  |  Confidential & Public Release  |  Live at https://ssportfoliomines.vercel.app/',
      50, 798, { width: 400 }
    );
    doc.fillColor(textMuted).fontSize(8).font('Helvetica').text(
      `Page ${i + 1} of ${pageCount}`,
      445, 798, { width: 100, align: 'right' }
    );
  }

  doc.end();
}

createDocumentationPDF();
console.log('PDF generation complete: PROJECT_DOCUMENTATION.pdf');
