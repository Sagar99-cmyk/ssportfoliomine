import { query, withTransaction } from '../connection';
import type { Education } from '../../types';

export async function getAllEducation(): Promise<Education[]> {
  const eduRows: any = await query(`
    SELECT * FROM \`education\`
    ORDER BY hierarchy_level ASC, display_order ASC
  `);

  if (eduRows.length === 0) return [];

  const hlRows: any = await query(`
    SELECT education_id, highlight_text
    FROM \`education_highlights\`
    ORDER BY display_order ASC
  `);

  const hlMap = new Map<string, string[]>();
  for (const hl of hlRows) {
    if (!hlMap.has(hl.education_id)) {
      hlMap.set(hl.education_id, []);
    }
    hlMap.get(hl.education_id)!.push(hl.highlight_text);
  }

  return eduRows.map((e: any) => ({
    id: e.id,
    degree: e.degree,
    institution: e.institution,
    location: e.location || '',
    period: e.period,
    gradeGpa: e.grade_gpa || '',
    description: e.description || '',
    highlights: hlMap.get(e.id) || [],
    level: e.hierarchy_level === 1 ? 'Undergraduate' : e.hierarchy_level === 2 ? 'Higher Secondary' : 'Secondary',
    order: e.display_order,
  }));
}

export async function getEducationById(id: string): Promise<Education | null> {
  const rows: any = await query('SELECT * FROM `education` WHERE id = ?', [id]);
  if (!rows || rows.length === 0) return null;
  const e = rows[0];

  const hlRows: any = await query(`
    SELECT highlight_text
    FROM \`education_highlights\`
    WHERE education_id = ?
    ORDER BY display_order ASC
  `, [id]);

  return {
    id: e.id,
    degree: e.degree,
    institution: e.institution,
    location: e.location || '',
    period: e.period,
    gradeGpa: e.grade_gpa || '',
    description: e.description || '',
    highlights: hlRows.map((h: any) => h.highlight_text),
    level: e.hierarchy_level === 1 ? 'Undergraduate' : e.hierarchy_level === 2 ? 'Higher Secondary' : 'Secondary',
  };
}

export async function createEducation(data: Partial<Education>): Promise<Education> {
  if (!data.degree || !data.degree.trim()) throw new Error('Degree name is required.');
  const id = data.id || `edu-${Date.now()}`;
  const degree = data.degree.trim();
  const institution = data.institution || '';
  const location = data.location || '';
  const period = data.period || '';
  const gradeGpa = data.gradeGpa || '';
  const description = data.description || '';
  const highlights = data.highlights || [];
  const hierarchyLevel = data.level === 'Undergraduate' ? 1 : data.level === 'Higher Secondary' ? 2 : 3;

  return await withTransaction(async (conn) => {
    await conn.execute(`
      INSERT INTO \`education\` (
        id, degree, institution, location, period, grade_gpa, description, hierarchy_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, degree, institution, location, period, gradeGpa, description, hierarchyLevel]);

    for (let i = 0; i < highlights.length; i++) {
      await conn.execute(`
        INSERT INTO \`education_highlights\` (education_id, highlight_text, display_order)
        VALUES (?, ?, ?)
      `, [id, highlights[i], i + 1]);
    }

    return {
      id,
      degree,
      institution,
      location,
      period,
      gradeGpa,
      description,
      highlights,
      level: data.level || 'Undergraduate',
    };
  });
}

export async function updateEducation(id: string, data: Partial<Education>): Promise<Education> {
  const existing = await getEducationById(id);
  if (!existing) throw new Error(`Education with id '${id}' not found in database.`);

  const degree = data.degree !== undefined ? data.degree.trim() : existing.degree;
  const institution = data.institution !== undefined ? data.institution : existing.institution;
  const location = data.location !== undefined ? data.location : existing.location;
  const period = data.period !== undefined ? data.period : existing.period;
  const gradeGpa = data.gradeGpa !== undefined ? data.gradeGpa : existing.gradeGpa;
  const description = data.description !== undefined ? data.description : existing.description;
  const level = data.level !== undefined ? data.level : existing.level;
  const hierarchyLevel = level === 'Undergraduate' ? 1 : level === 'Higher Secondary' ? 2 : 3;

  return await withTransaction(async (conn) => {
    await conn.execute(`
      UPDATE \`education\` SET
        degree = ?,
        institution = ?,
        location = ?,
        period = ?,
        grade_gpa = ?,
        description = ?,
        hierarchy_level = ?
      WHERE id = ?
    `, [degree, institution, location, period, gradeGpa, description, hierarchyLevel, id]);

    if (data.highlights !== undefined) {
      await conn.execute('DELETE FROM `education_highlights` WHERE education_id = ?', [id]);
      for (let i = 0; i < data.highlights.length; i++) {
        await conn.execute(`
          INSERT INTO \`education_highlights\` (education_id, highlight_text, display_order)
          VALUES (?, ?, ?)
        `, [id, data.highlights[i], i + 1]);
      }
    }

    const updated = await getEducationById(id);
    if (!updated) throw new Error('Failed to retrieve updated education.');
    return updated;
  });
}

export async function deleteEducation(id: string): Promise<void> {
  await query('DELETE FROM `education` WHERE id = ?', [id]);
}

