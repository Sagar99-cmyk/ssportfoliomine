import { query } from '../connection';
import type { Achievement } from '../types';

function parseJsonField<T>(field: any, defaultValue: T): T {
  if (field === null || field === undefined) return defaultValue;
  if (typeof field === 'object') return field as T;
  try {
    return JSON.parse(field) as T;
  } catch {
    return defaultValue;
  }
}

export async function getAllAchievements(): Promise<Achievement[]> {
  // Query both achievements and certifications tables to give full, unified list
  const achRows: any = await query(`
    SELECT * FROM \`achievements\`
    ORDER BY display_order ASC, created_at DESC
  `);

  const certRows: any = await query(`
    SELECT * FROM \`certifications\`
    ORDER BY display_order ASC, created_at DESC
  `);

  const mappedAchs: Achievement[] = achRows.map((r: any) => ({
    id: r.id,
    title: r.title,
    issuer: r.issuer,
    issueDate: r.issue_date,
    credentialUrl: r.credential_url || undefined,
    credentialId: r.credential_id || undefined,
    badgeUrl: r.badge_url || undefined,
    skills: parseJsonField(r.skills_tags, []),
  }));

  const mappedCerts: Achievement[] = certRows.map((r: any) => ({
    id: r.id,
    title: r.title,
    issuer: r.issuer,
    issueDate: r.issue_date,
    credentialUrl: r.credential_url || undefined,
    credentialId: r.credential_id || undefined,
    badgeUrl: r.badge_url || undefined,
    skills: parseJsonField(r.skills_covered, []),
  }));

  return [...mappedAchs, ...mappedCerts];
}

export async function getAchievementById(id: string): Promise<Achievement | null> {
  const rows: any = await query('SELECT * FROM `achievements` WHERE id = ?', [id]);
  if (rows && rows.length > 0) {
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      issueDate: r.issue_date,
      credentialUrl: r.credential_url || undefined,
      credentialId: r.credential_id || undefined,
      badgeUrl: r.badge_url || undefined,
      skills: parseJsonField(r.skills_tags, []),
    };
  }

  // Check certifications table
  const certRows: any = await query('SELECT * FROM `certifications` WHERE id = ?', [id]);
  if (certRows && certRows.length > 0) {
    const r = certRows[0];
    return {
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      issueDate: r.issue_date,
      credentialUrl: r.credential_url || undefined,
      credentialId: r.credential_id || undefined,
      badgeUrl: r.badge_url || undefined,
      skills: parseJsonField(r.skills_covered, []),
    };
  }

  return null;
}

export async function createAchievement(data: Partial<Achievement>): Promise<Achievement> {
  if (!data.title || !data.title.trim()) throw new Error('Achievement / Certification title is required.');
  const id = data.id || `ach-${Date.now()}`;
  const title = data.title.trim();
  const issuer = data.issuer || '';
  const issueDate = data.issueDate || '';
  const credentialUrl = data.credentialUrl || null;
  const credentialId = data.credentialId || null;
  const badgeUrl = data.badgeUrl || null;
  const skills = JSON.stringify(data.skills || []);

  await query(`
    INSERT INTO \`achievements\` (
      id, title, issuer, issue_date, credential_url, credential_id, badge_url, skills_tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, title, issuer, issueDate, credentialUrl, credentialId, badgeUrl, skills]);

  return {
    id,
    title,
    issuer,
    issueDate,
    credentialUrl: credentialUrl || undefined,
    credentialId: credentialId || undefined,
    badgeUrl: badgeUrl || undefined,
    skills: data.skills || [],
  };
}

export async function updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement> {
  const existing = await getAchievementById(id);
  if (!existing) throw new Error(`Achievement with id '${id}' not found in database.`);

  const title = data.title !== undefined ? data.title.trim() : existing.title;
  const issuer = data.issuer !== undefined ? data.issuer : existing.issuer;
  const issueDate = data.issueDate !== undefined ? data.issueDate : existing.issueDate;
  const credentialUrl = data.credentialUrl !== undefined ? data.credentialUrl : existing.credentialUrl;
  const credentialId = data.credentialId !== undefined ? data.credentialId : existing.credentialId;
  const badgeUrl = data.badgeUrl !== undefined ? data.badgeUrl : existing.badgeUrl;
  const skills = data.skills !== undefined ? JSON.stringify(data.skills) : JSON.stringify(existing.skills);

  // Check if in achievements table
  const achRows: any = await query('SELECT id FROM `achievements` WHERE id = ?', [id]);
  if (achRows && achRows.length > 0) {
    await query(`
      UPDATE \`achievements\` SET
        title = ?,
        issuer = ?,
        issue_date = ?,
        credential_url = ?,
        credential_id = ?,
        badge_url = ?,
        skills_tags = ?
      WHERE id = ?
    `, [title, issuer, issueDate, credentialUrl || null, credentialId || null, badgeUrl || null, skills, id]);
  } else {
    // In certifications table
    await query(`
      UPDATE \`certifications\` SET
        title = ?,
        issuer = ?,
        issue_date = ?,
        credential_url = ?,
        credential_id = ?,
        badge_url = ?,
        skills_covered = ?
      WHERE id = ?
    `, [title, issuer, issueDate, credentialUrl || null, credentialId || null, badgeUrl || null, skills, id]);
  }

  const updated = await getAchievementById(id);
  if (!updated) throw new Error('Failed to retrieve updated achievement.');
  return updated;
}

export async function deleteAchievement(id: string): Promise<void> {
  await query('DELETE FROM `achievements` WHERE id = ?', [id]);
  await query('DELETE FROM `certifications` WHERE id = ?', [id]);
}

