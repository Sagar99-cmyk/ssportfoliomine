import { query } from '../connection';
import { verifyPassword, generateAdminToken, verifyAdminToken, hashPassword } from '../auth';
import { MASTER_ADMIN_CREDENTIALS } from '../fallbackData';

export async function authenticateAdmin(email: string, passcode: string): Promise<{
  success: boolean;
  token?: string;
  user?: { id: string; email: string; role: string };
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPasscode = passcode.trim();

  let rows: any = null;
  try {
    // Find admin user in MySQL database
    rows = await query('SELECT id, email, password_hash, password_salt, role FROM `admin_users` WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
  } catch (dbErr: any) {
    console.warn('⚠️ MySQL connection unavailable for admin authentication. Using secure master fallback:', dbErr.message);
  }

  // 1. If database returned user row, verify against MySQL record
  if (rows && rows.length > 0) {
    const user = rows[0];
    const isValid = verifyPassword(cleanPasscode, user.password_salt, user.password_hash);

    if (!isValid) {
      return { success: false, error: 'Invalid administrator credentials. Access restricted.' };
    }

    try {
      await query('UPDATE `admin_users` SET last_login = NOW() WHERE id = ?', [user.id]);
    } catch { /* non-fatal */ }

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

  // 2. Resilient Master Administrator Verification (handles offline DB / Cloud deployment)
  if (cleanEmail === MASTER_ADMIN_CREDENTIALS.email.toLowerCase()) {
    const isValid = verifyPassword(
      cleanPasscode,
      MASTER_ADMIN_CREDENTIALS.password_salt,
      MASTER_ADMIN_CREDENTIALS.password_hash
    );

    if (isValid) {
      const token = generateAdminToken({
        userId: 'admin-master',
        email: MASTER_ADMIN_CREDENTIALS.email,
        role: MASTER_ADMIN_CREDENTIALS.role,
      }, 2);

      return {
        success: true,
        token,
        user: {
          id: 'admin-master',
          email: MASTER_ADMIN_CREDENTIALS.email,
          role: MASTER_ADMIN_CREDENTIALS.role,
        },
      };
    }
  }

  return { success: false, error: 'Invalid administrator credentials. Access restricted.' };
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

