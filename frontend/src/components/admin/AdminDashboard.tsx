import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FolderPlus,
  FolderGit2,
  Edit3,
  Wrench,
  UserCheck,
  GraduationCap,
  FileText,
  Mail,
  Sliders,
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  RefreshCw,
  Search,
  Github,
  Globe,
  Linkedin,
  Layers,
  Reply,
  Send,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Database,
  Server,
  HardDrive,
  Check,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Youtube,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Code2,
  Bell,
  BellRing,
  BellOff,
  Volume2,
  Menu,
  Smartphone,
  Archive,
  ArchiveRestore,
  Inbox,
  MailCheck,
  MailOpen,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Copy,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import {
  Profile,
  Skill,
  Project,
  Education,
  Achievement,
  ContactMessage,
  SystemMetrics,
  AppearanceSettings,
} from '../../types';
import { api } from '../../services/api';
import { getTechLogo } from '../TechLogos';
import { ThreeDataBackground } from '../ThreeDataBackground';
import { playNotificationChime } from '../../utils/soundAlert';

interface AdminDashboardProps {
  onClose: () => void;
  onDataChanged: () => void;
}

type TabType = 'overview' | 'projects' | 'skills' | 'profile' | 'education' | 'resume' | 'inbox' | 'appearance' | 'subscribers' | 'database';

const PRESET_TECH_ICONS = [
  'HTML', 'CSS', 'JavaScript', 'C', 'Java', 'Python',
  'Bootstrap', 'MS Office', 'React Js', 'Express Js',
  'Power BI', 'MySQL', 'Tableau', 'Pandas', 'Excel',
  'Git', 'Supabase', 'Node.js', 'TypeScript'
];

const getProjectThumbnailDisplayName = (url?: string, customName?: string): string => {
  if (customName) return customName;
  if (!url) return '';
  if (url.startsWith('data:')) return 'Uploaded image file';
  const filename = url.split('/').pop() || url;
  return filename.replace(/^project-\d+-/, '');
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onDataChanged }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Project Image Upload & Sub-tab States
  const [projectSubTab, setProjectSubTab] = useState<'list' | 'editor'>('list');
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('All');
  const [projectFileName, setProjectFileName] = useState<string>('');
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState<boolean>(false);

  // Skill Icon, Sub-tab & Category Filter States
  const [skillSubTab, setSkillSubTab] = useState<'list' | 'editor'>('list');
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('All');
  const [skillIconFileName, setSkillIconFileName] = useState<string>('');
  const [isUploadingSkillIcon, setIsUploadingSkillIcon] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  // Resume PDF Upload States
  const [resumeFileName, setResumeFileName] = useState<string>('Sagar_Singh_Resume.pdf');
  const [isUploadingResume, setIsUploadingResume] = useState<boolean>(false);

  // Data States
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [appearance, setAppearance] = useState<AppearanceSettings | null>(null);
  const [subscribers, setSubscribers] = useState<{ id: string; email: string; date: string }[]>([]);

  // MySQL Database States
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string; version?: string } | null>(null);
  const [customDbCreds, setCustomDbCreds] = useState({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sagar_portfolio_db',
  });

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // In-Webpage Confirmation Modal State (replaces native browser confirm)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // In-Webpage Floating Toast Notification (replaces native browser alert)
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Real-Time System Notification & SSE States
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [isSseConnected, setIsSseConnected] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setActionMessage(message);
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
      setActionMessage(prev => (prev === message ? null : prev));
    }, 4500);
  };

  const showNotification = (msg: string) => {
    showToast(msg, 'success');
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('System notifications are not supported on this browser.', 'error');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        playNotificationChime();
        showToast('Real-time notifications enabled on this device!', 'success');
        try {
          if (navigator.serviceWorker?.controller) {
            navigator.serviceWorker.ready.then(reg => {
              reg.showNotification('🔔 Notifications Active', {
                body: 'Instant alerts will chime on your mobile & desktop when messages arrive.',
                icon: '/profile2.png',
              });
            });
          } else {
            new Notification('🔔 Notifications Active', {
              body: 'Instant alerts will chime on your mobile & desktop when messages arrive.',
              icon: '/profile2.png',
            });
          }
        } catch {}
      } else if (permission === 'denied') {
        showToast('Notification permission was blocked in browser settings.', 'error');
      }
    } catch (err: any) {
      showToast('Notification permission request error: ' + err.message, 'error');
    }
  };

  const handleTestNotification = async () => {
    playNotificationChime();
    try {
      await api.sendTestNotification();
      showToast('Test notification transmitted through server event bus!', 'success');
    } catch (err: any) {
      showToast('Test alert failed: ' + err.message, 'error');
    }
  };

  // Real-Time SSE Listener (Server-Sent Events)
  useEffect(() => {
    const token = api.getAuthToken();
    if (!token) return;

    const sseUrl = `${api.getApiBaseUrl()}/admin/notifications/stream?token=${encodeURIComponent(token)}`;
    let es: EventSource | null = null;

    try {
      es = new EventSource(sseUrl);

      es.onopen = () => {
        setIsSseConnected(true);
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'system' && data.title === 'System Connected') {
            setIsSseConnected(true);
            return;
          }

          // 1. Play audio chime
          playNotificationChime();

          // 2. Native System Notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              if (navigator.serviceWorker?.controller) {
                navigator.serviceWorker.ready.then(reg => {
                  reg.showNotification(data.title, {
                    body: data.body,
                    icon: '/profile2.png',
                    badge: '/profile2.png',
                    vibrate: [250, 100, 250],
                    tag: data.id || 'admin-live-alert',
                  } as any);
                }).catch(() => {
                  new Notification(data.title, { body: data.body, icon: '/profile2.png' });
                });
              } else {
                new Notification(data.title, {
                  body: data.body,
                  icon: '/profile2.png',
                });
              }
            } catch (notifErr) {
              console.warn('[Notification Error]:', notifErr);
            }
          }

          // 3. Floating In-App Toast
          showToast(`🔔 ${data.title}: ${data.body}`, 'info');

          // 4. Reactive State Updates
          if (data.type === 'contact' && data.data) {
            setMessages(prev => [data.data, ...prev.filter(m => m.id !== data.data.id)]);
          } else if (data.type === 'subscriber' && data.data) {
            setSubscribers(prev => [data.data, ...prev.filter(s => s.id !== data.data.id)]);
          }
        } catch (err) {
          console.error('Error handling SSE notification:', err);
        }
      };

      es.onerror = () => {
        setIsSseConnected(false);
      };
    } catch (err) {
      console.warn('Failed to initialize EventSource:', err);
    }

    return () => {
      if (es) {
        es.close();
      }
    };
  }, []);

  // Modal / Form States
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [profileForm, setProfileForm] = useState<Partial<Profile>>({});

  // Contact Inbox & Real Email Communication States
  const [inboxSubTab, setInboxSubTab] = useState<'inbox' | 'unread' | 'read' | 'replied' | 'archived'>('inbox');
  const [inboxSearch, setInboxSearch] = useState<string>('');
  const [inboxDateFilter, setInboxDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [inboxPage, setInboxPage] = useState<number>(1);
  const messagesPerPage = 7;
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);
  const [replyStatusNotice, setReplyStatusNotice] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Prevent background scroll when confirmation dialog or modal is open
  useEffect(() => {
    if (confirmModal?.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [confirmModal?.isOpen]);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [m, p, sk, pr, ed, ac, msg, app] = await Promise.all([
        api.getMetrics(),
        api.getProfile(),
        api.getSkills(),
        api.getProjects(),
        api.getEducation(),
        api.getAchievements(),
        api.getMessages(),
        api.getAppearance(),
      ]);

      setMetrics(m);
      setProfile(p);
      setProfileForm(p);
      setSkills(sk);
      setProjects(pr);
      setEducation(ed);
      setAchievements(ac);
      setMessages(msg);
      setAppearance(app);
      // Load subscribers separately
      try {
        const subs = await api.getSubscribers();
        setSubscribers(subs || []);
      } catch { /* subscribers optional */ }

      // Load MySQL status
      try {
        const dbRes = await api.getDatabaseStatus();
        setDbStatus(dbRes);
      } catch { /* database optional */ }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test MySQL Connection dynamically
  const handleTestDbConnection = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsTestingDb(true);
    setDbTestResult(null);
    try {
      const res = await api.testDatabaseConnection(customDbCreds);
      setDbTestResult(res);
      if (res.success) {
        showNotification('MySQL Connection Successful!');
        const freshStatus = await api.getDatabaseStatus();
        setDbStatus(freshStatus);
      }
    } catch (err: any) {
      setDbTestResult({ success: false, message: err.message || 'Connection failed' });
    } finally {
      setIsTestingDb(false);
    }
  };

  // One-Click Sync: In-Memory -> MySQL
  const handleSyncToMySQL = async () => {
    setIsSyncingDb(true);
    try {
      const res = await api.syncToMySQL();
      if (res.success) {
        showToast(`Synced ${res.rowsSynced} records into MySQL database successfully!`, 'success');
        const freshStatus = await api.getDatabaseStatus();
        setDbStatus(freshStatus);
      } else {
        showToast('Sync error: ' + res.message, 'error');
      }
    } catch (err: any) {
      showToast('Sync failed: ' + err.message, 'error');
    } finally {
      setIsSyncingDb(false);
    }
  };

  // One-Click Reload: MySQL -> Live Portfolio State
  const handleSyncFromMySQL = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reload Portfolio from MySQL',
      message: 'Reload all portfolio data from MySQL? This will update the live site state with MySQL table records.',
      confirmLabel: 'Reload from Database',
      isDestructive: false,
      onConfirm: async () => {
        setConfirmModal(null);
        setIsSyncingDb(true);
        try {
          const res = await api.syncFromMySQL();
          if (res.success) {
            showToast(res.message, 'success');
            await loadAllAdminData();
            onDataChanged();
          } else {
            showToast('Import error: ' + res.message, 'error');
          }
        } catch (err: any) {
          showToast('Import failed: ' + err.message, 'error');
        } finally {
          setIsSyncingDb(false);
        }
      },
    });
  };

  const handleDeleteSubscriber = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Subscriber',
      message: 'Are you sure you want to remove this subscriber from the mailing list?',
      confirmLabel: 'Remove Subscriber',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await api.deleteSubscriber(id);
          setSubscribers(prev => prev.filter(s => s.id !== id));
          showToast('Subscriber removed successfully.', 'success');
        } catch (err: any) {
          showToast('Error removing subscriber: ' + err.message, 'error');
        }
      },
    });
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile(profileForm);
      setProfile(updated);
      showToast('Profile information updated successfully.', 'success');
      onDataChanged();
    } catch (err: any) {
      showToast('Error updating profile: ' + err.message, 'error');
    }
  };

  // Delete Project - In-Webpage Confirmation Modal (Never browser alert)
  const handleDeleteProject = (id: string, title?: string) => {
    const proj = projects.find(p => p.id === id);
    const projTitle = title || proj?.title || id;
    setConfirmModal({
      isOpen: true,
      title: 'Delete Portfolio Project',
      message: `Are you sure you want to delete "${projTitle}"? This will permanently remove the project and its foreign-key linked skills from the MySQL database.`,
      confirmLabel: 'Yes, Delete Project',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await api.deleteProject(id);
          setProjects(prev => prev.filter(p => p.id !== id));
          showToast(`Project "${projTitle}" deleted successfully from database.`, 'success');
          onDataChanged();
        } catch (err: any) {
          showToast('Error deleting project: ' + err.message, 'error');
        }
      },
    });
  };

  // Toggle Project Featured
  const handleToggleFeatured = async (project: Project) => {
    try {
      const updated = await api.updateProject(project.id, { featured: !project.featured });
      setProjects(prev => prev.map(p => (p.id === project.id ? updated : p)));
      showToast(`Project ${updated.featured ? 'marked as featured' : 'unfeatured'}.`, 'success');
      onDataChanged();
    } catch (err: any) {
      showToast('Error updating project: ' + err.message, 'error');
    }
  };

  // Save / Add Project
  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;

    try {
      if (editingProject.id) {
        const updated = await api.updateProject(editingProject.id, editingProject);
        setProjects(prev => prev.map(p => (p.id === editingProject.id ? updated : p)));
        showToast('Project updated successfully.', 'success');
      } else {
        const created = await api.createProject({
          ...editingProject,
          category: editingProject.category || 'Business Intelligence',
          difficulty: editingProject.difficulty || 'Advanced',
          technologies: editingProject.technologies || ['Power BI', 'SQL'],
          caseStudy: editingProject.caseStudy || {
            overview: 'New case study overview...',
            businessProblem: 'Core business problem statement...',
            datasetInfo: 'Dataset description...',
            dataCleaningPrep: 'Data cleaning steps...',
            methodology: 'Analytical methodology...',
            keyFindings: ['Key finding 1'],
            recommendations: ['Recommendation 1'],
            limitations: 'Limitations noted.',
          },
        });
        setProjects(prev => [created, ...prev]);
        showToast('New project created successfully in MySQL.', 'success');
      }
      setEditingProject(null);
      setProjectSubTab('list');
      setProjectFileName('');
      onDataChanged();
    } catch (err: any) {
      showToast('Error saving project: ' + err.message, 'error');
    }
  };

  // Delete Skill - In-Webpage Confirmation Modal (Never browser alert)
  const handleDeleteSkill = (id: string, name?: string) => {
    const sk = skills.find(s => s.id === id);
    const skillName = name || sk?.name || id;
    setConfirmModal({
      isOpen: true,
      title: 'Delete Technical Skill',
      message: `Are you sure you want to delete skill "${skillName}"? This will permanently remove this skill from the MySQL database.`,
      confirmLabel: 'Yes, Delete Skill',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await api.deleteSkill(id);
          setSkills(prev => prev.filter(s => s.id !== id));
          showToast(`Skill "${skillName}" deleted successfully.`, 'success');
          onDataChanged();
        } catch (err: any) {
          showToast('Error deleting skill: ' + err.message, 'error');
        }
      },
    });
  };

  // Move Skill in Display Order (Controls Top 4 on User Side)
  const handleMoveSkill = async (skillId: string, direction: 'up' | 'down') => {
    const idx = skills.findIndex(s => s.id === skillId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === skills.length - 1) return;

    const newIds = skills.map(s => s.id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = newIds[idx];
    newIds[idx] = newIds[targetIdx];
    newIds[targetIdx] = temp;

    try {
      const updated = await api.reorderSkills(newIds);
      setSkills(updated);
      showToast('Skill display order updated successfully.', 'success');
      onDataChanged();
    } catch (err: any) {
      showToast('Error reordering skill: ' + err.message, 'error');
    }
  };

  // Save Skill
  const handleSaveSkillForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name) return;

    try {
      if (editingSkill.id) {
        const updated = await api.updateSkill(editingSkill.id, {
          ...editingSkill,
          iconUrl: editingSkill.iconUrl || '',
          featured: Boolean(editingSkill.featured),
        });
        setSkills(prev => prev.map(s => (s.id === editingSkill.id ? updated : s)));
        showToast('Skill updated successfully.', 'success');
      } else {
        const created = await api.createSkill({
          name: editingSkill.name,
          category: editingSkill.category || 'Programming',
          proficiencyLevel: editingSkill.proficiencyLevel || 'Advanced',
          iconUrl: editingSkill.iconUrl || '',
          description: editingSkill.description || '',
          toolsUsed: editingSkill.toolsUsed || [editingSkill.name],
          featured: Boolean(editingSkill.featured),
        });
        setSkills(prev => [created, ...prev]);
        showToast('New skill created successfully in MySQL.', 'success');
      }
      setEditingSkill(null);
      setSkillSubTab('list');
      setSkillIconFileName('');
      onDataChanged();
    } catch (err: any) {
      showToast('Error saving skill: ' + err.message, 'error');
    }
  };

  // Upload Resume PDF
  const handleResumeFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingResume(true);
    setResumeFileName(file.name);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await api.uploadResume(base64, file.name);
        showToast(res.message, 'success');
        if (profile) {
          setProfile({ ...profile, resumeUrl: res.url });
          setProfileForm({ ...profileForm, resumeUrl: res.url });
        }
        onDataChanged();
      } catch (err: any) {
        showToast('Error uploading resume: ' + err.message, 'error');
      } finally {
        setIsUploadingResume(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle Message Read / Unread Status
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      await api.markMessageRead(id, !currentRead);
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, read: !currentRead } : m)));
      showToast(!currentRead ? 'Message marked as read.' : 'Message marked as unread.', 'success');
    } catch (err: any) {
      showToast('Error updating status: ' + err.message, 'error');
    }
  };

  // Toggle Message Archive / Restore Status
  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    try {
      await api.archiveMessage(id, !currentArchived);
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, archived: !currentArchived } : m)));
      showToast(!currentArchived ? 'Message moved to Archive.' : 'Message restored to Inbox.', 'success');
    } catch (err: any) {
      showToast('Error archiving message: ' + err.message, 'error');
    }
  };

  // Delete Message with Confirmation
  const handleDeleteMessage = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Contact Message',
      message: 'Are you sure you want to delete this contact message and all reply records from MySQL permanently?',
      confirmLabel: 'Delete Message',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await api.deleteMessage(id);
          setMessages(prev => prev.filter(m => m.id !== id));
          if (selectedMessageId === id) setSelectedMessageId(null);
          showToast('Message deleted successfully from database.', 'success');
        } catch (err: any) {
          showToast('Error deleting message: ' + err.message, 'error');
        }
      },
    });
  };

  // Send Real Email Reply via Nodemailer
  const handleSendRealReply = async (msgId: string, recipientEmail: string, subject: string) => {
    if (!replyText.trim()) {
      showToast('Please type your response message.', 'error');
      return;
    }
    setIsSubmittingReply(true);
    setReplyStatusNotice(null);
    try {
      const result = await api.sendEmailReply(msgId, replyText.trim(), 'sirroshan999@gmail.com', 'Sagar Singh');
      
      // Update local state message with the new reply
      setMessages(prev => prev.map(m => {
        if (m.id === msgId) {
          const updatedReplies = m.replies ? [...m.replies, result.reply] : [result.reply];
          return {
            ...m,
            read: true,
            replied: true,
            replyText: replyText.trim(),
            repliedAt: new Date().toISOString(),
            replies: updatedReplies,
          };
        }
        return m;
      }));

      if (result.emailSent) {
        showToast(`Email dispatched directly to ${recipientEmail} and recorded in database.`, 'success');
        setReplyStatusNotice({ id: msgId, success: true, message: `Delivered to ${recipientEmail} via SMTP.` });
      } else {
        showToast(`Reply stored in database! Notice: ${result.emailError || 'SMTP credentials required in .env'}`, 'info');
        setReplyStatusNotice({ id: msgId, success: false, message: `Recorded in MySQL. SMTP note: ${result.emailError || 'Configure SMTP_USER & SMTP_PASS in .env for live dispatch'}` });
      }

      setReplyText('');
    } catch (err: any) {
      showToast('Error transmitting reply: ' + err.message, 'error');
      setReplyStatusNotice({ id: msgId, success: false, message: err.message });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Quick Reply Template Inserter
  const handleApplyQuickTemplate = (templateType: 'general' | 'analytics' | 'portfolio', msg: ContactMessage) => {
    if (templateType === 'general') {
      setReplyText(
        `Hi ${msg.name},\n\nThank you for reaching out regarding "${msg.subject}". I appreciate your message!\n\nI am currently available for new opportunities and consulting. I would be glad to schedule a brief call or answer any further questions you have.\n\nWarm regards,\nSagar Singh\nWeb & AI Developer · Data Analytics`
      );
    } else if (templateType === 'analytics') {
      setReplyText(
        `Hi ${msg.name},\n\nThank you for your interest in my Data Analytics & Power BI work! I specialize in translating complex transactional data into high-clarity executive dashboards, KPI telemetry, and automated Python data workflows.\n\nI would be delighted to share relevant case studies or walk through sample dashboards. When would be a convenient time for you?\n\nWarm regards,\nSagar Singh`
      );
    } else if (templateType === 'portfolio') {
      setReplyText(
        `Hi ${msg.name},\n\nThank you for reviewing my portfolio! You can explore my full interactive project case studies, live demos, and verified certifications at https://sagarsingh.dev.\n\nPlease let me know if you would like me to share my updated resume or GitHub repositories.\n\nWarm regards,\nSagar Singh`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#060810] overflow-hidden animate-fadeIn select-none">
      {/* High-Tech Red Analytics Admin Background Photo */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-30"
        style={{
          backgroundImage: "url('/red-welcome-bg.jpg')",
          filter: 'contrast(1.2) brightness(0.85) saturate(1.1)',
        }}
      />
      {/* Luxurious Red Radial Vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 65% 25%, rgba(225,29,72,0.2) 0%, rgba(136,19,55,0.08) 45%, rgba(6,8,16,0.85) 90%)',
        }}
      />

      {/* Interactive 3D Data & Wave Background inside Admin Workspace */}
      <ThreeDataBackground isDark={true} />

      <div className="relative z-10 w-full h-full bg-[#080a11]/75 backdrop-blur-2xl text-stone-100 flex flex-col md:flex-row overflow-hidden">
        
        {/* MOBILE TOP BAR (Visible only on screens < md) */}
        <header className="md:hidden flex items-center justify-between p-3.5 bg-[#090c15]/90 backdrop-blur-2xl border-b border-white/[0.08] shrink-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-sm">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">Sagar Admin</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>MySQL Active</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Notification Permission Bell */}
            <button
              onClick={requestNotificationPermission}
              title={notificationPermission === 'granted' ? 'Real-Time Notifications Active' : 'Allow Notifications'}
              className={`p-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1 border cursor-pointer ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              }`}
            >
              {notificationPermission === 'granted' ? <Bell className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-stone-300 hover:text-white transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* MOBILE HORIZONTAL QUICK SCROLL TABS */}
        {!isMobileMenuOpen && (
          <div className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#090c15]/90 backdrop-blur-xl border-b border-white/[0.06] overflow-x-auto shrink-0">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'projects', label: `Projects (${projects.length})` },
              { id: 'skills', label: `Skills (${skills.length})` },
              { id: 'profile', label: 'Profile' },
              { id: 'resume', label: 'Resume' },
              { id: 'inbox', label: 'Inbox', badge: messages.filter(m => !m.read).length },
              { id: 'subscribers', label: `Subs (${subscribers.length})` },
              { id: 'database', label: 'MySQL' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-rose-600 text-white shadow-sm font-bold'
                    : 'bg-white/[0.04] text-stone-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}

        {/* MOBILE SLIDE-OVER NAVIGATION DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[57px] z-40 bg-[#060810]/95 backdrop-blur-3xl p-4 flex flex-col justify-between overflow-y-auto animate-fadeIn">
            <div className="space-y-4">
              <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                Admin Navigation
              </div>
              <nav className="space-y-1.5 text-xs font-medium">
                {[
                  { id: 'overview', label: 'Overview & Metrics', icon: <LayoutDashboard className="w-4 h-4" /> },
                  { id: 'projects', label: `Projects & Case Studies (${projects.length})`, icon: <FolderPlus className="w-4 h-4" /> },
                  { id: 'skills', label: `Skills & Categories (${skills.length})`, icon: <Wrench className="w-4 h-4" /> },
                  { id: 'profile', label: 'Profile & Dynamic About', icon: <UserCheck className="w-4 h-4" /> },
                  { id: 'resume', label: 'Resume & Documents', icon: <FileText className="w-4 h-4 text-rose-400" /> },
                  { id: 'inbox', label: 'Contact Inbox', icon: <Mail className="w-4 h-4" />, badge: messages.filter(m => !m.read).length },
                  { id: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: <Mail className="w-4 h-4" /> },
                  { id: 'database', label: 'MySQL & Workbench', icon: <Database className="w-4 h-4 text-sky-400" />, indicator: dbStatus?.connected },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-rose-600 text-white font-bold shadow-md'
                        : 'text-stone-300 hover:text-white bg-white/[0.03] border border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-xs">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>

              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <button
                  onClick={handleTestNotification}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-mono font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Send Test Notification</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-xs border border-rose-500/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Exit Admin Portal</span>
              </button>
            </div>
          </div>
        )}

        {/* DESKTOP SIDEBAR (Visible on md:flex) */}
        <aside className="hidden md:flex w-64 bg-[#090c15]/80 backdrop-blur-2xl border-r border-white/[0.08] p-4 flex-col justify-between shrink-0 shadow-2xl">
          <div className="space-y-6">
            
            {/* Header / Brand */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-white block">Sagar Portfolio</span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>MySQL Active</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1 text-xs font-medium">
              {[
                { id: 'overview', label: 'Overview & Metrics', icon: <LayoutDashboard className="w-4 h-4" /> },
                { id: 'projects', label: `Projects (${projects.length})`, icon: <FolderPlus className="w-4 h-4" /> },
                { id: 'skills', label: `Skills & Categories (${skills.length})`, icon: <Wrench className="w-4 h-4" /> },
                { id: 'profile', label: 'Profile & Dynamic About', icon: <UserCheck className="w-4 h-4" /> },
                { id: 'resume', label: 'Resume & Documents', icon: <FileText className="w-4 h-4 text-rose-400" /> },
                { id: 'inbox', label: 'Contact Inbox', icon: <Mail className="w-4 h-4" />, badge: messages.filter(m => !m.read).length },
                { id: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: <Mail className="w-4 h-4" /> },
                { id: 'database', label: 'MySQL & Workbench', icon: <Database className="w-4 h-4 text-sky-400" />, indicator: dbStatus?.connected },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer select-none text-left ${
                    activeTab === item.id
                      ? 'bg-rose-500/20 text-white font-bold border-l-4 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.18)]'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px]">
                      {item.badge}
                    </span>
                  ) : null}
                  {item.indicator !== undefined ? (
                    <span className={`w-2 h-2 rounded-full ${item.indicator ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'}`} />
                  ) : null}
                </button>
              ))}
            </nav>

          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <a
              href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000' : 'https://ssportfoliomines.vercel.app/'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 text-[11px] font-mono rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-rose-300 hover:text-white border border-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Open Public User Portfolio"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              <span>View Public Portfolio ↗</span>
            </a>
            <button
              onClick={handleTestNotification}
              className="w-full py-2 px-3 text-[11px] font-mono rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/[0.08] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-rose-400" />
              <span>Test Notification</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/[0.08] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Exit Admin Portal</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 bg-transparent">
          
          {/* Real-Time Notification Status Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0d101a]/85 border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse'
              }`}>
                {notificationPermission === 'granted' ? <Bell className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {notificationPermission === 'granted' ? 'Real-Time System Notifications Online' : 'Enable Real-Time Alerts'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    isSseConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isSseConnected ? '● Live Stream Active' : '○ Connecting Stream...'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {notificationPermission === 'granted'
                    ? 'Mobile & desktop push notifications + audio chimes alert instantly when visitors submit inquiries or subscribe.'
                    : 'Click Allow Notifications to receive instant alerts on mobile and desktop.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {notificationPermission !== 'granted' ? (
                <button
                  onClick={requestNotificationPermission}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Allow Notifications</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleTestNotification}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <BellRing className="w-3.5 h-3.5 text-rose-400" />
                    <span>Test Notification</span>
                  </button>
                  <button
                    onClick={() => {
                      playNotificationChime();
                      showToast('Audio chime tested successfully!', 'info');
                    }}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
                    title="Test Audio Chime"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Top Bar Action Message */}
          {actionMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{actionMessage}</span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="space-y-6"
            >

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dashboard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d101a]/80 border border-rose-500/30 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Dashboard
                    </h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Portfolio overview — connected to MySQL database.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    loadAllAdminData();
                    showToast('Dashboard refreshed from MySQL.', 'success');
                  }}
                  className="p-2 rounded-xl bg-stone-900 border border-white/[0.08] hover:border-rose-500/40 text-stone-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 self-start sm:self-auto"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Projects */}
                <div className="p-5 rounded-2xl bg-[#0d101a]/70 border border-white/[0.08] hover:border-rose-500/40 backdrop-blur-xl space-y-2 transition-all shadow-md group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-mono">Projects</span>
                    <FolderGit2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black font-mono text-white">{projects.length}</p>
                    <span className="text-xs text-stone-500 font-medium">total</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                      {projects.filter(p => (p.projectType || '').includes('Major')).length} Major
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                      {projects.filter(p => !(p.projectType || '').includes('Major')).length} Minor
                    </span>
                  </div>
                </div>

                {/* KPI 2: Skills */}
                <div className="p-5 rounded-2xl bg-[#0d101a]/70 border border-white/[0.08] hover:border-sky-500/40 backdrop-blur-xl space-y-2 transition-all shadow-md group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-mono">Skills</span>
                    <Wrench className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black font-mono text-white">{skills.length}</p>
                    <span className="text-xs text-stone-500 font-medium">technologies</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      {skills.filter(s => s.proficiencyLevel === 'Expert').length} Expert
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                      {skills.filter(s => s.proficiencyLevel === 'Advanced').length} Advanced
                    </span>
                  </div>
                </div>

                {/* KPI 3: Messages */}
                <div className="p-5 rounded-2xl bg-[#0d101a]/70 border border-white/[0.08] hover:border-emerald-500/40 backdrop-blur-xl space-y-2 transition-all shadow-md group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-mono">Inbox</span>
                    <Mail className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black font-mono text-rose-400">
                      {messages.filter(m => !m.read).length}
                    </p>
                    <span className="text-xs text-stone-500 font-medium">unread</span>
                  </div>
                  <div className="text-[11px] font-mono text-stone-400 pt-1">
                    {messages.length} total messages received
                  </div>
                </div>

                {/* KPI 4: Database */}
                <div className="p-5 rounded-2xl bg-[#0d101a]/70 border border-white/[0.08] hover:border-purple-500/40 backdrop-blur-xl space-y-2 transition-all shadow-md group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-mono">Database</span>
                    <Database className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black font-mono text-emerald-400">
                      {dbStatus?.connected ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="text-[11px] font-mono text-stone-300">
                      {dbStatus?.connected ? 'MySQL Connected' : 'Checking...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two-column analytics panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills Proficiency Breakdown */}
                <div className="p-6 rounded-2xl bg-[#0d101a]/70 border border-white/[0.08] backdrop-blur-xl space-y-4 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">Skills Proficiency</h3>
                  </div>
                  <div className="space-y-3 pt-1">
                    {[
                      { level: 'Expert', color: '#e11d48', bg: 'bg-rose-500' },
                      { level: 'Advanced', color: '#38bdf8', bg: 'bg-sky-400' },
                      { level: 'Intermediate', color: '#fbbf24', bg: 'bg-amber-400' },
                      { level: 'Beginner', color: '#94a3b8', bg: 'bg-stone-400' },
                    ].map(item => {
                      const count = skills.filter(s => s.proficiencyLevel === item.level).length;
                      const pct = skills.length > 0 ? Math.round((count / skills.length) * 100) : 0;
                      return (
                        <div key={item.level} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-stone-300 font-semibold">{item.level}</span>
                            <span className="text-stone-400">{count} skills ({pct}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-stone-900 overflow-hidden">
                            <div
                              className={`h-full ${item.bg} rounded-full transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Projects by Category */}
                <div className="p-6 rounded-2xl bg-[#0d101a]/70 border border-white/[0.08] backdrop-blur-xl space-y-4 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <PieChart className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Projects by Category</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {Array.from(new Set(projects.map(p => p.category || 'Data Analytics'))).map((cat, i) => {
                      const catProjects = projects.filter(p => (p.category || 'Data Analytics') === cat);
                      const colors = [
                        'border-rose-500/30 bg-rose-500/10 text-rose-300',
                        'border-sky-500/30 bg-sky-500/10 text-sky-300',
                        'border-amber-500/30 bg-amber-500/10 text-amber-300',
                        'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
                      ];
                      const c = colors[i % colors.length];
                      return (
                        <div key={cat} className={`p-3.5 rounded-xl border ${c} space-y-1 flex flex-col justify-between`}>
                          <span className="text-xs font-bold truncate">{cat}</span>
                          <div className="flex items-center justify-between text-[11px] font-mono opacity-80">
                            <span>{catProjects.length} Projects</span>
                            <span>{Math.round((catProjects.length / (projects.length || 1)) * 100)}%</span>
                          </div>
                        </div>
                      );
                    })}
                    {projects.length === 0 && (
                      <div className="col-span-2 text-center text-xs text-stone-500 py-4">No projects added yet.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-5 rounded-2xl bg-[#0d101a]/70 border border-white/[0.08] backdrop-blur-xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Quick Navigation</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'Manage Skills', tab: 'skills' as TabType, color: 'text-sky-400', border: 'hover:border-sky-500/40' },
                    { label: 'Manage Projects', tab: 'projects' as TabType, color: 'text-rose-400', border: 'hover:border-rose-500/40' },
                    { label: 'View Messages', tab: 'inbox' as TabType, color: 'text-emerald-400', border: 'hover:border-emerald-500/40' },
                    { label: 'Database Status', tab: 'database' as TabType, color: 'text-purple-400', border: 'hover:border-purple-500/40' },
                  ].map(item => (
                    <button
                      key={item.tab}
                      onClick={() => setActiveTab(item.tab)}
                      className={`p-3 rounded-xl bg-[#090c14] border border-white/[0.06] ${item.border} transition-all cursor-pointer text-left font-mono font-semibold ${item.color} hover:bg-white/[0.03] active:scale-95`}
                    >
                      {item.label} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Projects Workspace Sub-Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                    <FolderGit2 className="w-6 h-6 text-rose-500" />
                    <span>Projects & Case Studies</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Relational CRUD workspace linked to MySQL via <span className="font-mono text-rose-300">projects</span>, <span className="font-mono text-rose-300">project_skills</span>, and <span className="font-mono text-rose-300">project_technologies</span>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setProjectSubTab('list');
                      setEditingProject(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      projectSubTab === 'list'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                        : 'bg-[#0d101a] text-stone-400 hover:text-white border border-white/[0.08]'
                    }`}
                  >
                    <span>📋 Manage Projects</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold">
                      {projects.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingProject({
                        title: '',
                        projectType: 'Major Project',
                        shortDescription: '',
                        category: 'Web Development & Cloud',
                        difficulty: 'Advanced',
                        technologies: ['React', 'Supabase', 'JavaScript'],
                        skills: ['HTML', 'CSS', 'JavaScript', 'React Js'],
                        githubUrl: 'https://github.com/Sagar99-cmyk',
                        liveDemoUrl: '',
                        linkedinUrl: 'https://linkedin.com/in/sagarsingh2005',
                        thumbnailUrl: '',
                        caseStudy: {
                          overview: '',
                          businessProblem: '',
                          datasetInfo: '',
                          dataCleaningPrep: '',
                          methodology: '',
                          keyFindings: [],
                          recommendations: [],
                          limitations: '',
                        },
                      });
                      setProjectFileName('');
                      setProjectSubTab('editor');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                      projectSubTab === 'editor' && !editingProject?.id
                        ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : 'bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500/30'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Project</span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: MANAGE PROJECTS LIST (READ, FILTER, DELETE, FEATURE) */}
              {projectSubTab === 'list' && (
                <div className="space-y-4">
                  {/* Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0b0e17] border border-white/[0.08]">
                    {/* Live Search */}
                    <div className="w-full sm:w-72 relative">
                      <input
                        type="text"
                        value={projectSearchQuery}
                        onChange={e => setProjectSearchQuery(e.target.value)}
                        placeholder="Search projects by title, tech, skill..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[#080a11] border border-white/[0.08] text-white placeholder:text-stone-500 outline-none focus:border-rose-500/50"
                      />
                      <span className="absolute left-2.5 top-2 text-stone-500 text-xs">🔍</span>
                      {projectSearchQuery && (
                        <button
                          onClick={() => setProjectSearchQuery('')}
                          className="absolute right-2.5 top-1.5 text-stone-400 hover:text-white text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Classification Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {['All', 'Major Project', 'Minor Project', 'Micro/Mini Project'].map(type => (
                        <button
                          key={type}
                          onClick={() => setProjectTypeFilter(type)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                            projectTypeFilter === type
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                              : 'bg-black/30 text-stone-400 hover:text-white border border-white/[0.05]'
                          }`}
                        >
                          {type === 'All' ? 'All Types' : type.replace(' Project', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Projects Table */}
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0b0e17] overflow-x-auto shadow-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0e121d] border-b border-white/[0.08] font-mono text-stone-400">
                        <tr>
                          <th className="p-3">Project & Thumbnail</th>
                          <th className="p-3">Classification</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">🔗 Linked Skills (Foreign Key)</th>
                          <th className="p-3">Technologies</th>
                          <th className="p-3">Featured</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {projects
                          .filter(p => {
                            if (projectTypeFilter !== 'All' && p.projectType !== projectTypeFilter) return false;
                            if (!projectSearchQuery) return true;
                            const q = projectSearchQuery.toLowerCase();
                            return (
                              p.title.toLowerCase().includes(q) ||
                              p.category.toLowerCase().includes(q) ||
                              p.technologies.some(t => t.toLowerCase().includes(q)) ||
                              (p.skills && p.skills.some(s => s.toLowerCase().includes(q)))
                            );
                          })
                          .map(p => (
                            <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                              <td className="p-3 font-semibold">
                                <div className="flex items-center gap-3">
                                  {p.thumbnailUrl ? (
                                    <img
                                      src={p.thumbnailUrl}
                                      alt=""
                                      className="w-12 h-8 object-cover rounded-lg border border-white/[0.1] shrink-0 shadow-sm"
                                    />
                                  ) : (
                                    <div className="w-12 h-8 rounded-lg bg-[#080a11] border border-white/[0.08] flex items-center justify-center text-stone-500 shrink-0">
                                      <ImageIcon className="w-4 h-4 text-stone-600" />
                                    </div>
                                  )}
                                  <div className="space-y-0.5">
                                    <span className="text-white font-bold block truncate max-w-[200px]">{p.title}</span>
                                    <span className="text-[10px] font-mono text-stone-500">ID: {p.id}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  p.projectType?.includes('Major')
                                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                                    : p.projectType?.includes('Minor')
                                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                                    : 'bg-stone-800 text-stone-300'
                                }`}>
                                  {p.projectType || 'Project'}
                                </span>
                              </td>

                              <td className="p-3">
                                <span className="text-stone-300 font-medium">{p.category}</span>
                                <span className="block text-[10px] font-mono text-stone-500">Level: {p.difficulty}</span>
                              </td>

                              {/* Relational Skills Badges */}
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1 max-w-[180px]">
                                  {p.skills && p.skills.length > 0 ? (
                                    p.skills.map((skName, sIdx) => (
                                      <span
                                        key={sIdx}
                                        className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-950/80 text-sky-300 border border-sky-800/60"
                                      >
                                        {skName}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] font-mono text-stone-500 italic">None linked</span>
                                  )}
                                </div>
                              </td>

                              {/* Technologies Badges */}
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1 max-w-[180px]">
                                  {p.technologies.slice(0, 3).map((tech, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#141824] text-stone-300 border border-white/[0.06]"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                  {p.technologies.length > 3 && (
                                    <span className="px-1 py-0.5 rounded text-[9px] font-mono bg-stone-800 text-stone-400">
                                      +{p.technologies.length - 3}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="p-3">
                                <button
                                  onClick={() => handleToggleFeatured(p)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                                    p.featured
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                                      : 'bg-stone-800 text-stone-500 hover:text-stone-300'
                                  }`}
                                >
                                  {p.featured ? '⭐ Featured' : 'Standard'}
                                </button>
                              </td>

                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingProject(p);
                                      setProjectFileName(getProjectThumbnailDisplayName(p.thumbnailUrl));
                                      setProjectSubTab('editor');
                                    }}
                                    className="p-2 rounded-xl bg-stone-800/90 hover:bg-rose-500/25 hover:text-rose-300 text-stone-300 active:scale-90 transition-all cursor-pointer shadow-sm select-none touch-manipulation"
                                    title="Edit Project"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProject(p.id, p.title)}
                                    className="p-2 rounded-xl bg-stone-800/90 hover:bg-rose-600 hover:text-white text-stone-300 active:scale-90 transition-all cursor-pointer shadow-sm select-none touch-manipulation"
                                    title="Delete Project from MySQL"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 2: DEDICATED ADD / EDIT PROJECT SECTION */}
              {projectSubTab === 'editor' && editingProject && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0b0e17] p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(null);
                            setProjectSubTab('list');
                            setProjectFileName('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <span>← Back to Projects List</span>
                        </button>
                        <span className="text-stone-600">/</span>
                        <span className="text-xs font-mono text-rose-400 font-semibold">
                          {editingProject.id ? `Editing ID: ${editingProject.id}` : 'New Project Mode'}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-white">
                        {editingProject.id ? `Edit Project: ${editingProject.title || 'Untitled'}` : 'Create New Portfolio Project'}
                      </h3>
                      <p className="text-xs text-stone-400">
                        Full CRUD workspace connecting directly to MySQL (<span className="font-mono text-rose-300">projects</span>, <span className="font-mono text-rose-300">project_skills</span> foreign keys).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectSubTab('list');
                        setProjectFileName('');
                      }}
                      className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer self-start sm:self-auto"
                      title="Cancel and return to list"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProjectForm} className="space-y-5 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-stone-400 block mb-1">Project Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Real-Time Analytics Dashboard"
                          value={editingProject.title || ''}
                          onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white focus:border-rose-500/50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-stone-400 block mb-1">Project Classification / Type *</label>
                        <select
                          value={editingProject.projectType || 'Major Project'}
                          onChange={e => setEditingProject({ ...editingProject, projectType: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white font-semibold focus:border-rose-500/50 outline-none"
                        >
                          <option value="Major Project">Major Project (Final Year Capstone / Enterprise)</option>
                          <option value="Minor Project">Minor Project (API Integration / Core Service)</option>
                          <option value="Micro/Mini Project">Micro/Mini Project (Component / UI Utility)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Short Description *</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Brief summary of the project architecture, target audience, and business impact..."
                        value={editingProject.shortDescription || ''}
                        onChange={e => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white focus:border-rose-500/50 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-stone-400 block mb-1">Category</label>
                        <input
                          type="text"
                          value={editingProject.category || ''}
                          onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                          placeholder="e.g. Web Development & Cloud, Business Intelligence"
                          className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white focus:border-rose-500/50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-stone-400 block mb-1">Difficulty Level</label>
                        <select
                          value={editingProject.difficulty || 'Advanced'}
                          onChange={e => setEditingProject({ ...editingProject, difficulty: e.target.value as any })}
                          className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white focus:border-rose-500/50 outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    {/* Project Thumbnail / Photo Upload Section */}
                    <div className="p-4 rounded-xl bg-[#080a11] border border-white/[0.08] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Project Thumbnail / Screenshot Photo</span>
                        </span>
                        {editingProject.thumbnailUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setProjectFileName('');
                              setEditingProject({ ...editingProject, thumbnailUrl: '' });
                            }}
                            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Image Preview */}
                        <div className="md:col-span-4 h-32 rounded-xl overflow-hidden border border-white/[0.1] bg-[#05070c] flex items-center justify-center relative group">
                          {editingProject.thumbnailUrl ? (
                            <img
                              src={editingProject.thumbnailUrl}
                              alt="Project Preview"
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <div className="text-center p-2 text-stone-500 space-y-1">
                              <ImageIcon className="w-6 h-6 mx-auto text-stone-600" />
                              <p className="text-[10px] font-mono">No Image Uploaded</p>
                            </div>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="md:col-span-8 space-y-2.5">
                          <div>
                            <label className="text-[10px] font-mono text-stone-400 block mb-1">
                              Upload File from Computer (PNG, JPG, WebP)
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setProjectFileName(file.name);
                                setIsUploadingThumbnail(true);
                                const reader = new FileReader();
                                reader.onload = async () => {
                                  const base64 = reader.result as string;
                                  try {
                                    const res = await api.uploadImage(base64, file.name);
                                    const finalUrl = res?.url || (res as any)?.data?.url || (res as any)?.data?.path || '/uploads/' + file.name;
                                    setEditingProject({ ...editingProject, thumbnailUrl: finalUrl });
                                    setProjectFileName(file.name);
                                  } catch (err) {
                                    console.warn('API upload fallback:', err);
                                    setEditingProject({ ...editingProject, thumbnailUrl: base64 });
                                    setProjectFileName(file.name);
                                  } finally {
                                    setIsUploadingThumbnail(false);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="block w-full text-xs text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30 cursor-pointer"
                            />
                            {isUploadingThumbnail && (
                              <p className="text-[10px] font-mono text-amber-400 mt-1 flex items-center gap-1.5">
                                <span className="animate-spin inline-block w-2.5 h-2.5 border border-amber-400 border-t-transparent rounded-full" />
                                <span>Uploading {projectFileName}...</span>
                              </p>
                            )}
                          </div>

                          {/* Displays File Name ONLY - Never URL */}
                          <div>
                            <label className="text-[10px] font-mono text-stone-400 block mb-1">
                              Attached File Name
                            </label>
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                readOnly
                                value={projectFileName || getProjectThumbnailDisplayName(editingProject.thumbnailUrl)}
                                placeholder="No file chosen yet"
                                className="w-full p-2 text-xs rounded-lg bg-[#090c14] border border-white/[0.1] text-emerald-300 placeholder:text-stone-600 font-mono font-medium"
                              />
                              {(projectFileName || editingProject.thumbnailUrl) && (
                                <span className="absolute right-2.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  Attached
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Optional External Image URL Accordion */}
                          <details className="text-[10px] font-mono text-stone-500 pt-1">
                            <summary className="cursor-pointer hover:text-stone-300">
                              Or use external image link (optional)
                            </summary>
                            <input
                              type="text"
                              value={editingProject.thumbnailUrl?.startsWith('data:') ? '' : editingProject.thumbnailUrl || ''}
                              onChange={e => {
                                setProjectFileName('');
                                setEditingProject({ ...editingProject, thumbnailUrl: e.target.value });
                              }}
                              placeholder="https://example.com/screenshot.png"
                              className="w-full mt-1.5 p-2 text-xs rounded-lg bg-[#090c14] border border-white/[0.1] text-stone-100 placeholder:text-stone-600 font-mono"
                            />
                          </details>
                        </div>
                      </div>
                    </div>

                    {/* Relational Skills Selector (Foreign Key: project_skills) */}
                    <div className="p-4 rounded-xl bg-[#080a11] border border-white/[0.08] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                          <span>🔗 Link Technical Skills (Foreign Key: project_skills)</span>
                        </label>
                        <span className="text-[10px] font-mono text-stone-400">
                          {(editingProject.skills || []).length} skills selected
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Click skills to toggle their relational link with this project. Stored relationally in MySQL <code className="text-sky-300">project_skills</code> junction table.
                      </p>
                      <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-2 rounded-xl bg-[#05070c] border border-white/[0.06]">
                        {skills.map(sk => {
                          const isSelected = (editingProject.skills || []).includes(sk.name) || (editingProject.skills || []).includes(sk.id);
                          return (
                            <button
                              key={sk.id}
                              type="button"
                              onClick={() => {
                                const current = editingProject.skills || [];
                                const next = isSelected
                                  ? current.filter(s => s !== sk.name && s !== sk.id)
                                  : [...current, sk.name];
                                setEditingProject({ ...editingProject, skills: next });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                                  : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                              }`}
                            >
                              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                                {getTechLogo(sk.name, sk.iconUrl, 'w-4 h-4')}
                              </span>
                              <span>{sk.name}</span>
                              {isSelected && <span className="text-sky-400 font-bold">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technologies (Comma-separated) */}
                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Technologies (Comma separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : (editingProject.technologies || '')}
                        onChange={e => setEditingProject({
                          ...editingProject,
                          technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                        })}
                        placeholder="React, JavaScript, Supabase, PostgreSQL"
                        className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white focus:border-rose-500/50 outline-none"
                      />
                    </div>

                    {/* Web Links: GitHub, Hosting, LinkedIn */}
                    <div className="p-4 rounded-xl bg-[#080a11] border border-white/[0.08] space-y-3">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Project Web Links & Social Profiles
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="font-mono text-stone-400 block mb-1 flex items-center gap-1.5">
                            <Github className="w-3.5 h-3.5 text-stone-300" />
                            <span>GitHub Repository URL</span>
                          </label>
                          <input
                            type="url"
                            value={editingProject.githubUrl || ''}
                            onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                            placeholder="https://github.com/Sagar99-cmyk/..."
                            className="w-full p-2 rounded-lg bg-[#090c14] border border-white/[0.1] text-stone-100 placeholder:text-stone-600"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-stone-400 block mb-1 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Hosting / Live URL</span>
                          </label>
                          <input
                            type="url"
                            value={editingProject.liveDemoUrl || ''}
                            onChange={e => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                            placeholder="https://myproject.vercel.app"
                            className="w-full p-2 rounded-lg bg-[#090c14] border border-white/[0.1] text-stone-100 placeholder:text-stone-600"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-stone-400 block mb-1 flex items-center gap-1.5">
                            <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                            <span>LinkedIn Project URL</span>
                          </label>
                          <input
                            type="url"
                            value={editingProject.linkedinUrl || ''}
                            onChange={e => setEditingProject({ ...editingProject, linkedinUrl: e.target.value })}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full p-2 rounded-lg bg-[#090c14] border border-white/[0.1] text-stone-100 placeholder:text-stone-600"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-stone-400 block mb-1 flex items-center gap-1.5">
                            <Youtube className="w-3.5 h-3.5 text-red-500" />
                            <span>YouTube Video (Optional)</span>
                          </label>
                          <input
                            type="url"
                            value={editingProject.youtubeUrl || ''}
                            onChange={e => setEditingProject({ ...editingProject, youtubeUrl: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full p-2 rounded-lg bg-[#090c14] border border-white/[0.1] text-stone-100 placeholder:text-stone-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setProjectSubTab('list');
                          setProjectFileName('');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-colors cursor-pointer"
                      >
                        Cancel & Return
                      </button>
                      <button
                        type="submit"
                        className="px-7 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>💾 Save Project to MySQL</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SKILLS & CATEGORIES MANAGEMENT */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Header and Sub-Navigation Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent">
                    Technical Skills & Categories
                  </h2>
                  <p className="text-xs text-stone-400">
                    Relational management connected to MySQL via <span className="font-mono text-sky-300">skills</span> and foreign key <span className="font-mono text-sky-300">project_skills</span>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSkillSubTab('list');
                      setEditingSkill(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      skillSubTab === 'list'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                        : 'bg-[#0d101a] text-stone-400 hover:text-white border border-white/[0.08]'
                    }`}
                  >
                    <span>📋 Manage Skills & Categories</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-500/20 text-sky-300 font-bold">
                      {skills.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingSkill({
                        name: '',
                        category: selectedSkillCategory !== 'All' ? selectedSkillCategory : 'Programming',
                        proficiencyLevel: 'Advanced',
                        iconUrl: '',
                        description: '',
                        toolsUsed: [],
                      });
                      setSkillIconFileName('');
                      setSkillSubTab('editor');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                      skillSubTab === 'editor' && !editingSkill?.id
                        ? 'bg-sky-600 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                        : 'bg-sky-600/90 hover:bg-sky-600 text-white border border-sky-500/30'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Skill</span>
                  </button>
                </div>
              </div>

              {/* VIEW 1: MANAGE SKILLS & CATEGORIES LIST */}
              {skillSubTab === 'list' && (
                <div className="space-y-4">
                  {/* TOP 4 HERO SKILLS SLOT CONFIGURATOR */}
                  <div className="p-4 rounded-2xl bg-[#0e121e] border border-rose-500/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-rose-400" />
                          <span>Hero Section — Top 4 Skill Slots</span>
                        </h3>
                        <p className="text-[11px] text-stone-400">
                          Choose which 4 skills appear in the profile card on user side. Changes save instantly to MySQL.
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-rose-300 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 w-fit">
                        Slots 1–4
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[0, 1, 2, 3].map((slotIdx) => {
                        const currentSkill = skills[slotIdx];
                        return (
                          <div
                            key={`slot-${slotIdx}`}
                            className="p-3 rounded-xl bg-[#090c14] border border-white/[0.08] space-y-2 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-rose-400">
                                Slot #{slotIdx + 1}
                              </span>
                              {currentSkill && (
                                <span className="text-[9px] font-mono text-stone-400 truncate max-w-[100px]">
                                  {currentSkill.category}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-stone-900 border border-white/[0.08] flex items-center justify-center shrink-0 p-1">
                                {currentSkill ? getTechLogo(currentSkill.name, currentSkill.iconUrl, 'w-6 h-6') : <Code2 className="w-4 h-4 text-stone-500" />}
                              </div>
                              <select
                                key={`slot-select-${slotIdx}-${currentSkill?.id || 'none'}`}
                                value={currentSkill?.id || ''}
                                onChange={async (e) => {
                                  const targetId = e.target.value;
                                  if (!targetId || targetId === currentSkill?.id) return;
                                  const targetSkill = skills.find(s => s.id === targetId);
                                  const targetName = targetSkill?.name || 'skill';
                                  const newIds = skills.map(s => s.id);
                                  const oldIdx = newIds.indexOf(targetId);
                                  if (oldIdx !== -1) {
                                    const temp = newIds[slotIdx];
                                    newIds[slotIdx] = newIds[oldIdx];
                                    newIds[oldIdx] = temp;
                                  } else {
                                    newIds.splice(slotIdx, 0, targetId);
                                  }

                                  // Optimistic local update so icon and selection update immediately
                                  const optimisticSkills = newIds
                                    .map(id => skills.find(s => s.id === id))
                                    .filter(Boolean) as Skill[];
                                  setSkills(optimisticSkills);

                                  try {
                                    const updatedSkills = await api.reorderSkills(newIds);
                                    setSkills(updatedSkills);
                                    showToast(`Slot #${slotIdx + 1} updated to "${targetName}".`, 'success');
                                    onDataChanged();
                                  } catch (err: any) {
                                    showToast('Error reordering skills: ' + err.message, 'error');
                                    loadAllAdminData();
                                  }
                                }}
                                className="flex-1 bg-[#121626] border border-white/[0.1] text-xs font-semibold text-white rounded-lg px-2 py-1.5 outline-none focus:border-rose-500 truncate cursor-pointer"
                              >
                                {skills
                                  .slice()
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.name} ({s.category})
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Filter Toolbar & Add Category */}
                  <div className="p-3 rounded-2xl bg-[#0b0e17] border border-white/[0.08] space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      {/* Search Skills */}
                      <div className="w-full sm:w-72 relative">
                        <input
                          type="text"
                          value={skillSearchQuery}
                          onChange={e => setSkillSearchQuery(e.target.value)}
                          placeholder="Search skills or categories..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[#080a11] border border-white/[0.08] text-white placeholder:text-stone-500 outline-none focus:border-sky-500/50"
                        />
                        <span className="absolute left-2.5 top-2 text-stone-500 text-xs">🔍</span>
                        {skillSearchQuery && (
                          <button
                            onClick={() => setSkillSearchQuery('')}
                            className="absolute right-2.5 top-1.5 text-stone-400 hover:text-white text-xs cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Add Category Toggle Button */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(!isAddingCategory)}
                          className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-[#141824] hover:bg-[#1a2030] text-sky-300 border border-sky-500/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAddingCategory ? 'Close Adder' : 'Add Category'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Add Category Bar */}
                    {isAddingCategory && (
                      <div className="p-3 rounded-xl bg-[#080a11] border border-sky-500/30 flex flex-col sm:flex-row items-center gap-2 animate-fadeIn">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={e => setNewCategoryName(e.target.value)}
                          placeholder="Enter new category name (e.g. Cloud & DevOps, Machine Learning)..."
                          className="w-full sm:flex-1 p-2 rounded-lg text-xs bg-[#0b0e17] border border-white/[0.1] text-white outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newCategoryName.trim()) return;
                            setSelectedSkillCategory(newCategoryName.trim());
                            setEditingSkill({
                              name: '',
                              category: newCategoryName.trim(),
                              proficiencyLevel: 'Advanced',
                              iconUrl: '',
                              description: '',
                              toolsUsed: [],
                            });
                            setSkillIconFileName('');
                            setSkillSubTab('editor');
                            setNewCategoryName('');
                            setIsAddingCategory(false);
                          }}
                          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold shrink-0 cursor-pointer"
                        >
                          Create & Add Skill
                        </button>
                      </div>
                    )}

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {['All', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean)))].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedSkillCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                            selectedSkillCategory === cat
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                              : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className="ml-1.5 text-[10px] opacity-75 font-bold">
                            ({cat === 'All' ? skills.length : skills.filter(s => s.category === cat).length})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skills Grid - Systematic Sorting with Expert & Advanced First */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                    {skills
                      .filter(sk => {
                        if (selectedSkillCategory !== 'All' && sk.category !== selectedSkillCategory) return false;
                        if (!skillSearchQuery) return true;
                        const q = skillSearchQuery.toLowerCase();
                        return (
                          sk.name.toLowerCase().includes(q) ||
                          sk.category.toLowerCase().includes(q) ||
                          (sk.toolsUsed && sk.toolsUsed.some(t => t.toLowerCase().includes(q)))
                        );
                      })
                      .sort((a, b) => {
                        const rank: Record<string, number> = { 'Expert': 4, 'Advanced': 3, 'Intermediate': 2, 'Beginner': 1 };
                        const diff = (rank[b.proficiencyLevel] || 0) - (rank[a.proficiencyLevel] || 0);
                        if (diff !== 0) return diff;
                        return a.name.localeCompare(b.name);
                      })
                      .map(sk => {
                        const slotIndex = skills.slice(0, 4).findIndex(s => s.id === sk.id);
                        return (
                          <div
                            key={sk.id}
                            className="p-4 rounded-2xl bg-[#0b0e17]/80 border border-white/[0.08] hover:border-rose-500/40 backdrop-blur-xl transition-all flex flex-col justify-between gap-3 group shadow-md"
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div className="w-11 h-11 rounded-xl bg-[#080a11] border border-white/[0.08] flex items-center justify-center shrink-0 p-1.5 group-hover:scale-105 transition-transform shadow-sm">
                                  {getTechLogo(sk.name, sk.iconUrl, 'w-8 h-8')}
                                </div>

                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <h4 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors truncate">
                                      {sk.name}
                                    </h4>
                                    {slotIndex !== -1 && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold shrink-0">
                                        Slot #{slotIndex + 1} Profile
                                      </span>
                                    )}
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800/80 text-stone-300 shrink-0">
                                      {sk.category}
                                    </span>
                                  </div>

                                  {sk.description && (
                                    <p className="text-stone-400 text-[11px] line-clamp-2 pt-0.5">
                                      {sk.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Clean Actions: Edit & Delete Only (No cluttering arrows on cards) */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingSkill(sk);
                                    setSkillIconFileName(sk.iconUrl ? sk.iconUrl.split('/').pop()?.replace(/^skill-\d+-/, '') || '' : '');
                                    setSkillSubTab('editor');
                                  }}
                                  className="p-2 rounded-xl bg-stone-800/90 hover:bg-sky-500/25 hover:text-sky-300 text-stone-300 active:scale-90 transition-all cursor-pointer shadow-sm select-none"
                                  title="Edit Skill"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(sk.id, sk.name)}
                                  className="p-2 rounded-xl bg-stone-800/90 hover:bg-rose-600 hover:text-white text-stone-300 active:scale-90 transition-all cursor-pointer shadow-sm select-none"
                                  title="Delete Skill"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Clean Bottom Meta: Foreign Key Project Link Status & Proficiency Pill */}
                            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                              {(sk.projectsCount || 0) > 0 ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                  <span>🔗</span>
                                  <span>{sk.projectsCount} {sk.projectsCount === 1 ? 'Project Linked' : 'Projects Linked'}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-stone-500 bg-stone-900 border border-white/[0.05]">
                                  <span>⚪</span>
                                  <span>Not linked to projects</span>
                                </span>
                              )}

                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                sk.proficiencyLevel === 'Expert' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                sk.proficiencyLevel === 'Advanced' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                                'bg-stone-800 text-stone-300 border border-white/[0.08]'
                              }`}>
                                {sk.proficiencyLevel}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* VIEW 2: DEDICATED ADD / EDIT SKILL SECTION */}
              {skillSubTab === 'editor' && editingSkill && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#0b0e17] p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkill(null);
                            setSkillSubTab('list');
                            setSkillIconFileName('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <span>← Back to Skills List</span>
                        </button>
                        <span className="text-stone-600">/</span>
                        <span className="text-xs font-mono text-sky-400 font-semibold">
                          {editingSkill.id ? `Editing ID: ${editingSkill.id}` : 'Create New Skill'}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-white">
                        {editingSkill.id ? `Edit Skill: ${editingSkill.name || 'Untitled'}` : 'Add New Technical Stack Skill'}
                      </h3>
                      <p className="text-xs text-stone-400">
                        Configure official tech logos, category classification, and MySQL persistence.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkill(null);
                        setSkillSubTab('list');
                        setSkillIconFileName('');
                      }}
                      className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer self-start sm:self-auto"
                      title="Cancel and return to list"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSkillForm} className="space-y-5 text-xs">
                    {/* Name & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-stone-400 block mb-1">Skill Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. React Js, HTML, Python, MySQL"
                          value={editingSkill.name || ''}
                          onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-stone-400 block mb-1">Category *</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Programming, Data Analytics, Databases, Tools"
                            value={editingSkill.category || ''}
                            onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white outline-none focus:border-sky-500"
                          />
                          <select
                            value=""
                            onChange={e => {
                              if (e.target.value) setEditingSkill({ ...editingSkill, category: e.target.value });
                            }}
                            className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 font-mono text-xs cursor-pointer shrink-0"
                            title="Pick from existing categories"
                          >
                            <option value="">Existing...</option>
                            {Array.from(new Set(skills.map(s => s.category).filter(Boolean))).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Proficiency Level */}
                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Proficiency Level</label>
                      <select
                        value={editingSkill.proficiencyLevel || 'Advanced'}
                        onChange={e => setEditingSkill({ ...editingSkill, proficiencyLevel: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white font-semibold focus:border-sky-500 outline-none"
                      >
                        <option value="Beginner">Beginner (Foundational)</option>
                        <option value="Intermediate">Intermediate (Working Knowledge)</option>
                        <option value="Advanced">Advanced (Projects & Daily Practice)</option>
                        <option value="Expert">Expert (Highly Confident)</option>
                      </select>
                    </div>

                    {/* Icon Selection & Live Preview */}
                    <div className="p-5 rounded-2xl bg-[#080a11] border border-white/[0.08] space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                          <span>Skill Icon & Live User-Side Card Preview</span>
                        </label>
                        {editingSkill.iconUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSkill({ ...editingSkill, iconUrl: '' });
                              setSkillIconFileName('');
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                          >
                            Reset to Default SVG
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        {/* Live User-Side Card Preview Box matching Reference Screenshot */}
                        <div className="md:col-span-4 rounded-2xl p-6 bg-[#0d101a] border-2 border-blue-500 flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(59,130,246,0.45)] relative group">
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Live Preview
                          </span>
                          <div className="w-14 h-14 flex items-center justify-center">
                            {getTechLogo(editingSkill.name || 'Skill', editingSkill.iconUrl, 'w-14 h-14')}
                          </div>
                          <span className="mt-3 text-sm font-bold text-white truncate max-w-[140px]">
                            {editingSkill.name || 'Skill Name'}
                          </span>
                          <span className="mt-1 text-[10px] font-mono text-sky-400">
                            {editingSkill.proficiencyLevel || 'Advanced'}
                          </span>
                        </div>

                        {/* Icon Options */}
                        <div className="md:col-span-8 space-y-3">
                          {/* Preset Buttons */}
                          <div>
                            <span className="text-[10px] font-mono text-stone-400 block mb-1">
                              Click Preset to Auto-Select Official Vector Logo:
                            </span>
                            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-[#05070c] rounded-xl border border-white/[0.06]">
                              {PRESET_TECH_ICONS.map(tech => (
                                <button
                                  key={tech}
                                  type="button"
                                  onClick={() => {
                                    setEditingSkill({
                                      ...editingSkill,
                                      name: editingSkill.name ? editingSkill.name : tech,
                                      iconUrl: '',
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-stone-900 hover:bg-sky-600 hover:text-white text-stone-300 transition-colors cursor-pointer border border-white/[0.05]"
                                >
                                  {tech}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Custom File Upload */}
                          <div>
                            <span className="text-[10px] font-mono text-stone-400 block mb-1">
                              Or Upload Custom Icon File (PNG, SVG, WebP):
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setSkillIconFileName(file.name);
                                setIsUploadingSkillIcon(true);
                                const reader = new FileReader();
                                reader.onload = async () => {
                                  try {
                                    const res = await api.uploadImage(reader.result as string, file.name);
                                    const finalUrl = res?.url || (res as any)?.data?.url || (reader.result as string);
                                    setEditingSkill({ ...editingSkill, iconUrl: finalUrl });
                                    setSkillIconFileName(file.name);
                                  } catch {
                                    setEditingSkill({ ...editingSkill, iconUrl: reader.result as string });
                                    setSkillIconFileName(file.name);
                                  } finally {
                                    setIsUploadingSkillIcon(false);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="block w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:bg-sky-500/20 file:text-sky-300 hover:file:bg-sky-500/30 cursor-pointer"
                            />
                            {isUploadingSkillIcon && (
                              <p className="text-[10px] font-mono text-sky-400 mt-1">Uploading {skillIconFileName}...</p>
                            )}

                            {/* Displays Attached File Name ONLY */}
                            {(skillIconFileName || editingSkill.iconUrl) && (
                              <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-[#090c14] border border-white/[0.1] text-[10px] font-mono">
                                <span className="text-sky-300 truncate max-w-[200px]">
                                  {skillIconFileName || editingSkill.iconUrl?.split('/').pop()?.replace(/^skill-\d+-/, '') || 'Attached Custom Icon'}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[9px] font-bold border border-sky-500/30">
                                  Attached
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingSkill.description || ''}
                        onChange={e => setEditingSkill({ ...editingSkill, description: e.target.value })}
                        placeholder="Brief summary of capability and real-world usage..."
                        className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* Tools Used (Comma-separated) */}
                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Tools / Frameworks (Comma separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(editingSkill.toolsUsed) ? editingSkill.toolsUsed.join(', ') : (editingSkill.toolsUsed || '')}
                        onChange={e => setEditingSkill({
                          ...editingSkill,
                          toolsUsed: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                        })}
                        placeholder="e.g. React 19, Vite, Tailwind CSS"
                        className="w-full p-2.5 rounded-xl bg-[#090c14] border border-white/[0.1] text-white outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSkill(null);
                          setSkillSubTab('list');
                          setSkillIconFileName('');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-colors cursor-pointer"
                      >
                        Cancel & Return
                      </button>
                      <button
                        type="submit"
                        className="px-7 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>💾 Save Skill to MySQL</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE & DYNAMIC ABOUT MANAGEMENT */}
          {activeTab === 'profile' && profileForm && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Profile & Dynamic About Section</h2>
                <p className="text-xs text-stone-500">Configure Sagar Singh's bio, core philosophy, pillars, and highlights.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5 text-xs">
                {/* Basic Details */}
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    <span>Basic Professional Identity</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name || ''}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Designation / Title</label>
                      <input
                        type="text"
                        value={profileForm.designation || ''}
                        onChange={e => setProfileForm({ ...profileForm, designation: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-stone-400 block mb-1">Tagline / Mission</label>
                    <input
                      type="text"
                      value={profileForm.tagline || ''}
                      onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-stone-400 block mb-1">Intro Summary</label>
                    <textarea
                      rows={2}
                      value={profileForm.intro || ''}
                      onChange={e => setProfileForm({ ...profileForm, intro: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email || ''}
                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Phone Number (Click-to-Call)</label>
                      <input
                        type="text"
                        value={profileForm.phone || ''}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-stone-400 block mb-1">Availability Status</label>
                      <input
                        type="text"
                        value={profileForm.availabilityStatus || ''}
                        onChange={e => setProfileForm({ ...profileForm, availabilityStatus: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* DYNAMIC ABOUT SECTION CONFIGURATION */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-white text-sm">Dynamic About Section Details</h4>
                  </div>

                  <div>
                    <label className="font-mono text-stone-400 block mb-1">Detailed About Bio</label>
                    <textarea
                      rows={3}
                      value={profileForm.aboutBio || ''}
                      onChange={e => setProfileForm({ ...profileForm, aboutBio: e.target.value })}
                      placeholder="Comprehensive background narrative about education, skills, and aspirations..."
                      className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-stone-400 block mb-1">Core Philosophy Statement</label>
                    <input
                      type="text"
                      value={profileForm.aboutDetails?.philosophy || ''}
                      onChange={e => setProfileForm({
                        ...profileForm,
                        aboutDetails: {
                          ...profileForm.aboutDetails,
                          philosophy: e.target.value,
                        },
                      })}
                      placeholder="e.g. Transforming raw information into executive clarity..."
                      className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-white outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Highlights (4 bullets) */}
                  <div className="space-y-2">
                    <label className="font-mono text-stone-400 block">Strategic Career Highlights (4 Points)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[0, 1, 2, 3].map((idx) => {
                        const currentHighlights = profileForm.aboutDetails?.highlights || [
                          'BCA Graduate from Presidency College with strong technical fundamentals',
                          'Hands-on expertise in Power BI, SQL databases, and Python data pipelines',
                          'Builder of practical web applications with modern React and clean UI',
                          'Disciplined, analytical mindset fostered by college activities and NCC camps',
                        ];
                        return (
                          <input
                            key={idx}
                            type="text"
                            value={currentHighlights[idx] || ''}
                            onChange={(e) => {
                              const updated = [...currentHighlights];
                              updated[idx] = e.target.value;
                              setProfileForm({
                                ...profileForm,
                                aboutDetails: {
                                  ...profileForm.aboutDetails,
                                  highlights: updated,
                                },
                              });
                            }}
                            placeholder={`Highlight #${idx + 1}`}
                            className="w-full p-2 rounded-lg bg-stone-900 border border-stone-800 text-white text-xs outline-none focus:border-sky-500"
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Pillars (3 Strategic Pillars) */}
                  <div className="space-y-2">
                    <label className="font-mono text-stone-400 block">3 Strategic Pillars (Title & Description)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[0, 1, 2].map((idx) => {
                        const defaultPillars = [
                          { title: 'Data Analytics & BI', desc: 'Transforming raw transactional records into high-impact interactive dashboards.' },
                          { title: 'Web & API Engineering', desc: 'Building responsive web interfaces, robust backend endpoints, and smooth UX.' },
                          { title: 'Database Architecture', desc: 'Designing optimized relational schemas, SQL queries, and secure cloud storage.' },
                        ];
                        const currentPillars = profileForm.aboutDetails?.pillars || defaultPillars;
                        const p = currentPillars[idx] || defaultPillars[idx];
                        return (
                          <div key={idx} className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-2">
                            <input
                              type="text"
                              value={p.title || ''}
                              onChange={(e) => {
                                const updated = [...currentPillars];
                                updated[idx] = { ...p, title: e.target.value };
                                setProfileForm({
                                  ...profileForm,
                                  aboutDetails: {
                                    ...profileForm.aboutDetails,
                                    pillars: updated,
                                  },
                                });
                              }}
                              placeholder={`Pillar #${idx + 1} Title`}
                              className="w-full p-1.5 rounded bg-stone-950 border border-stone-800 text-white font-bold text-xs"
                            />
                            <textarea
                              rows={2}
                              value={p.desc || ''}
                              onChange={(e) => {
                                const updated = [...currentPillars];
                                updated[idx] = { ...p, desc: e.target.value };
                                setProfileForm({
                                  ...profileForm,
                                  aboutDetails: {
                                    ...profileForm.aboutDetails,
                                    pillars: updated,
                                  },
                                });
                              }}
                              placeholder="Description..."
                              className="w-full p-1.5 rounded bg-stone-950 border border-stone-800 text-stone-300 text-[11px]"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-lg transition-colors cursor-pointer"
                  >
                    Save Profile & About Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4.5: DEDICATED RESUME MANAGEMENT */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Official Resume Management</h2>
                  <p className="text-xs text-stone-500">Upload and update your official resume PDF synced across the portfolio.</p>
                </div>

                <a
                  href={profile?.resumeUrl || '/assets/Sagar_Singh_Resume.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-sky-400" />
                  <span>Preview Live Resume</span>
                </a>
              </div>

              {/* Resume Status Card */}
              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center shrink-0">
                    <FileText className="w-7 h-7 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Sagar_Singh_Resume.pdf</h3>
                    <p className="text-xs text-stone-400">
                      Canonical path: <code className="font-mono text-sky-400">public/assets/Sagar_Singh_Resume.pdf</code>
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-stone-500">
                      <span>Total Downloads: {metrics?.resumeDownloadsCount ?? 0}</span>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active on Frontend
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct PDF Upload Box */}
                <div className="p-6 rounded-xl border-2 border-dashed border-stone-700 hover:border-sky-500/60 bg-stone-950/60 transition-colors text-center space-y-3">
                  <Upload className="w-8 h-8 mx-auto text-sky-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Upload New Official Resume PDF</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Select a new PDF from your computer to instantly update both the Download and Preview buttons.
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleResumeFileUpload(file);
                      }}
                      className="block w-full text-xs text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-500 cursor-pointer"
                    />
                  </div>

                  {isUploadingResume && (
                    <div className="text-xs font-mono text-amber-400 flex items-center justify-center gap-2 pt-2">
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full" />
                      <span>Uploading & syncing {resumeFileName}...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INBOX & REAL EMAIL COMMUNICATION SYSTEM */}
          {activeTab === 'inbox' && (() => {
            const unreadCount = messages.filter(m => !m.read && !m.archived).length;
            const readCount = messages.filter(m => m.read && !m.archived).length;
            const repliedCount = messages.filter(m => m.replied && !m.archived).length;
            const archivedCount = messages.filter(m => m.archived).length;
            const allInboxCount = messages.filter(m => !m.archived).length;

            const filteredMessages = messages.filter(msg => {
              if (inboxSubTab === 'inbox' && msg.archived) return false;
              if (inboxSubTab === 'unread' && (msg.read || msg.archived)) return false;
              if (inboxSubTab === 'read' && (!msg.read || msg.archived)) return false;
              if (inboxSubTab === 'replied' && (!msg.replied || msg.archived)) return false;
              if (inboxSubTab === 'archived' && !msg.archived) return false;

              if (inboxSearch.trim()) {
                const q = inboxSearch.toLowerCase().trim();
                const matchName = (msg.name || '').toLowerCase().includes(q);
                const matchEmail = (msg.email || '').toLowerCase().includes(q);
                const matchSubject = (msg.subject || '').toLowerCase().includes(q);
                const matchBody = (msg.message || '').toLowerCase().includes(q);
                const matchCompany = (msg.company || '').toLowerCase().includes(q);
                if (!matchName && !matchEmail && !matchSubject && !matchBody && !matchCompany) return false;
              }

              if (inboxDateFilter !== 'all') {
                const msgTime = new Date(msg.createdAt).getTime();
                const now = Date.now();
                if (inboxDateFilter === 'today' && now - msgTime > 86400000) return false;
                if (inboxDateFilter === '7days' && now - msgTime > 86400000 * 7) return false;
                if (inboxDateFilter === '30days' && now - msgTime > 86400000 * 30) return false;
              }

              return true;
            });

            const totalInboxPages = Math.max(1, Math.ceil(filteredMessages.length / messagesPerPage));
            const paginatedMessages = filteredMessages.slice(
              (inboxPage - 1) * messagesPerPage,
              inboxPage * messagesPerPage
            );

            const activeMessage = messages.find(m => m.id === selectedMessageId) || null;

            return (
              <div className="space-y-6">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090c14]/90 border border-white/[0.08] backdrop-blur-xl">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <Inbox className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                          <span>Contact Messages Inbox</span>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                              {unreadCount} New
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-stone-400">
                          Receive visitor inquiries and reply directly to their real email address via SMTP.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Real-Time SSE Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.08] text-[11px] font-mono text-stone-400">
                      <span className={`w-2 h-2 rounded-full ${isSseConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                      <span>{isSseConnected ? 'Real-Time Sync Active' : 'Polling Sync'}</span>
                    </div>

                    <button
                      onClick={async () => {
                        try {
                          const fresh = await api.getMessages();
                          setMessages(fresh);
                          showToast('Inbox refreshed from MySQL.', 'success');
                        } catch (err: any) {
                          showToast('Refresh failed: ' + err.message, 'error');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
                  {[
                    { id: 'inbox', label: 'Inbox', count: allInboxCount, icon: <Inbox className="w-3.5 h-3.5" /> },
                    { id: 'unread', label: 'Unread', count: unreadCount, icon: <Mail className="w-3.5 h-3.5" /> },
                    { id: 'read', label: 'Read', count: readCount, icon: <MailOpen className="w-3.5 h-3.5" /> },
                    { id: 'replied', label: 'Replied', count: repliedCount, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
                    { id: 'archived', label: 'Archived', count: archivedCount, icon: <Archive className="w-3.5 h-3.5" /> },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setInboxSubTab(tab.id as any);
                        setInboxPage(1);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        inboxSubTab === tab.id
                          ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                          : 'bg-white/[0.03] text-stone-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                          inboxSubTab === tab.id
                            ? 'bg-black/30 text-white'
                            : 'bg-white/[0.06] text-stone-400'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search Bar & Date Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={inboxSearch}
                      onChange={e => {
                        setInboxSearch(e.target.value);
                        setInboxPage(1);
                      }}
                      placeholder="Search inquiries by sender name, email, subject, or message keyword..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#090c14] border border-white/[0.08] text-white text-xs placeholder:text-stone-500 outline-none focus:border-rose-500/50 transition-colors"
                    />
                    {inboxSearch && (
                      <button
                        onClick={() => setInboxSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="sm:col-span-4 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-stone-500" />
                    <select
                      value={inboxDateFilter}
                      onChange={e => {
                        setInboxDateFilter(e.target.value as any);
                        setInboxPage(1);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#090c14] border border-white/[0.08] text-white text-xs outline-none focus:border-rose-500/50 cursor-pointer"
                    >
                      <option value="all">Date: All Time</option>
                      <option value="today">Date: Received Today</option>
                      <option value="7days">Date: Past 7 Days</option>
                      <option value="30days">Date: Past 30 Days</option>
                    </select>
                  </div>
                </div>

                {/* Main Inbox Workspace: Split-View for Messages List & Detail Thread */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Messages List (Full on Mobile, 5 cols on Large Screens) */}
                  <div className={`space-y-3 ${selectedMessageId ? 'hidden lg:block lg:col-span-5' : 'col-span-12 lg:col-span-5'}`}>
                    {paginatedMessages.length === 0 ? (
                      <div className="p-10 text-center rounded-2xl border border-dashed border-white/[0.1] bg-[#090c14]/50 space-y-2">
                        <Inbox className="w-8 h-8 text-stone-600 mx-auto" />
                        <p className="text-xs font-semibold text-stone-300">No messages found in this view</p>
                        <p className="text-[11px] text-stone-500">
                          {inboxSearch ? 'Try clearing your search query or switching tabs.' : 'New messages submitted through the contact form will appear here automatically.'}
                        </p>
                      </div>
                    ) : (
                      paginatedMessages.map(msg => {
                        const isSelected = selectedMessageId === msg.id;
                        const formattedDate = new Date(msg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        });
                        const formattedTime = new Date(msg.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div
                            key={msg.id}
                            onClick={() => {
                              setSelectedMessageId(msg.id);
                              if (!msg.read) {
                                handleToggleMessageRead(msg.id, false);
                              }
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                              isSelected
                                ? 'bg-rose-500/[0.08] border-rose-500/50 shadow-[0_0_20px_rgba(225,29,72,0.15)]'
                                : msg.read
                                ? 'bg-[#0d101a]/80 border-white/[0.08] hover:border-white/[0.18] hover:bg-[#111522]'
                                : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-950/30'
                            }`}
                          >
                            {/* Unread Indicator Bar */}
                            {!msg.read && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                            )}

                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-stone-800 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-white shrink-0">
                                  {(msg.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="truncate">
                                  <span className={`text-xs truncate block ${!msg.read ? 'font-bold text-white' : 'font-medium text-stone-300'}`}>
                                    {msg.name}
                                  </span>
                                  <span className="text-[10px] font-mono text-stone-500 truncate block">
                                    {msg.email}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-mono text-stone-500 block">
                                  {formattedDate}
                                </span>
                                <span className="text-[9px] font-mono text-stone-600 block">
                                  {formattedTime}
                                </span>
                              </div>
                            </div>

                            <p className={`text-xs mb-1 line-clamp-1 ${!msg.read ? 'font-semibold text-rose-200' : 'text-stone-300'}`}>
                              {msg.subject}
                            </p>

                            <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                              {msg.message}
                            </p>

                            {/* Status Tags */}
                            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/[0.04]">
                              {msg.replied && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>Replied</span>
                                </span>
                              )}
                              {msg.archived && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20 flex items-center gap-1">
                                  <Archive className="w-2.5 h-2.5" />
                                  <span>Archived</span>
                                </span>
                              )}
                              {msg.company && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-white/[0.04] text-stone-400 truncate max-w-[140px]">
                                  {msg.company}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Pagination Controls */}
                    {totalInboxPages > 1 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#090c14] border border-white/[0.08] text-xs">
                        <span className="text-stone-500 font-mono text-[11px]">
                          Page {inboxPage} of {totalInboxPages} ({filteredMessages.length} total)
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={inboxPage <= 1}
                            onClick={() => setInboxPage(p => Math.max(1, p - 1))}
                            className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={inboxPage >= totalInboxPages}
                            onClick={() => setInboxPage(p => Math.min(totalInboxPages, p + 1))}
                            className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Message Detail & Real Email Thread Viewer (Full on Mobile when selected, 7 cols on Large Screens) */}
                  <div className={`space-y-4 ${selectedMessageId ? 'col-span-12 lg:col-span-7' : 'hidden lg:block lg:col-span-7'}`}>
                    {activeMessage ? (
                      <div className="p-6 rounded-2xl bg-[#090c14] border border-white/[0.08] space-y-6 animate-fadeIn">
                        {/* Top Action Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                          {/* Mobile Back Button */}
                          <button
                            onClick={() => setSelectedMessageId(null)}
                            className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Back to List</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {/* Read / Unread Toggle */}
                            <button
                              onClick={() => handleToggleMessageRead(activeMessage.id, activeMessage.read)}
                              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={activeMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                            >
                              {activeMessage.read ? <Mail className="w-3.5 h-3.5 text-amber-400" /> : <MailOpen className="w-3.5 h-3.5 text-emerald-400" />}
                              <span>{activeMessage.read ? 'Mark Unread' : 'Mark Read'}</span>
                            </button>

                            {/* Archive / Restore Toggle */}
                            <button
                              onClick={() => handleToggleArchive(activeMessage.id, Boolean(activeMessage.archived))}
                              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={activeMessage.archived ? 'Restore to Inbox' : 'Move to Archive'}
                            >
                              {activeMessage.archived ? <ArchiveRestore className="w-3.5 h-3.5 text-sky-400" /> : <Archive className="w-3.5 h-3.5 text-slate-400" />}
                              <span>{activeMessage.archived ? 'Restore' : 'Archive'}</span>
                            </button>

                            {/* Open in external Email Client */}
                            <a
                              href={`mailto:${activeMessage.email}?subject=${encodeURIComponent(
                                activeMessage.subject.startsWith('Re:') ? activeMessage.subject : `Re: ${activeMessage.subject}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Open in default Email client"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                              <span className="hidden sm:inline">Mailto</span>
                            </a>

                            {/* Delete Message */}
                            <button
                              onClick={() => handleDeleteMessage(activeMessage.id)}
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs transition-colors cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Message Subject & Sender Info */}
                        <div className="space-y-3">
                          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                            {activeMessage.subject}
                          </h3>

                          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-950/80 border border-white/[0.06] text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center font-bold text-sm text-white shadow-md">
                                {(activeMessage.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm">{activeMessage.name}</span>
                                  {activeMessage.company && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-stone-300">
                                      {activeMessage.company}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[11px]">
                                  <span>{activeMessage.email}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(activeMessage.email);
                                      showToast('Email address copied to clipboard.', 'success');
                                    }}
                                    className="text-stone-500 hover:text-white transition-colors"
                                    title="Copy email address"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="text-right text-[11px] font-mono text-stone-500">
                              <div className="flex items-center gap-1 justify-end">
                                <Clock className="w-3 h-3 text-stone-600" />
                                <span>
                                  {new Date(activeMessage.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <span>
                                {new Date(activeMessage.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Full Message Body */}
                        <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-stone-200 leading-relaxed whitespace-pre-wrap font-sans selection:bg-rose-500/30">
                          {activeMessage.message}
                        </div>

                        {/* Conversation & Reply History Timeline */}
                        {activeMessage.replies && activeMessage.replies.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Conversation & Reply History ({activeMessage.replies.length})</span>
                            </h4>

                            <div className="space-y-3">
                              {activeMessage.replies.map(rep => (
                                <div
                                  key={rep.id}
                                  className="p-4 rounded-xl bg-[#101422] border border-white/[0.08] space-y-2 text-xs"
                                >
                                  <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-rose-300">From: Sagar Singh</span>
                                      <span className="text-stone-500 font-mono">→ {rep.recipientEmail}</span>
                                    </div>
                                    <span className="text-stone-500 font-mono">
                                      {new Date(rep.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>

                                  <div className="p-3 rounded-lg bg-black/30 border border-white/[0.04] text-stone-200 whitespace-pre-wrap text-[11px] leading-relaxed">
                                    {rep.replyContent}
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 font-mono">
                                    <span className="flex items-center gap-1.5">
                                      {rep.status === 'sent' ? (
                                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                          <Check className="w-3 h-3" />
                                          <span>Delivered via SMTP</span>
                                        </span>
                                      ) : (
                                        <span className="text-amber-400 flex items-center gap-1 font-semibold">
                                          <AlertCircle className="w-3 h-3" />
                                          <span>Delivery Notice: {rep.errorDetails || 'Failed'}</span>
                                        </span>
                                      )}
                                    </span>
                                    {rep.providerMessageId && (
                                      <span className="truncate max-w-[200px]" title={rep.providerMessageId}>
                                        ID: {rep.providerMessageId}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Real Email Reply Composer */}
                        <div className="p-5 rounded-2xl bg-[#0d101a] border border-rose-500/30 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                              <Reply className="w-4 h-4 text-rose-500" />
                              <span>Compose Real Email Reply to {activeMessage.name}</span>
                            </div>
                            <span className="text-[11px] font-mono text-stone-500">
                              Recipient: <strong className="text-stone-300">{activeMessage.email}</strong>
                            </span>
                          </div>

                          {/* Quick Response Templates */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                              Quick Reply Templates:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleApplyQuickTemplate('general', activeMessage)}
                                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[10px] font-medium transition-colors cursor-pointer border border-white/[0.06]"
                              >
                                ⚡ General Appreciation & Call
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplyQuickTemplate('analytics', activeMessage)}
                                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[10px] font-medium transition-colors cursor-pointer border border-white/[0.06]"
                              >
                                📊 Power BI & Analytics Project
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApplyQuickTemplate('portfolio', activeMessage)}
                                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[10px] font-medium transition-colors cursor-pointer border border-white/[0.06]"
                              >
                                💼 Portfolio & Resume Sharing
                              </button>
                            </div>
                          </div>

                          {/* Reply Textarea */}
                          <div className="space-y-2">
                            <textarea
                              rows={5}
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder={`Type your reply to ${activeMessage.name}... This message will be sent directly to ${activeMessage.email} via SMTP.`}
                              className="w-full p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs outline-none focus:border-rose-500/60 leading-relaxed placeholder:text-stone-600"
                            />
                            <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                              <span>Formatted with Sagar Singh Portfolio Branding</span>
                              <span>{replyText.length} characters</span>
                            </div>
                          </div>

                          {/* Status Notice if previously sent */}
                          {replyStatusNotice && replyStatusNotice.id === activeMessage.id && (
                            <div
                              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                                replyStatusNotice.success
                                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                              }`}
                            >
                              {replyStatusNotice.success ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                              )}
                              <span>{replyStatusNotice.message}</span>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <span className="text-[11px] text-stone-500 font-mono">
                              From: <span className="text-stone-300">sirroshan999@gmail.com</span>
                            </span>

                            <div className="flex items-center gap-2">
                              {replyText && (
                                <button
                                  type="button"
                                  onClick={() => setReplyText('')}
                                  className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                                >
                                  Clear
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={isSubmittingReply || !replyText.trim()}
                                onClick={() => handleSendRealReply(activeMessage.id, activeMessage.email, activeMessage.subject)}
                                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)' }}
                              >
                                {isSubmittingReply ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Transmitting via SMTP...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Send Real Email Reply</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center rounded-2xl border border-dashed border-white/[0.1] bg-[#090c14]/40 space-y-3">
                        <MessageSquare className="w-10 h-10 text-stone-600 mx-auto" />
                        <h4 className="text-sm font-bold text-white">Select a contact message to view & reply</h4>
                        <p className="text-xs text-stone-500 max-w-sm mx-auto">
                          Click on any inquiry from the left panel to read the full message, view previous email replies, and send a direct response.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold tracking-tight text-white">Email Subscribers</h2>
                <p className="text-xs" style={{ color: '#64748b' }}>
                  People who subscribed from the footer. Total: {subscribers.length}
                </p>
              </div>

              {subscribers.length === 0 ? (
                <div
                  className="p-12 rounded-2xl border border-dashed text-center"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <p style={{ color: '#64748b' }} className="text-sm">No subscribers yet.</p>
                  <p className="text-xs mt-1" style={{ color: '#334155' }}>
                    Subscribers will appear here when people sign up from the footer.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subscribers.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 rounded-xl border"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(255,255,255,0.07)',
                      }}
                    >
                      <div>
                        <p className="font-medium text-sm text-white">{sub.email}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                          Joined: {new Date(sub.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteSubscriber(sub.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#64748b' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#e11d48'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#64748b'}
                        title="Remove subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MYSQL & WORKBENCH */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/25">
                    <Database className="w-3.5 h-3.5" />
                    <span>Relational Database Management</span>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white">
                    MySQL & Workbench Suite
                  </h2>
                  <p className="text-xs text-stone-400">
                    Dual-engine persistence: Live MySQL database synchronization, table analytics, and MySQL Workbench integration.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={async () => {
                      const fresh = await api.getDatabaseStatus();
                      setDbStatus(fresh);
                      showNotification('Refreshed database status.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleSyncToMySQL}
                    disabled={isSyncingDb}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 transition-colors"
                  >
                    <ArrowUpFromLine className="w-3.5 h-3.5" />
                    <span>{isSyncingDb ? 'Syncing...' : 'Sync to MySQL'}</span>
                  </button>

                  <button
                    onClick={handleSyncFromMySQL}
                    disabled={isSyncingDb}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 transition-colors"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>Import from MySQL</span>
                  </button>
                </div>
              </div>

              {/* Real-time Connection Health Banner */}
              <div
                className={`p-5 rounded-2xl border ${
                  dbStatus?.connected
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        dbStatus?.connected
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <Server className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            dbStatus?.connected
                              ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]'
                              : 'bg-amber-400'
                          }`}
                        />
                        <h3 className="text-base font-bold text-white">
                          {dbStatus?.connected ? 'MySQL Active & Synchronized' : 'In-Memory Store Mode (Zero Downtime)'}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-300">
                        {dbStatus?.message || 'Dual-engine active: Portfolio continues serving in-memory while MySQL is configured.'}
                      </p>
                    </div>
                  </div>

                  {/* Connection Details Pills */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
                      Host: <strong>{dbStatus?.host || 'localhost'}:{dbStatus?.port || 3306}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-sky-400">
                      DB: <strong>{dbStatus?.database || 'sagar_portfolio_db'}</strong>
                    </span>
                    {dbStatus?.version && (
                      <span className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-emerald-400">
                        {dbStatus.version}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Table Record Counters Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-sky-400" />
                  <span>MySQL Database Tables & Record Counts</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { table: 'portfolio_profile', name: 'Profile Bio', count: dbStatus?.tableCounts?.portfolio_profile ?? 1, color: '#f43f5e' },
                    { table: 'skills', name: 'Skills Catalog', count: dbStatus?.tableCounts?.skills ?? skills.length, color: '#f59e0b' },
                    { table: 'projects', name: 'Projects', count: dbStatus?.tableCounts?.projects ?? projects.length, color: '#38bdf8' },
                    { table: 'education', name: 'Education', count: dbStatus?.tableCounts?.education ?? education.length, color: '#a855f7' },
                    { table: 'achievements', name: 'Achievements', count: dbStatus?.tableCounts?.achievements ?? achievements.length, color: '#22c55e' },
                    { table: 'contact_messages', name: 'Inquiries', count: dbStatus?.tableCounts?.contact_messages ?? messages.length, color: '#ec4899' },
                    { table: 'newsletter_subscribers', name: 'Subscribers', count: dbStatus?.tableCounts?.newsletter_subscribers ?? subscribers.length, color: '#14b8a6' },
                  ].map(item => (
                    <div
                      key={item.table}
                      className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1 hover:border-stone-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-stone-400 truncate">{item.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      </div>
                      <div className="text-xl font-bold font-mono text-white">
                        {item.count}
                      </div>
                      <div className="text-[10px] font-mono text-stone-500 truncate">
                        `{item.table}`
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column Section: MySQL Workbench Guide & Dynamic Connection Tester */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Panel 1: MySQL Workbench Connection & SQL Scripts */}
                <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">MySQL Workbench Folder & Files</h3>
                      <p className="text-xs text-stone-400">Ready-to-run SQL scripts in <code className="text-amber-300">mysql-workbench/</code></p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {[
                      { file: '01_create_schema.sql', desc: 'Creates sagar_portfolio_db and 12 relational tables with foreign keys and indexes' },
                      { file: '02_seed_portfolio_data.sql', desc: 'Inserts Sagar Singh resume data ($2.4M Sales Dashboard case study, skills, BCA degree)' },
                      { file: '03_analytics_and_views.sql', desc: 'Creates executive views (v_executive_portfolio_summary, v_projects_catalog) & stored procedures' },
                      { file: '04_sample_workbench_queries.sql', desc: '10 analytical queries for testing, recruiter inquiries, and KPI tracking' },
                      { file: 'README_WORKBENCH_GUIDE.md', desc: 'Step-by-step setup guide with EER diagram reverse-engineering instructions' },
                    ].map((script, idx) => (
                      <div
                        key={script.file}
                        className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sky-400">
                            {idx + 1}. {script.file}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-900 text-stone-400 border border-stone-800">
                            SQL Script
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 leading-relaxed">
                          {script.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                    <p className="font-bold">Workbench Connection Settings:</p>
                    <p className="font-mono text-[11px] text-stone-300">
                      Hostname: <strong>127.0.0.1</strong> · Port: <strong>3306</strong> · Username: <strong>root</strong> · Default Schema: <strong>sagar_portfolio_db</strong>
                    </p>
                  </div>
                </div>

                {/* Panel 2: Live Connection Tester Form */}
                <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Live Connection Tester</h3>
                      <p className="text-xs text-stone-400">Test MySQL credentials without restarting the server</p>
                    </div>
                  </div>

                  <form onSubmit={handleTestDbConnection} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-stone-400 mb-1">Host</label>
                        <input
                          type="text"
                          value={customDbCreds.host}
                          onChange={e => setCustomDbCreds({ ...customDbCreds, host: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                          placeholder="localhost"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-stone-400 mb-1">Port</label>
                        <input
                          type="number"
                          value={customDbCreds.port}
                          onChange={e => setCustomDbCreds({ ...customDbCreds, port: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                          placeholder="3306"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-stone-400 mb-1">User</label>
                        <input
                          type="text"
                          value={customDbCreds.user}
                          onChange={e => setCustomDbCreds({ ...customDbCreds, user: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                          placeholder="root"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-stone-400 mb-1">Password</label>
                        <input
                          type="password"
                          value={customDbCreds.password}
                          onChange={e => setCustomDbCreds({ ...customDbCreds, password: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                          placeholder="Root MySQL password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-stone-400 mb-1">Database Schema</label>
                      <input
                        type="text"
                        value={customDbCreds.database}
                        onChange={e => setCustomDbCreds({ ...customDbCreds, database: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                        placeholder="sagar_portfolio_db"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isTestingDb}
                      className="w-full py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-all"
                      style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingDb ? 'animate-spin' : ''}`} />
                      <span>{isTestingDb ? 'Testing Connection...' : 'Test MySQL Connection'}</span>
                    </button>
                  </form>

                  {/* Test Result Feedback */}
                  {dbTestResult && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                        dbTestResult.success
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        {dbTestResult.success ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>{dbTestResult.success ? 'Connection Succeeded!' : 'Connection Refused'}</span>
                      </div>
                      <p className="text-[11px] opacity-90 pl-6 leading-tight">
                        {dbTestResult.message}
                      </p>
                      {dbTestResult.version && (
                        <p className="text-[11px] opacity-80 pl-6 font-mono">
                          Server: {dbTestResult.version}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-400 space-y-1">
                    <p className="font-semibold text-stone-300">Permanent Configuration:</p>
                    <p className="text-[11px] leading-relaxed">
                      To make this connection default on server start, update your <code className="text-amber-400">.env</code> file:
                    </p>
                    <pre className="p-2 rounded bg-stone-900 text-[10px] font-mono text-stone-300 overflow-x-auto">
{`MYSQL_ENABLED=true
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=sagar_portfolio_db`}
                    </pre>
                  </div>
                </div>

              </div>

            </div>
          )}

            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* On-Webpage Custom Confirmation Modal (Replaces native browser confirm) */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#0e121d] border border-rose-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${confirmModal.isDestructive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'}`}>
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {confirmModal.title}
                </h3>
                <p className="text-[11px] font-mono text-stone-400">
                  Database action confirmation
                </p>
              </div>
            </div>

            <div className="text-xs text-stone-300 leading-relaxed bg-[#080a11] p-3.5 rounded-xl border border-white/[0.06]">
              {confirmModal.message}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 active:scale-95 transition-all cursor-pointer select-none touch-manipulation"
              >
                {confirmModal.cancelLabel || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold text-white active:scale-95 transition-all cursor-pointer select-none touch-manipulation flex items-center gap-1.5 shadow-lg ${
                  confirmModal.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'bg-sky-600 hover:bg-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmModal.confirmLabel || 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating In-Webpage Toast Notification Banner (Auto-dismisses after 4.5s) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-6 right-6 z-[130] max-w-md pointer-events-auto"
          >
            <div className={`relative overflow-hidden p-4 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-2xl ${
              toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/60 text-rose-100 shadow-[0_10px_40px_rgba(244,63,94,0.4)]'
                : 'bg-[#062016]/95 border-emerald-500/60 text-emerald-100 shadow-[0_10px_40px_rgba(16,185,129,0.4)]'
            }`}>
              {/* 4.5s Auto-dismiss countdown bar */}
              <div
                className={`absolute bottom-0 left-0 h-1 rounded-full ${
                  toast.type === 'error' ? 'bg-rose-400' : 'bg-emerald-400'
                }`}
                style={{
                  width: '100%',
                  animation: 'toastCountdown 4.5s linear forwards',
                }}
              />

              <div className="mt-0.5 shrink-0">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold font-mono">
                    {toast.type === 'error' ? 'Notice' : 'Database Success'}
                  </p>
                  <span className="text-[10px] font-mono opacity-60">auto-closes</span>
                </div>
                <p className="text-xs font-medium leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.1] transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
