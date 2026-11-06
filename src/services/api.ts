import {
  Profile,
  Skill,
  Project,
  Education,
  Achievement,
  ContactMessage,
  ContactReply,
  SystemMetrics,
  AppearanceSettings,
} from '../types';
import {
  DEFAULT_PROFILE,
  DEFAULT_SKILLS,
  DEFAULT_EDUCATION,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_PROJECTS,
} from '../data/defaultData';

export function normalizeProject(raw: any): Project {
  if (!raw) return DEFAULT_PROJECTS[0];
  return {
    id: raw.id || `proj-${Math.random().toString(36).substring(2, 7)}`,
    title: raw.title || 'Untitled Project',
    projectType: raw.projectType || raw.project_type || 'Major Project',
    shortDescription: raw.shortDescription || raw.short_description || raw.description || '',
    category: raw.category || 'Data Analytics',
    difficulty: raw.difficulty || 'Advanced',
    featured: raw.featured !== undefined ? Boolean(raw.featured) : true,
    thumbnailUrl: raw.thumbnailUrl || raw.thumbnail_url || '/projects/sales-dashboard.png',
    technologies: Array.isArray(raw.technologies)
      ? raw.technologies
      : (typeof raw.technologies === 'string'
        ? (raw.technologies.startsWith('[') ? JSON.parse(raw.technologies) : raw.technologies.split(',').map((s: string) => s.trim()))
        : []),
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    liveDemoUrl: raw.liveDemoUrl || raw.live_demo_url || 'https://github.com/Sagar99-cmyk',
    githubUrl: raw.githubUrl || raw.github_url || 'https://github.com/Sagar99-cmyk',
    linkedinUrl: raw.linkedinUrl || raw.linkedin_url || 'https://linkedin.com/in/sagarsingh2005',
    youtubeUrl: raw.youtubeUrl || raw.youtube_url || '',
    dateCreated: raw.dateCreated || raw.date_created || '2026-03-01',
    caseStudy: raw.caseStudy || raw.case_study || {
      overview: raw.shortDescription || raw.short_description || 'Detailed technical breakdown and case study.',
      businessProblem: 'Data fragmentation and reporting latency across disconnected spreadsheets.',
      datasetInfo: 'Transactional database records and multi-year retail datasets.',
      dataCleaningPrep: 'Standardized schemas, automated ETL, and null handling.',
      methodology: 'Star schema relational modeling and interactive visual KPI metrics.',
      keyFindings: ['Identified revenue growth patterns and executive performance KPIs.'],
      recommendations: ['Maintain automated reporting pipelines and predictive restocking.'],
      limitations: 'Offline sync intervals.'
    }
  };
}

export function normalizeEducation(raw: any): Education {
  if (!raw) return DEFAULT_EDUCATION[0];
  let highlights = Array.isArray(raw.highlights)
    ? raw.highlights
    : (typeof raw.highlights === 'string'
      ? (raw.highlights.startsWith('[') ? JSON.parse(raw.highlights) : [raw.highlights])
      : []);
  return {
    id: raw.id || `edu-${Math.random().toString(36).substring(2, 7)}`,
    degree: raw.degree || '',
    institution: raw.institution || '',
    location: raw.location || '',
    period: raw.period || '',
    gradeGpa: raw.gradeGpa || raw.grade_gpa || '',
    description: raw.description || '',
    highlights,
    level: raw.level || (raw.hierarchy_level ? `Level ${raw.hierarchy_level}` : undefined),
    order: raw.order ?? raw.display_order ?? raw.hierarchy_level ?? 1
  };
}

export function normalizeAchievement(raw: any): Achievement {
  if (!raw) return DEFAULT_ACHIEVEMENTS[0];
  let skills = Array.isArray(raw.skills)
    ? raw.skills
    : (Array.isArray(raw.skills_tags)
      ? raw.skills_tags
      : (typeof raw.skills_tags === 'string'
        ? (raw.skills_tags.startsWith('[') ? JSON.parse(raw.skills_tags) : raw.skills_tags.split(',').map((s: string) => s.trim()))
        : []));
  return {
    id: raw.id || `ach-${Math.random().toString(36).substring(2, 7)}`,
    title: raw.title || '',
    issuer: raw.issuer || '',
    issueDate: raw.issueDate || raw.issue_date || '',
    credentialUrl: raw.credentialUrl || raw.credential_url || '',
    credentialId: raw.credentialId || raw.credential_id || '',
    category: raw.category || 'Honors & Certifications',
    skills,
    badgeUrl: raw.badgeUrl || raw.badge_url || '',
    description: raw.description || ''
  };
}

const getBaseUrl = (): string => {
  // 1. Explicit Vite Environment Variable (e.g. from Embarko or deployment dashboard: VITE_API_URL)
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
    const envUrl = ((import.meta as any).env.VITE_API_URL as string).trim().replace(/\/+$/, '');
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;

    // 2. Localhost development environments
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      if (port && port !== '3000' && port !== '3001') {
        return `http://${hostname}:3000/api`;
      }
      return '/api';
    }

    // 3. Online Production Deployment (e.g. Embarko, Vercel, Netlify)
    // Points directly to the deployed Render backend service
    const DEFAULT_RENDER_BACKEND = 'https://ssportfoliomine.onrender.com';
    return `${DEFAULT_RENDER_BACKEND}/api`;
  }

  return '/api';
};

class ApiService {
  private tokenKey = 'sagar_admin_token';
  // Strictly in-memory token: never stored in localStorage, sessionStorage, or IndexedDB.
  // Requires manual authentication on page reload or reopening admin tab.
  private authToken: string | null = null;

  constructor() {
    // Purge any legacy tokens from browser storage to ensure compliance
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(this.tokenKey);
        window.localStorage.removeItem(this.tokenKey);
      } catch {}
    }
  }

  getApiBaseUrl(): string {
    return getBaseUrl();
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
    // Strictly keep token in memory; ensure nothing touches persistent storage
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(this.tokenKey);
        window.localStorage.removeItem(this.tokenKey);
      } catch {}
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const primaryUrl = `${getBaseUrl()}${endpoint}`;
    const fallbackUrl = `/api${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(primaryUrl, {
        ...options,
        headers,
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || json.message || 'API Request failed');
      }

      return (json.data !== undefined && json.data !== null ? json.data : json) as T;
    } catch (primaryErr) {
      // If primary failed and primary was not fallback, try fallback relative /api
      if (primaryUrl !== fallbackUrl) {
        try {
          const fbResponse = await fetch(fallbackUrl, {
            ...options,
            headers,
          });
          const fbJson = await fbResponse.json();
          if (fbResponse.ok && fbJson.success) {
            return (fbJson.data !== undefined && fbJson.data !== null ? fbJson.data : fbJson) as T;
          }
        } catch {}
      }
      console.warn(`[API Connection] Network error on ${endpoint}:`, primaryErr);
      throw primaryErr;
    }
  }

  // Admin Authentication with MySQL PBKDF2 Hashed Credentials
  async adminLogin(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${getBaseUrl()}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Admin authentication failed');
    }

    this.setAuthToken(json.token);
    return { token: json.token, user: json.user };
  }

  async verifyAdminAuth(): Promise<{ valid: boolean; user?: any }> {
    if (!this.authToken) return { valid: false };
    try {
      const res = await this.request<{ user: any }>('/admin/verify');
      return { valid: true, user: res.user };
    } catch {
      this.setAuthToken(null);
      return { valid: false };
    }
  }

  adminLogout(): void {
    this.setAuthToken(null);
  }

  // Profile
  async getProfile(): Promise<Profile> {
    try {
      const res = await this.request<any>('/profile');
      if (res && res.name) {
        return {
          ...DEFAULT_PROFILE,
          ...res,
          stats: {
            ...DEFAULT_PROFILE.stats,
            ...(res.stats || {})
          }
        };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    return this.request<Profile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    try {
      const res = await this.request<any[]>('/skills');
      if (Array.isArray(res) && res.length > 0) {
        return res.map(s => ({
          id: s.id || `skill-${Math.random()}`,
          name: s.name || '',
          category: s.category || 'Data Analytics',
          proficiencyLevel: s.proficiencyLevel || s.proficiency_level || 'Advanced',
          description: s.description || '',
          toolsUsed: Array.isArray(s.toolsUsed) ? s.toolsUsed : (Array.isArray(s.tools_used) ? s.tools_used : []),
          projectsCount: s.projectsCount ?? s.projects_count ?? 3,
          featured: Boolean(s.featured)
        }));
      }
      return DEFAULT_SKILLS;
    } catch {
      return DEFAULT_SKILLS;
    }
  }

  async createSkill(data: Omit<Skill, 'id' | 'projectsCount'>): Promise<Skill> {
    return this.request<Skill>('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    return this.request<Skill>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async reorderSkills(skillIds: string[]): Promise<Skill[]> {
    return this.request<Skill[]>('/skills/reorder', {
      method: 'PUT',
      body: JSON.stringify({ skillIds }),
    });
  }

  async deleteSkill(id: string): Promise<void> {
    await this.request(`/skills/${id}`, { method: 'DELETE' });
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const res = await this.request<any[]>('/projects');
      if (Array.isArray(res) && res.length > 0) {
        return res.map(normalizeProject);
      }
      return DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  }

  async getProject(id: string): Promise<Project> {
    try {
      const res = await this.request<any>(`/projects/${id}`);
      return normalizeProject(res);
    } catch {
      const fallback = DEFAULT_PROJECTS.find(p => p.id === id) || DEFAULT_PROJECTS[0];
      return fallback;
    }
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  // Technologies (Normalized MySQL Table & Junction Relations)
  async getTechnologies(): Promise<any[]> {
    return this.request<any[]>('/technologies');
  }

  async createTechnology(data: { name: string; category?: string; icon?: string; proficiency?: string }): Promise<any> {
    return this.request<any>('/technologies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTechnology(id: string | number, data: Partial<{ name: string; category: string; icon: string; proficiency: string }>): Promise<any> {
    return this.request<any>(`/technologies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTechnology(id: string | number): Promise<void> {
    await this.request(`/technologies/${id}`, { method: 'DELETE' });
  }

  async uploadImage(imageBase64: string, filename?: string): Promise<{ url: string; filename: string }> {
    const res = await this.request<{ url: string; filename?: string }>('/admin/upload', {
      method: 'POST',
      body: JSON.stringify({ imageBase64, filename }),
    });
    return { url: res.url, filename: res.filename || filename || 'screenshot.png' };
  }

  async uploadResume(pdfBase64: string, filename?: string): Promise<{ url: string; filename: string; message: string }> {
    const res = await this.request<{ url: string; filename?: string; message?: string }>('/admin/upload-resume', {
      method: 'POST',
      body: JSON.stringify({ pdfBase64, filename }),
    });
    return {
      url: res.url,
      filename: res.filename || filename || 'Sagar_Singh_Resume.pdf',
      message: res.message || 'Resume uploaded successfully.',
    };
  }

  // Education
  async getEducation(): Promise<Education[]> {
    try {
      const res = await this.request<any[]>('/education');
      if (Array.isArray(res) && res.length > 0) {
        return res.map(normalizeEducation);
      }
      return DEFAULT_EDUCATION;
    } catch {
      return DEFAULT_EDUCATION;
    }
  }

  async createEducation(data: Partial<Education>): Promise<Education> {
    return this.request<Education>('/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    return this.request<Education>(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEducation(id: string): Promise<void> {
    await this.request(`/education/${id}`, { method: 'DELETE' });
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const res = await this.request<any[]>('/achievements');
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(normalizeAchievement);
        const existingTitles = new Set(mapped.map(m => m.title.toLowerCase().trim()));
        const additionalDefaults = DEFAULT_ACHIEVEMENTS.filter(d => !existingTitles.has(d.title.toLowerCase().trim()));
        return [...mapped, ...additionalDefaults];
      }
      return DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  }

  async createAchievement(data: Partial<Achievement>): Promise<Achievement> {
    return this.request<Achievement>('/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement> {
    return this.request<Achievement>(`/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAchievement(id: string): Promise<void> {
    await this.request(`/achievements/${id}`, { method: 'DELETE' });
  }

  // Messages & Email Inbox
  async getMessages(filters?: { status?: string; search?: string }): Promise<ContactMessage[]> {
    let url = '/messages';
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    const qs = params.toString();
    if (qs) url += `?${qs}`;
    return this.request<ContactMessage[]>(url);
  }

  async sendMessage(data: { name: string; email: string; subject: string; message: string; company?: string }): Promise<ContactMessage> {
    return this.request<ContactMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markMessageRead(id: string, read: boolean = true): Promise<void> {
    await this.request(`/messages/${id}/read`, {
      method: 'PUT',
      body: JSON.stringify({ read }),
    });
  }

  async archiveMessage(id: string, archived: boolean = true): Promise<void> {
    await this.request(`/messages/${id}/archive`, {
      method: 'PUT',
      body: JSON.stringify({ archived }),
    });
  }

  async getMessageReplies(id: string): Promise<ContactReply[]> {
    return this.request<ContactReply[]>(`/messages/${id}/replies`);
  }

  async replyMessage(id: string, replyText: string): Promise<ContactMessage> {
    const res = await this.sendEmailReply(id, replyText);
    return res.data;
  }

  async sendEmailReply(
    id: string,
    replyText: string,
    senderEmail?: string,
    senderName?: string
  ): Promise<{ data: ContactMessage; reply: ContactReply; emailSent: boolean; emailError?: string; message: string }> {
    return this.request<{ data: ContactMessage; reply: ContactReply; emailSent: boolean; emailError?: string; message: string }>(
      `/messages/${id}/reply`,
      {
        method: 'POST',
        body: JSON.stringify({ replyText, senderEmail, senderName }),
      }
    );
  }

  async deleteMessage(id: string): Promise<void> {
    await this.request(`/messages/${id}`, { method: 'DELETE' });
  }

  // Metrics & Resume Track
  async getMetrics(): Promise<SystemMetrics> {
    return this.request<SystemMetrics>('/metrics');
  }

  async trackResumeDownload(): Promise<{ downloadUrl: string; viewUrl?: string; totalDownloads: number }> {
    return this.request<{ downloadUrl: string; viewUrl?: string; totalDownloads: number }>('/resume/download', {
      method: 'POST',
    });
  }

  async getPowerBiAnalytics(): Promise<any> {
    return this.request<any>('/analytics/powerbi');
  }

  // Appearance
  async getAppearance(): Promise<AppearanceSettings> {
    return this.request<AppearanceSettings>('/appearance');
  }

  async updateAppearance(data: Partial<AppearanceSettings>): Promise<AppearanceSettings> {
    return this.request<AppearanceSettings>('/appearance', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Gemini AI Assistant
  async getAiStatus(): Promise<{ isConfigured: boolean; model: string; appUrl: string; port: number }> {
    return this.request<{ isConfigured: boolean; model: string; appUrl: string; port: number }>('/ai/status');
  }

  async askAi(message: string): Promise<{ reply: string; model: string }> {
    return this.request<{ reply: string; model: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Sarvam AI Multilingual Suite (Text-to-Text, TTS, STT, Speech-to-Speech)
  async getSarvamStatus(): Promise<{
    isConfigured: boolean;
    provider: string;
    chatModel: string;
    ttsModel: string;
    sttModel: string;
    languages: { code: string; name: string; native: string }[];
  }> {
    return this.request<{
      isConfigured: boolean;
      provider: string;
      chatModel: string;
      ttsModel: string;
      sttModel: string;
      languages: { code: string; name: string; native: string }[];
    }>('/sarvam/status');
  }

  async askSarvamAi(message: string, languageCode: string = 'en-IN', languageName: string = 'English'): Promise<{
    reply: string;
    model: string;
    provider: string;
    languageCode: string;
  }> {
    return this.request<{
      reply: string;
      model: string;
      provider: string;
      languageCode: string;
    }>('/sarvam/chat', {
      method: 'POST',
      body: JSON.stringify({ message, languageCode, languageName }),
    });
  }

  async sarvamTts(text: string, languageCode: string = 'en-IN', speaker: string = 'shubh'): Promise<{
    audioBase64: string;
    mimeType: string;
    languageCode: string;
  }> {
    return this.request<{
      audioBase64: string;
      mimeType: string;
      languageCode: string;
    }>('/sarvam/tts', {
      method: 'POST',
      body: JSON.stringify({ text, languageCode, speaker }),
    });
  }

  async sarvamStt(audioBase64: string, languageCode: string = 'en-IN'): Promise<{
    transcript: string;
    languageCode: string;
  }> {
    return this.request<{
      transcript: string;
      languageCode: string;
    }>('/sarvam/stt', {
      method: 'POST',
      body: JSON.stringify({ audioBase64, languageCode }),
    });
  }

  // Subscribers
  async getSubscribers(): Promise<{ id: string; email: string; date: string }[]> {
    return this.request<{ id: string; email: string; date: string }[]>('/subscribers');
  }

  async deleteSubscriber(id: string): Promise<void> {
    await this.request(`/subscribers/${id}`, { method: 'DELETE' });
  }

  // MySQL Relational Database Integration
  async getDatabaseStatus(): Promise<{
    connected: boolean;
    enabled: boolean;
    host: string;
    port: number;
    database: string;
    user: string;
    version?: string;
    tableCounts: {
      portfolio_profile: number;
      skills: number;
      projects: number;
      education: number;
      achievements: number;
      contact_messages: number;
      newsletter_subscribers: number;
    };
    lastChecked: string;
    message: string;
    error?: string;
  }> {
    return this.request('/database/status');
  }

  async testDatabaseConnection(creds?: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
  }): Promise<{ success: boolean; message: string; version?: string }> {
    return this.request('/database/test-connection', {
      method: 'POST',
      body: JSON.stringify(creds || {}),
    });
  }

  async syncToMySQL(): Promise<{ success: boolean; rowsSynced: number; message: string }> {
    return this.request('/database/sync-to-mysql', {
      method: 'POST',
    });
  }

  async syncFromMySQL(): Promise<{ success: boolean; message: string; stats?: any }> {
    return this.request('/database/sync-from-mysql', {
      method: 'POST',
    });
  }

  async sendTestNotification(): Promise<{ success: boolean; message: string }> {
    return this.request('/admin/notifications/test', {
      method: 'POST',
    });
  }
}

export const api = new ApiService();
