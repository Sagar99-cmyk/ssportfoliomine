import { query } from '../connection';
import type { ContactMessage, ContactReply } from '../types';
import { sendContactReplyEmail } from '../../emailService';

// In-memory fallback dataset for development resiliency if MySQL is temporarily offline
const memoryMessages: ContactMessage[] = [
  {
    id: 'msg-sample-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@techcorp.io',
    subject: 'Data Analytics & Power BI Dashboard Project Inquiry',
    company: 'TechCorp Analytics',
    message: 'Hello Sagar, I came across your portfolio and was thoroughly impressed by your Power BI & Python analytics dashboards. We have an upcoming client project requiring executive KPI dashboards and would like to explore working with you.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    read: false,
    replied: false,
    archived: false,
    replies: [],
  },
  {
    id: 'msg-sample-2',
    name: 'Priya Patel',
    email: 'priya.patel@innovatehub.com',
    subject: 'Full-Stack Web Development Consultation',
    company: 'InnovateHub Solutions',
    message: 'Hi Sagar, your portfolio looks stunning! We are looking for a BCA graduate with solid React and Supabase experience for a contract-to-hire opportunity. Please let us know your availability.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    read: true,
    replied: true,
    replyText: 'Hi Priya, thank you for reaching out! I would love to discuss this opportunity. My calendar is open this week.',
    repliedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    archived: false,
    replies: [
      {
        id: 'rep-sample-1',
        messageId: 'msg-sample-2',
        recipientEmail: 'priya.patel@innovatehub.com',
        senderEmail: 'sirroshan999@gmail.com',
        subject: 'Re: Full-Stack Web Development Consultation',
        replyContent: 'Hi Priya, thank you for reaching out! I would love to discuss this opportunity. My calendar is open this week.',
        providerMessageId: '<sample-id-1@mail.gmail.com>',
        status: 'sent',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
    ],
  },
];

const memoryReplies: ContactReply[] = [
  {
    id: 'rep-sample-1',
    messageId: 'msg-sample-2',
    recipientEmail: 'priya.patel@innovatehub.com',
    senderEmail: 'sirroshan999@gmail.com',
    subject: 'Re: Full-Stack Web Development Consultation',
    replyContent: 'Hi Priya, thank you for reaching out! I would love to discuss this opportunity. My calendar is open this week.',
    providerMessageId: '<sample-id-1@mail.gmail.com>',
    status: 'sent',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

export async function createMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  clientIp?: string;
}): Promise<ContactMessage> {
  const { name, email, subject, message, company, clientIp } = data;
  if (!name || !email || !subject || !message) {
    throw new Error('Please fill in all required message fields.');
  }

  const id = `msg-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const newMsg: ContactMessage = {
    id,
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    company: company ? company.trim() : '',
    message: message.trim(),
    createdAt,
    read: false,
    replied: false,
    archived: false,
    replies: [],
  };

  try {
    await query(`
      INSERT INTO \`contact_messages\` (
        id, name, email, subject, company, message, is_read, replied, is_archived, client_ip, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, ?, NOW())
    `, [id, newMsg.name, newMsg.email, newMsg.subject, newMsg.company || null, newMsg.message, clientIp || null]);
  } catch (err: any) {
    try {
      await query(`
        INSERT INTO \`contact_messages\` (
          id, name, email, subject, company, message, is_read, replied, client_ip, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, NOW())
      `, [id, newMsg.name, newMsg.email, newMsg.subject, newMsg.company || null, newMsg.message, clientIp || null]);
    } catch {
      console.warn('MySQL unavailable for createMessage; stored in memory fallback.');
    }
  }

  memoryMessages.unshift(newMsg);
  return newMsg;
}

export async function getAllMessages(filters?: {
  status?: 'all' | 'unread' | 'read' | 'replied' | 'archived';
  search?: string;
}): Promise<ContactMessage[]> {
  try {
    const rows: any = await query(`
      SELECT * FROM \`contact_messages\`
      ORDER BY created_at DESC
    `);

    let repliesMap = new Map<string, ContactReply[]>();
    try {
      const replyRows: any = await query(`
        SELECT * FROM \`contact_replies\`
        ORDER BY created_at ASC
      `);
      if (Array.isArray(replyRows)) {
        for (const r of replyRows) {
          const list = repliesMap.get(r.message_id) || [];
          list.push({
            id: r.id,
            messageId: r.message_id,
            recipientEmail: r.recipient_email,
            senderEmail: r.sender_email,
            subject: r.subject,
            replyContent: r.reply_content,
            providerMessageId: r.provider_message_id || undefined,
            status: r.status,
            errorDetails: r.error_details || undefined,
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          });
          repliesMap.set(r.message_id, list);
        }
      }
    } catch {
      // replies table might not exist yet
    }

    const messages = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      company: r.company || '',
      message: r.message,
      read: Boolean(r.is_read),
      replied: Boolean(r.replied),
      replyText: r.reply_text || undefined,
      repliedAt: r.replied_at ? new Date(r.replied_at).toISOString() : undefined,
      archived: Boolean(r.is_archived),
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      replies: repliesMap.get(r.id) || [],
    }));

    return filterMessages(messages, filters);
  } catch (err: any) {
    console.warn('MySQL query failed in getAllMessages, using fallback store:', err.message);
    return filterMessages(memoryMessages, filters);
  }
}

function filterMessages(
  messages: ContactMessage[],
  filters?: { status?: 'all' | 'unread' | 'read' | 'replied' | 'archived'; search?: string }
): ContactMessage[] {
  let result = [...messages];

  if (filters?.status) {
    switch (filters.status) {
      case 'unread':
        result = result.filter(m => !m.read && !m.archived);
        break;
      case 'read':
        result = result.filter(m => m.read && !m.archived);
        break;
      case 'replied':
        result = result.filter(m => m.replied && !m.archived);
        break;
      case 'archived':
        result = result.filter(m => m.archived);
        break;
      case 'all':
      default:
        result = result.filter(m => !m.archived);
        break;
    }
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        (m.company && m.company.toLowerCase().includes(q))
    );
  }

  return result;
}

export async function getMessageById(id: string): Promise<ContactMessage | null> {
  try {
    const rows: any = await query('SELECT * FROM `contact_messages` WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return memoryMessages.find(m => m.id === id) || null;
    }
    const r = rows[0];
    const replies = await getMessageReplies(id);

    return {
      id: r.id,
      name: r.name,
      email: r.email,
      subject: r.subject,
      company: r.company || '',
      message: r.message,
      read: Boolean(r.is_read),
      replied: Boolean(r.replied),
      replyText: r.reply_text || undefined,
      repliedAt: r.replied_at ? new Date(r.replied_at).toISOString() : undefined,
      archived: Boolean(r.is_archived),
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      replies,
    };
  } catch {
    return memoryMessages.find(m => m.id === id) || null;
  }
}

export async function markAsRead(id: string, isRead: boolean = true): Promise<void> {
  try {
    await query('UPDATE `contact_messages` SET is_read = ? WHERE id = ?', [isRead ? 1 : 0, id]);
  } catch {
    // fallback
  }

  const mem = memoryMessages.find(m => m.id === id);
  if (mem) {
    mem.read = isRead;
  }
}

export async function archiveMessage(id: string, isArchived: boolean = true): Promise<void> {
  try {
    await query('UPDATE `contact_messages` SET is_archived = ? WHERE id = ?', [isArchived ? 1 : 0, id]);
  } catch {
    // fallback
  }

  const mem = memoryMessages.find(m => m.id === id);
  if (mem) {
    mem.archived = isArchived;
  }
}

export async function getMessageReplies(messageId: string): Promise<ContactReply[]> {
  try {
    const rows: any = await query(
      'SELECT * FROM `contact_replies` WHERE message_id = ? ORDER BY created_at ASC',
      [messageId]
    );
    if (Array.isArray(rows)) {
      return rows.map((r: any) => ({
        id: r.id,
        messageId: r.message_id,
        recipientEmail: r.recipient_email,
        senderEmail: r.sender_email,
        subject: r.subject,
        replyContent: r.reply_content,
        providerMessageId: r.provider_message_id || undefined,
        status: r.status,
        errorDetails: r.error_details || undefined,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    }
  } catch {
    // fallback
  }
  return memoryReplies.filter(r => r.messageId === messageId);
}

/**
 * Transmits a real email reply to the contact sender and records the reply permanently.
 */
export async function replyMessage(
  id: string,
  replyText: string,
  senderEmail?: string,
  senderName: string = 'Sagar Singh'
): Promise<{
  message: ContactMessage;
  reply: ContactReply;
  emailSent: boolean;
  emailError?: string;
}> {
  const msg = await getMessageById(id);
  if (!msg) {
    throw new Error('Message not found.');
  }

  const replyId = `rep-${Date.now()}`;
  const now = new Date().toISOString();
  const activeSenderEmail = senderEmail || process.env.SMTP_USER || 'sirroshan999@gmail.com';

  let emailSent = false;
  let providerMessageId: string | undefined;
  let emailError: string | undefined;

  try {
    const sendResult = await sendContactReplyEmail({
      to: msg.email,
      recipientName: msg.name,
      originalSubject: msg.subject,
      originalMessage: msg.message,
      replyContent: replyText,
      senderName,
      senderEmail: activeSenderEmail,
    });

    if (sendResult.success) {
      emailSent = true;
      providerMessageId = sendResult.messageId;
    } else {
      emailSent = false;
      emailError = sendResult.error;
    }
  } catch (err: any) {
    emailSent = false;
    emailError = err.message || 'SMTP transmission failed';
  }

  const newReply: ContactReply = {
    id: replyId,
    messageId: id,
    recipientEmail: msg.email,
    senderEmail: activeSenderEmail,
    subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
    replyContent: replyText,
    providerMessageId,
    status: emailSent ? 'sent' : 'failed',
    errorDetails: emailError,
    createdAt: now,
  };

  try {
    await query(`
      INSERT INTO \`contact_replies\` (
        id, message_id, recipient_email, sender_email, subject, reply_content, provider_message_id, status, error_details, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      newReply.id,
      newReply.messageId,
      newReply.recipientEmail,
      newReply.senderEmail,
      newReply.subject,
      newReply.replyContent,
      newReply.providerMessageId || null,
      newReply.status,
      newReply.errorDetails || null,
    ]);
  } catch (dbErr: any) {
    console.warn('Could not insert into contact_replies in MySQL:', dbErr.message);
  }
  memoryReplies.push(newReply);

  try {
    await query(`
      UPDATE \`contact_messages\` SET
        is_read = 1,
        replied = 1,
        reply_text = ?,
        replied_at = NOW()
      WHERE id = ?
    `, [replyText, id]);
  } catch (dbErr: any) {
    console.warn('Could not update contact_messages in MySQL:', dbErr.message);
  }

  const mem = memoryMessages.find(m => m.id === id);
  if (mem) {
    mem.read = true;
    mem.replied = true;
    mem.replyText = replyText;
    mem.repliedAt = now;
    if (!mem.replies) mem.replies = [];
    mem.replies.push(newReply);
  }

  const updatedMsg = (await getMessageById(id)) || {
    ...msg,
    read: true,
    replied: true,
    replyText,
    repliedAt: now,
    replies: [...(msg.replies || []), newReply],
  };

  return {
    message: updatedMsg,
    reply: newReply,
    emailSent,
    emailError,
  };
}

export async function deleteMessage(id: string): Promise<void> {
  try {
    await query('DELETE FROM `contact_replies` WHERE message_id = ?', [id]);
    await query('DELETE FROM `contact_messages` WHERE id = ?', [id]);
  } catch {
    // fallback
  }

  const idx = memoryMessages.findIndex(m => m.id === id);
  if (idx !== -1) {
    memoryMessages.splice(idx, 1);
  }
}

// Newsletter Subscribers
export async function addSubscriber(email: string): Promise<{ id: string; email: string; date: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const id = `sub-${Date.now()}`;
  const now = new Date().toISOString();

  try {
    await query(`
      INSERT INTO \`newsletter_subscribers\` (id, email, is_active)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE is_active = 1
    `, [id, cleanEmail]);
  } catch {
    // fallback
  }

  return { id, email: cleanEmail, date: now };
}

export async function getAllSubscribers(): Promise<{ id: string; email: string; date: string }[]> {
  try {
    const rows: any = await query(`
      SELECT id, email, subscribed_at AS date
      FROM \`newsletter_subscribers\`
      WHERE is_active = 1
      ORDER BY subscribed_at DESC
    `);

    return rows.map((r: any) => ({
      id: r.id,
      email: r.email,
      date: r.date ? new Date(r.date).toISOString().split('T')[0] : '',
    }));
  } catch {
    return [
      { id: 'sub-1', email: 'techlead@enterprise.com', date: '2026-11-01' },
      { id: 'sub-2', email: 'recruiter@talentforward.ai', date: '2026-11-04' },
    ];
  }
}

export async function deleteSubscriber(id: string): Promise<void> {
  try {
    await query('DELETE FROM `newsletter_subscribers` WHERE id = ?', [id]);
  } catch {
    // fallback
  }
}
