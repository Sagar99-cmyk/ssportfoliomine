import { query } from '../connection';
import type { Profile } from '../../types';

export async function getProfile(): Promise<Profile | null> {
  const rows: any = await query('SELECT * FROM `portfolio_profile` LIMIT 1');
  if (!rows || rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    name: row.full_name,
    designation: row.headline,
    tagline: row.intro,
    intro: row.intro,
    aboutBio: row.bio,
    avatarUrl: row.avatar_url,
    resumeUrl: row.resume_url,
    location: row.location,
    email: row.email,
    phone: row.phone,
    linkedinUrl: row.linkedin_url,
    githubUrl: row.github_url,
    kaggleUrl: row.kaggle_url || '',
    availabilityStatus: row.availability_status,
    isAvailable: Boolean(row.is_available),
    stats: {
      yearsExperience: Number(row.years_experience) || 1,
      dashboardsDelivered: Number(row.dashboards_delivered) || 6,
      rowsProcessed: row.rows_processed || '150K+',
      forecastAccuracy: row.forecast_accuracy || '98.5%',
    },
    aboutDetails: row.about_details
      ? (typeof row.about_details === 'object' ? row.about_details : JSON.parse(row.about_details))
      : undefined,
  };
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const current = await getProfile();
  if (!current) throw new Error('Profile record does not exist in database.');

  const merged: Profile = {
    ...current,
    ...data,
    stats: {
      ...current.stats,
      ...(data.stats || {}),
    },
    aboutDetails: data.aboutDetails !== undefined ? data.aboutDetails : current.aboutDetails,
  };

  const [firstName, ...rest] = (merged.name || 'Sagar Singh').split(' ');
  const lastName = rest.join(' ') || 'Singh';

  await query(`
    UPDATE \`portfolio_profile\` SET
      full_name = ?,
      first_name = ?,
      last_name = ?,
      headline = ?,
      intro = ?,
      bio = ?,
      location = ?,
      email = ?,
      phone = ?,
      avatar_url = ?,
      resume_url = ?,
      github_url = ?,
      linkedin_url = ?,
      kaggle_url = ?,
      is_available = ?,
      availability_status = ?,
      years_experience = ?,
      dashboards_delivered = ?,
      rows_processed = ?,
      forecast_accuracy = ?,
      about_details = ?
    WHERE id = ?
  `, [
    merged.name,
    firstName,
    lastName,
    merged.designation,
    merged.intro,
    merged.aboutBio,
    merged.location,
    merged.email,
    merged.phone,
    merged.avatarUrl,
    merged.resumeUrl,
    merged.githubUrl,
    merged.linkedinUrl,
    merged.kaggleUrl,
    merged.isAvailable ? 1 : 0,
    merged.availabilityStatus,
    String(merged.stats.yearsExperience),
    merged.stats.dashboardsDelivered,
    merged.stats.rowsProcessed,
    merged.stats.forecastAccuracy,
    merged.aboutDetails ? JSON.stringify(merged.aboutDetails) : null,
    current.id,
  ]);

  return merged;
}

