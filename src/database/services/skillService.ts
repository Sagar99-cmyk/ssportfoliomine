import fs from 'fs';
import path from 'path';
import { query } from '../connection';
import type { Skill } from '../../types';

function processIconUrl(url: string | null | undefined, name: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:')) {
    try {
      const match = trimmed.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) {
        const mime = match[1];
        let ext = 'png';
        if (mime.includes('svg')) ext = 'svg';
        else if (mime.includes('webp')) ext = 'webp';
        else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const safeName = (name || 'skill').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) || 'skill';
        const fileName = `skill-${Date.now()}-${safeName}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        return `/uploads/${fileName}`;
      }
    } catch (e) {
      console.warn('Failed to save base64 skill icon to disk, storing directly:', e);
    }
  }
  return trimmed;
}

function parseJsonField<T>(field: any, defaultValue: T): T {
  if (field === null || field === undefined) return defaultValue;
  if (typeof field === 'object') return field as T;
  try {
    return JSON.parse(field) as T;
  } catch {
    return defaultValue;
  }
}

export async function getAllSkills(): Promise<Skill[]> {
  const rows: any = await query(`
    SELECT s.*, COUNT(ps.project_id) AS computed_projects_count
    FROM \`skills\` s
    LEFT JOIN \`project_skills\` ps ON s.id = ps.skill_id
    GROUP BY s.id
    ORDER BY CASE WHEN s.display_order > 0 THEN s.display_order ELSE 9999 END ASC, s.name ASC
  `);

  const seenNames = new Set<string>();
  const uniqueSkills: Skill[] = [];

  for (const r of rows) {
    const rawName = (r.name || '').trim();
    const normalizedKey = rawName.toLowerCase();
    if (!normalizedKey || seenNames.has(normalizedKey)) continue;
    seenNames.add(normalizedKey);

    uniqueSkills.push({
      id: r.id,
      name: rawName,
      category: r.category,
      proficiencyLevel: r.proficiency_level,
      iconUrl: r.icon_url || '',
      description: r.description || '',
      toolsUsed: parseJsonField(r.tools_used, []),
      projectsCount: Number(r.computed_projects_count !== undefined ? r.computed_projects_count : r.projects_count) || 0,
      featured: Boolean(r.featured),
    });
  }

  return uniqueSkills;
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const rows: any = await query(`
    SELECT s.*, COUNT(ps.project_id) AS computed_projects_count
    FROM \`skills\` s
    LEFT JOIN \`project_skills\` ps ON s.id = ps.skill_id
    WHERE s.id = ?
    GROUP BY s.id
  `, [id]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    proficiencyLevel: r.proficiency_level,
    iconUrl: r.icon_url || '',
    description: r.description || '',
    toolsUsed: parseJsonField(r.tools_used, []),
    projectsCount: Number(r.computed_projects_count !== undefined ? r.computed_projects_count : r.projects_count) || 0,
    featured: Boolean(r.featured),
  };
}

export async function createSkill(data: Partial<Skill>): Promise<Skill> {
  if (!data.name || !data.name.trim()) throw new Error('Skill name is required.');
  const name = data.name.trim();

  // Prevent duplicate skills in MySQL by matching lowercased name
  const existingRows: any = await query(
    'SELECT id FROM `skills` WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1',
    [name]
  );
  if (existingRows && existingRows.length > 0) {
    return updateSkill(existingRows[0].id, data);
  }

  const id = data.id || `skill-${Date.now()}`;
  const category = data.category || 'Data Analytics';
  const proficiencyLevel = data.proficiencyLevel || 'Intermediate';
  const iconUrl = processIconUrl(data.iconUrl, name) || '';
  const description = data.description || '';
  const toolsUsed = JSON.stringify(data.toolsUsed || []);
  const projectsCount = data.projectsCount || 0;
  const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : 1;
  const maxOrderRows: any = await query('SELECT COALESCE(MAX(display_order), 0) AS max_order FROM `skills`');
  const nextOrder = (maxOrderRows?.[0]?.max_order || 0) + 1;

  await query(`
    INSERT INTO \`skills\` (
      id, name, category, proficiency_level, icon_url, description, tools_used, projects_count, featured, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, name, category, proficiencyLevel, iconUrl, description, toolsUsed, projectsCount, featured, nextOrder]);

  return {
    id,
    name,
    category: category as any,
    proficiencyLevel: proficiencyLevel as any,
    iconUrl,
    description,
    toolsUsed: data.toolsUsed || [],
    projectsCount,
    featured: Boolean(featured),
  };
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
  const existing = await getSkillById(id);
  if (!existing) throw new Error(`Skill with id '${id}' not found in database.`);

  const name = data.name !== undefined ? data.name.trim() : existing.name;
  const category = data.category !== undefined ? data.category : existing.category;
  const proficiencyLevel = data.proficiencyLevel !== undefined ? data.proficiencyLevel : existing.proficiencyLevel;
  const rawIcon = data.iconUrl !== undefined ? data.iconUrl : (existing.iconUrl || '');
  const iconUrl = processIconUrl(rawIcon, name) || '';
  const description = data.description !== undefined ? data.description : existing.description;
  const toolsUsed = data.toolsUsed !== undefined ? JSON.stringify(data.toolsUsed) : JSON.stringify(existing.toolsUsed);
  const projectsCount = data.projectsCount !== undefined ? data.projectsCount : existing.projectsCount;
  const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : (existing.featured ? 1 : 0);

  await query(`
    UPDATE \`skills\` SET
      name = ?,
      category = ?,
      proficiency_level = ?,
      icon_url = ?,
      description = ?,
      tools_used = ?,
      projects_count = ?,
      featured = ?
    WHERE id = ?
  `, [name, category, proficiencyLevel, iconUrl, description, toolsUsed, projectsCount, featured, id]);

  const updated = await getSkillById(id);
  if (!updated) throw new Error('Failed to retrieve updated skill.');
  return updated;
}

export async function deleteSkill(id: string): Promise<void> {
  await query('DELETE FROM `skills` WHERE id = ?', [id]);
}

export async function reorderSkills(skillIds: string[]): Promise<Skill[]> {
  for (let i = 0; i < skillIds.length; i++) {
    await query('UPDATE `skills` SET display_order = ? WHERE id = ?', [i + 1, skillIds[i]]);
  }
  return getAllSkills();
}

