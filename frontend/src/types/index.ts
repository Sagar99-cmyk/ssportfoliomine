export interface Profile {
  id: string;
  name: string;
  designation: string;
  tagline: string;
  intro: string;
  aboutBio: string;
  avatarUrl: string;
  resumeUrl: string;
  location: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  kaggleUrl: string;
  availabilityStatus: string;
  isAvailable: boolean;
  stats: {
    yearsExperience: number;
    dashboardsDelivered: number;
    rowsProcessed: string;
    forecastAccuracy: string;
  };
  aboutDetails?: {
    philosophy?: string;
    highlights?: string[];
    pillars?: { title: string; desc: string; icon?: string }[];
  };
}

export type SkillCategory = 'Business Intelligence' | 'Databases' | 'Programming' | 'Spreadsheets' | 'Analytics' | string;

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  iconUrl?: string;
  description: string;
  toolsUsed: string[];
  projectsCount: number;
  featured: boolean;
}

export interface CaseStudy {
  overview: string;
  businessProblem: string;
  datasetInfo: string;
  dataCleaningPrep: string;
  methodology: string;
  codeSnippets?: {
    language: 'sql' | 'dax' | 'python' | 'r';
    title: string;
    code: string;
  }[];
  keyFindings: string[];
  recommendations: string[];
  limitations: string;
  dashboardFeatures?: string[];
}

export interface Project {
  id: string;
  title: string;
  projectType?: 'Major Project' | 'Minor Project' | 'Micro/Mini Project' | string;
  shortDescription: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  featured: boolean;
  thumbnailUrl: string;
  technologies: string[];
  skills?: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  dateCreated: string;
  caseStudy: CaseStudy;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  gradeGpa: string;
  description: string;
  highlights: string[];
  level?: string;
  order?: number;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  category?: string;
  description?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  skills: string[];
  credentialId?: string;
}

export interface ContactReply {
  id: string;
  messageId: string;
  recipientEmail: string;
  senderEmail: string;
  subject: string;
  replyContent: string;
  providerMessageId?: string;
  status: 'sent' | 'failed' | 'queued';
  errorDetails?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  company?: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied?: boolean;
  replyText?: string;
  repliedAt?: string;
  archived?: boolean;
  replies?: ContactReply[];
}

export interface AppearanceSettings {
  primaryTheme: 'system' | 'light' | 'dark';
  accentColor: 'burgundy' | 'crimson' | 'charcoal';
  enableGlassmorphic: boolean;
  enable3dBackground: boolean;
  enableReducedMotion: boolean;
}

export interface SystemMetrics {
  totalProjects: number;
  featuredProjects: number;
  totalSkills: number;
  unreadMessages: number;
  totalMessages: number;
  resumeDownloadsCount: number;
  lastUpdated: string;
  serverStatus: 'online' | 'maintenance' | 'offline';
}
