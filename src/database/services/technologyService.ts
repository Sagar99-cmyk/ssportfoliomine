import { query, withTransaction } from '../connection';

export interface TechnologyRecord {
  id: string;
  name: string;
  category: string;
  iconSlug?: string;
  description?: string;
  projectsCount?: number;
  createdAt?: string;
}

export async function getAllTechnologies(): Promise<TechnologyRecord[]> {
  const rows: any = await query(`
    SELECT 
      t.id, 
      t.name, 
      t.category, 
      t.icon_slug AS iconSlug, 
      t.description,
      t.created_at AS createdAt,
      COUNT(pt.project_id) AS projectsCount
    FROM technologies t
    LEFT JOIN project_technologies pt ON t.id = pt.technology_id
    GROUP BY t.id
    ORDER BY projectsCount DESC, t.name ASC
  `);

  return rows.map((r: any) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    iconSlug: r.iconSlug || undefined,
    description: r.description || undefined,
    projectsCount: Number(r.projectsCount) || 0,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
  }));
}

export async function getTechnologyById(id: string): Promise<TechnologyRecord | null> {
  const rows: any = await query('SELECT * FROM `technologies` WHERE id = ?', [id]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    iconSlug: r.icon_slug,
    description: r.description,
  };
}

export async function createTechnology(data: Partial<TechnologyRecord>): Promise<TechnologyRecord> {
  if (!data.name || !data.name.trim()) throw new Error('Technology name is required.');
  const id = data.id || `tech-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  const name = data.name.trim();
  const category = data.category || 'Other';
  const iconSlug = data.iconSlug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const description = data.description || '';

  await query(`
    INSERT INTO \`technologies\` (id, name, category, icon_slug, description)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      category = VALUES(category),
      icon_slug = VALUES(icon_slug),
      description = VALUES(description)
  `, [id, name, category, iconSlug, description]);

  return { id, name, category, iconSlug, description };
}

export async function updateTechnology(id: string, data: Partial<TechnologyRecord>): Promise<TechnologyRecord> {
  const existing = await getTechnologyById(id);
  if (!existing) throw new Error(`Technology with id '${id}' not found.`);

  const name = data.name !== undefined ? data.name.trim() : existing.name;
  const category = data.category !== undefined ? data.category : existing.category;
  const iconSlug = data.iconSlug !== undefined ? data.iconSlug : existing.iconSlug;
  const description = data.description !== undefined ? data.description : existing.description;

  await query(`
    UPDATE \`technologies\`
    SET name = ?, category = ?, icon_slug = ?, description = ?
    WHERE id = ?
  `, [name, category, iconSlug, description, id]);

  return { id, name, category, iconSlug, description };
}

export async function deleteTechnology(id: string): Promise<void> {
  await query('DELETE FROM `technologies` WHERE id = ?', [id]);
}

/**
 * Helper to ensure a technology exists and return its ID.
 */
export async function ensureTechnologyId(name: string, conn?: any): Promise<string> {
  const cleanName = name.trim();
  const runner = conn || { query: (q: string, p: any[]) => query(q, p) };

  const [existing]: any = await runner.query('SELECT id FROM `technologies` WHERE LOWER(name) = LOWER(?)', [cleanName]);
  if (existing && existing.length > 0) {
    return existing[0].id;
  }

  const newId = `tech-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  await runner.query(
    'INSERT INTO `technologies` (id, name, category, icon_slug) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id',
    [newId, cleanName, 'Analytics', cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')]
  );
  return newId;
}

