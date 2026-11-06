import { query } from '../connection';
import { verifyPassword, generateAdminToken, verifyAdminToken, hashPassword } from '../auth';

export async function authenticateAdmin(email: string, passcode: string): Promise<{
  success: boolean;
  token?: string;
  user?: { id: string; email: string; role: string };
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPasscode = passcode.trim();

  // Find admin user in MySQL database
  const rows: any = await query('SELECT id, email, password_hash, password_salt, role FROM `admin_users` WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);

  if (!rows || rows.length === 0) {
    return { success: false, error: 'Invalid administrator credentials. Access restricted.' };
  }

  const user = rows[0];
  const isValid = verifyPassword(cleanPasscode, user.password_salt, user.password_hash);

  if (!isValid) {
    return { success: false, error: 'Invalid administrator credentials. Access restricted.' };
  }

  // Update last login timestamp in database
  await query('UPDATE `admin_users` SET last_login = NOW() WHERE id = ?', [user.id]);

  const token = generateAdminToken({
    userId: user.id,
    email: user.email,
    role: user.role || 'SuperAdmin',
  }, 2); // Secure 2-hour token lifetime

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role || 'SuperAdmin',
    },
  };
}

export async function getDatabaseAnalytics(): Promise<any> {
  const getCount = async (table: string): Promise<number> => {
    try {
      const rows: any = await query(`SELECT COUNT(*) AS total FROM \`${table}\``);
      return Number(rows?.[0]?.total || 0);
    } catch {
      return 0;
    }
  };

  const [
    profileCount,
    projectsCount,
    technologiesCount,
    skillsCount,
    educationCount,
    achievementsCount,
    certificationsCount,
    messagesCount,
    unreadCount,
    subscribersCount,
  ] = await Promise.all([
    getCount('portfolio_profile'),
    getCount('projects'),
    getCount('technologies'),
    getCount('skills'),
    getCount('education'),
    getCount('achievements'),
    getCount('certifications'),
    getCount('contact_messages'),
    (async () => {
      try {
        const rows: any = await query('SELECT COUNT(*) AS total FROM `contact_messages` WHERE is_read = 0');
        return Number(rows?.[0]?.total || 0);
      } catch {
        return 0;
      }
    })(),
    getCount('newsletter_subscribers'),
  ]);

  return {
    profileCount,
    projectsCount,
    technologiesCount,
    skillsCount,
    educationCount,
    achievementsCount: achievementsCount + certificationsCount,
    messagesCount,
    unreadCount,
    subscribersCount,
  };
}

