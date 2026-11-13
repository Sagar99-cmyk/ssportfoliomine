import fs from 'fs';
import path from 'path';
import { query, withTransaction } from '../connection';
import { ensureTechnologyId } from './technologyService';
import type { Project, CaseStudy } from '../types';

function processThumbnailUrl(url: string | null | undefined, title: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:')) {
    try {
      const match = trimmed.match(/^data:([^;]+);base64,(.+)$/s);
      if (match) {
        const mime = match[1];
        let ext = 'png';
        if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
        else if (mime.includes('webp')) ext = 'webp';
        else if (mime.includes('svg')) ext = 'svg';
        else if (mime.includes('gif')) ext = 'gif';
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const safeTitle = (title || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) || 'project';
        const fileName = `project-${Date.now()}-${safeTitle}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
      }
    } catch (e) {
      // Local caching failure is non-fatal
    }
    // Store data URL directly in MySQL (LONGTEXT) so images are permanently preserved and never lost across restarts
    return trimmed;
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

let isYoutubeColumnEnsured = false;
async function ensureYoutubeColumn() {
  if (isYoutubeColumnEnsured) return;
  try {
    await query("ALTER TABLE `projects` ADD COLUMN `youtube_url` TEXT DEFAULT NULL AFTER `linkedin_url`");
  } catch {
    // Column already exists or table not ready
  }
  isYoutubeColumnEnsured = true;
}

export async function getAllProjects(): Promise<Project[]> {
  await ensureYoutubeColumn();
  const projectsRows: any = await query(`
    SELECT 
      p.id,
      p.title,
      p.project_type AS projectType,
      p.category,
      p.difficulty,
      p.short_description AS shortDescription,
      p.thumbnail_url AS thumbnailUrl,
      p.github_url AS githubUrl,
      p.live_demo_url AS liveDemoUrl,
      p.linkedin_url AS linkedinUrl,
      p.youtube_url AS youtubeUrl,
      p.featured,
      p.display_order AS displayOrder,
      p.date_created AS dateCreated
    FROM projects p
    ORDER BY p.featured DESC, p.display_order ASC, p.date_created DESC
  `);

  if (projectsRows.length === 0) return [];

  // Fetch all technologies mapped to all projects in one optimized query
  const techMapRows: any = await query(`
    SELECT pt.project_id, t.name AS tech_name
    FROM project_technologies pt
    JOIN technologies t ON pt.technology_id = t.id
  `);

  const techMap = new Map<string, string[]>();
  for (const row of techMapRows) {
    if (!techMap.has(row.project_id)) {
      techMap.set(row.project_id, []);
    }
    techMap.get(row.project_id)!.push(row.tech_name);
  }

  // Fetch all skills mapped to all projects via project_skills foreign key junction
  const skillMapRows: any = await query(`
    SELECT ps.project_id, s.name AS skill_name
    FROM project_skills ps
    JOIN skills s ON ps.skill_id = s.id
  `);

  const skillMap = new Map<string, string[]>();
  for (const row of skillMapRows) {
    if (!skillMap.has(row.project_id)) {
      skillMap.set(row.project_id, []);
    }
    skillMap.get(row.project_id)!.push(row.skill_name);
  }

  // Fetch all case studies
  const caseStudyRows: any = await query('SELECT * FROM `project_case_studies`');
  const caseStudyMap = new Map<string, CaseStudy>();

  for (const cs of caseStudyRows) {
    caseStudyMap.set(cs.project_id, {
      overview: cs.overview || '',
      businessProblem: cs.business_problem || '',
      datasetInfo: cs.dataset_info || '',
      dataCleaningPrep: cs.data_cleaning_prep || '',
      methodology: cs.methodology || '',
      codeSnippets: parseJsonField(cs.code_snippets, []),
      keyFindings: parseJsonField(cs.key_findings, []),
      recommendations: parseJsonField(cs.recommendations, []),
      limitations: cs.limitations || '',
      dashboardFeatures: parseJsonField(cs.dashboard_features, []),
    });
  }

  return projectsRows.map((p: any) => ({
    id: p.id,
    title: p.title,
    projectType: p.projectType,
    category: p.category,
    difficulty: p.difficulty,
    shortDescription: p.shortDescription,
    thumbnailUrl: p.thumbnailUrl || '',
    githubUrl: p.githubUrl || undefined,
    liveDemoUrl: p.liveDemoUrl || undefined,
    linkedinUrl: p.linkedinUrl || undefined,
    youtubeUrl: p.youtubeUrl || undefined,
    featured: Boolean(p.featured),
    technologies: techMap.get(p.id) || [],
    skills: skillMap.get(p.id) || [],
    dateCreated: p.dateCreated ? new Date(p.dateCreated).toISOString().split('T')[0] : '',
    caseStudy: caseStudyMap.get(p.id) || {
      overview: p.shortDescription,
      businessProblem: '',
      datasetInfo: '',
      dataCleaningPrep: '',
      methodology: '',
      keyFindings: [],
      recommendations: [],
      limitations: '',
    },
  }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const rows: any = await query('SELECT * FROM `projects` WHERE id = ?', [id]);
  if (!rows || rows.length === 0) return null;
  const p = rows[0];

  const techRows: any = await query(`
    SELECT t.name 
    FROM project_technologies pt
    JOIN technologies t ON pt.technology_id = t.id
    WHERE pt.project_id = ?
  `, [id]);
  const technologies = techRows.map((t: any) => t.name);

  const skillRows: any = await query(`
    SELECT s.name 
    FROM project_skills ps
    JOIN skills s ON ps.skill_id = s.id
    WHERE ps.project_id = ?
  `, [id]);
  const skills = skillRows.map((s: any) => s.name);

  const csRows: any = await query('SELECT * FROM `project_case_studies` WHERE project_id = ?', [id]);
  let caseStudy: CaseStudy = {
    overview: p.short_description,
    businessProblem: '',
    datasetInfo: '',
    dataCleaningPrep: '',
    methodology: '',
    keyFindings: [],
    recommendations: [],
    limitations: '',
  };

  if (csRows && csRows.length > 0) {
    const cs = csRows[0];
    caseStudy = {
      overview: cs.overview || '',
      businessProblem: cs.business_problem || '',
      datasetInfo: cs.dataset_info || '',
      dataCleaningPrep: cs.data_cleaning_prep || '',
      methodology: cs.methodology || '',
      codeSnippets: parseJsonField(cs.code_snippets, []),
      keyFindings: parseJsonField(cs.key_findings, []),
      recommendations: parseJsonField(cs.recommendations, []),
      limitations: cs.limitations || '',
      dashboardFeatures: parseJsonField(cs.dashboard_features, []),
    };
  }

  return {
    id: p.id,
    title: p.title,
    projectType: p.project_type,
    category: p.category,
    difficulty: p.difficulty,
    shortDescription: p.short_description,
    thumbnailUrl: p.thumbnail_url || '',
    githubUrl: p.github_url || undefined,
    liveDemoUrl: p.live_demo_url || undefined,
    linkedinUrl: p.linkedin_url || undefined,
    youtubeUrl: p.youtube_url || undefined,
    featured: Boolean(p.featured),
    technologies,
    skills,
    dateCreated: p.date_created ? new Date(p.date_created).toISOString().split('T')[0] : '',
    caseStudy,
  };
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  if (!data.title || !data.title.trim()) throw new Error('Project title is required.');
  const id = data.id || `proj-${Date.now()}`;
  const title = data.title.trim();
  const projectType = data.projectType || 'Major Project';
  const category = data.category || 'Data Analytics';
  const difficulty = data.difficulty || 'Intermediate';
  const shortDescription = data.shortDescription || '';
  const thumbnailUrl = processThumbnailUrl(data.thumbnailUrl, title);
  const githubUrl = data.githubUrl || null;
  const liveDemoUrl = data.liveDemoUrl || null;
  const linkedinUrl = data.linkedinUrl || null;
  const youtubeUrl = data.youtubeUrl || null;
  const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : 0;
  const dateCreated = data.dateCreated || new Date().toISOString().split('T')[0];
  const techList = data.technologies || [];

  return await withTransaction(async (conn) => {
    // 1. Insert Project record
    await conn.execute(`
      INSERT INTO \`projects\` (
        id, title, project_type, category, difficulty, short_description,
        thumbnail_url, github_url, live_demo_url, linkedin_url, youtube_url, featured, date_created
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, title, projectType, category, difficulty, shortDescription,
      thumbnailUrl, githubUrl, liveDemoUrl, linkedinUrl, youtubeUrl, featured, dateCreated,
    ]);

    // 2. Link technologies via junction table
    for (const techName of techList) {
      if (!techName || !techName.trim()) continue;
      const techId = await ensureTechnologyId(techName, conn);
      await conn.execute(`
        INSERT INTO \`project_technologies\` (project_id, technology_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE project_id = project_id
      `, [id, techId]);
    }

    // 2b. Link skills via project_skills foreign key junction
    const skillList = data.skills || [];
    for (const skillNameOrId of skillList) {
      if (!skillNameOrId || !skillNameOrId.trim()) continue;
      const [sRows]: any = await conn.execute(
        'SELECT id FROM `skills` WHERE id = ? OR name = ? LIMIT 1',
        [skillNameOrId, skillNameOrId]
      );
      if (sRows && sRows.length > 0) {
        const sId = sRows[0].id;
        await conn.execute(`
          INSERT INTO \`project_skills\` (project_id, skill_id)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE project_id = project_id
        `, [id, sId]);
      }
    }

    // Refresh projects_count in skills
    await conn.execute(`
      UPDATE skills s
      SET projects_count = (
        SELECT COUNT(*) FROM project_skills ps WHERE ps.skill_id = s.id
      )
    `);

    // 3. Insert Case Study if provided
    if (data.caseStudy) {
      const cs = data.caseStudy;
      await conn.execute(`
        INSERT INTO \`project_case_studies\` (
          project_id, overview, business_problem, dataset_info, data_cleaning_prep,
          methodology, code_snippets, key_findings, recommendations, limitations, dashboard_features
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        cs.overview || null,
        cs.businessProblem || null,
        cs.datasetInfo || null,
        cs.dataCleaningPrep || null,
        cs.methodology || null,
        cs.codeSnippets ? JSON.stringify(cs.codeSnippets) : null,
        cs.keyFindings ? JSON.stringify(cs.keyFindings) : null,
        cs.recommendations ? JSON.stringify(cs.recommendations) : null,
        cs.limitations || null,
        cs.dashboardFeatures ? JSON.stringify(cs.dashboardFeatures) : null,
      ]);
    }

    return {
      id,
      title,
      projectType,
      category,
      difficulty: difficulty as any,
      shortDescription,
      thumbnailUrl: thumbnailUrl || '',
      githubUrl: githubUrl || undefined,
      liveDemoUrl: liveDemoUrl || undefined,
      linkedinUrl: linkedinUrl || undefined,
      youtubeUrl: youtubeUrl || undefined,
      featured: Boolean(featured),
      technologies: techList,
      dateCreated,
      caseStudy: data.caseStudy || {
        overview: shortDescription,
        businessProblem: '',
        datasetInfo: '',
        dataCleaningPrep: '',
        methodology: '',
        keyFindings: [],
        recommendations: [],
        limitations: '',
      },
    };
  });
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const existing = await getProjectById(id);
  if (!existing) throw new Error(`Project with id '${id}' not found in database.`);

  const title = data.title !== undefined ? data.title.trim() : existing.title;
  const projectType = data.projectType !== undefined ? data.projectType : existing.projectType;
  const category = data.category !== undefined ? data.category : existing.category;
  const difficulty = data.difficulty !== undefined ? data.difficulty : existing.difficulty;
  const shortDescription = data.shortDescription !== undefined ? data.shortDescription : existing.shortDescription;
  const rawThumbnail = data.thumbnailUrl !== undefined ? data.thumbnailUrl : existing.thumbnailUrl;
  const thumbnailUrl = processThumbnailUrl(rawThumbnail, title);
  const githubUrl = data.githubUrl !== undefined ? data.githubUrl : existing.githubUrl;
  const liveDemoUrl = data.liveDemoUrl !== undefined ? data.liveDemoUrl : existing.liveDemoUrl;
  const linkedinUrl = data.linkedinUrl !== undefined ? data.linkedinUrl : existing.linkedinUrl;
  const youtubeUrl = data.youtubeUrl !== undefined ? data.youtubeUrl : existing.youtubeUrl;
  const featured = data.featured !== undefined ? (data.featured ? 1 : 0) : (existing.featured ? 1 : 0);
  const dateCreated = data.dateCreated !== undefined ? data.dateCreated : existing.dateCreated;

  return await withTransaction(async (conn) => {
    // 1. Update Project record
    await (conn as any).execute(`
      UPDATE \`projects\` SET
        title = ?,
        project_type = ?,
        category = ?,
        difficulty = ?,
        short_description = ?,
        thumbnail_url = ?,
        github_url = ?,
        live_demo_url = ?,
        linkedin_url = ?,
        youtube_url = ?,
        featured = ?,
        date_created = ?
      WHERE id = ?
    `, [
      title, projectType, category, difficulty, shortDescription,
      thumbnailUrl || null, githubUrl || null, liveDemoUrl || null, linkedinUrl || null,
      youtubeUrl || null, featured, dateCreated, id,
    ]);

    // 2. Synchronize technologies if passed
    if (data.technologies !== undefined) {
      await conn.execute('DELETE FROM `project_technologies` WHERE project_id = ?', [id]);
      for (const techName of data.technologies) {
        if (!techName || !techName.trim()) continue;
        const techId = await ensureTechnologyId(techName, conn);
        await conn.execute(`
          INSERT INTO \`project_technologies\` (project_id, technology_id)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE project_id = project_id
        `, [id, techId]);
      }
    }

    // 2b. Synchronize skills if passed via project_skills foreign key junction
    if (data.skills !== undefined) {
      await conn.execute('DELETE FROM `project_skills` WHERE project_id = ?', [id]);
      for (const skillNameOrId of data.skills) {
        if (!skillNameOrId || !skillNameOrId.trim()) continue;
        const [sRows]: any = await conn.execute(
          'SELECT id FROM `skills` WHERE id = ? OR name = ? LIMIT 1',
          [skillNameOrId, skillNameOrId]
        );
        if (sRows && sRows.length > 0) {
          const sId = sRows[0].id;
          await conn.execute(`
            INSERT INTO \`project_skills\` (project_id, skill_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE project_id = project_id
          `, [id, sId]);
        }
      }
    }

    // Refresh projects_count in skills
    await conn.execute(`
      UPDATE skills s
      SET projects_count = (
        SELECT COUNT(*) FROM project_skills ps WHERE ps.skill_id = s.id
      )
    `);

    // 3. Upsert Case Study if passed
    if (data.caseStudy !== undefined) {
      const cs = data.caseStudy;
      await conn.execute(`
        INSERT INTO \`project_case_studies\` (
          project_id, overview, business_problem, dataset_info, data_cleaning_prep,
          methodology, code_snippets, key_findings, recommendations, limitations, dashboard_features
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          overview = VALUES(overview),
          business_problem = VALUES(business_problem),
          dataset_info = VALUES(dataset_info),
          data_cleaning_prep = VALUES(data_cleaning_prep),
          methodology = VALUES(methodology),
          code_snippets = VALUES(code_snippets),
          key_findings = VALUES(key_findings),
          recommendations = VALUES(recommendations),
          limitations = VALUES(limitations),
          dashboard_features = VALUES(dashboard_features)
      `, [
        id,
        cs.overview || null,
        cs.businessProblem || null,
        cs.datasetInfo || null,
        cs.dataCleaningPrep || null,
        cs.methodology || null,
        cs.codeSnippets ? JSON.stringify(cs.codeSnippets) : null,
        cs.keyFindings ? JSON.stringify(cs.keyFindings) : null,
        cs.recommendations ? JSON.stringify(cs.recommendations) : null,
        cs.limitations || null,
        cs.dashboardFeatures ? JSON.stringify(cs.dashboardFeatures) : null,
      ]);
    }

    const updated = await getProjectById(id);
    if (!updated) throw new Error('Failed to retrieve updated project.');
    return updated;
  });
}

export async function deleteProject(id: string): Promise<void> {
  // Cascading foreign keys will clean up project_skills, project_technologies and project_case_studies automatically
  await query('DELETE FROM `projects` WHERE id = ?', [id]);
  // Refresh projects_count in skills
  await query(`
    UPDATE skills s
    SET projects_count = (
      SELECT COUNT(*) FROM project_skills ps WHERE ps.skill_id = s.id
    )
  `);
}

