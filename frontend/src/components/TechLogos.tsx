import React from 'react';

interface TechLogoProps {
  className?: string;
}

// 1. HTML5 Logo
export const HtmlLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#E44D26" d="M107.6 447L64 0h384l-43.6 447-148.4 41z"/>
    <path fill="#F16529" d="M256 454.6l121.3-33.6 35.8-381H256v414.6z"/>
    <path fill="#EBEBEB" d="M256 195.6h-59.6l-4.1-46.7H256V103H138.8l12.4 138.6H256v-46zM256 312.4l-.5.1-48.7-13.1-3.1-34.9h-46.1l6.1 68.9 92.3 25.6v-46.6z"/>
    <path fill="#FFFFFF" d="M256 195.6h59.6l-5.6 62.9-54 14.6v46.6l92.3-25.6 9.3-104.7.9-10.4 4.5-50.4H256v46.6h109.8l-1.9 21.2H256v44.8z"/>
  </svg>
);

// 2. CSS3 Logo
export const CssLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#264DE4" d="M107.6 447L64 0h384l-43.6 447-148.4 41z"/>
    <path fill="#2965F1" d="M256 454.6l121.3-33.6 35.8-381H256v414.6z"/>
    <path fill="#EBEBEB" d="M256 195.6h-59.6l-4.1-46.7H256V103H138.8l12.4 138.6H256v-46zM256 312.4l-.5.1-48.7-13.1-3.1-34.9h-46.1l6.1 68.9 92.3 25.6v-46.6z"/>
    <path fill="#FFFFFF" d="M256 195.6h59.6l-5.6 62.9-54 14.6v46.6l92.3-25.6 9.3-104.7.9-10.4 4.5-50.4H256v46.6h109.8l-1.9 21.2H256v44.8z"/>
  </svg>
);

// 3. JavaScript Logo
export const JavaScriptLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="64" fill="#F7DF1E"/>
    <path fill="#000000" d="M213.8 387.6c7.7 13.5 18.2 24.5 35.8 24.5 17.5 0 28.5-8.8 28.5-43.8V232h47v136.7c0 57.6-33.8 83.3-80.4 83.3-35.8 0-56.1-18.7-67.4-41.5l36.5-22.9zM388 387.6c9.8 17.5 22.9 29.5 45.4 29.5 19.3 0 31.8-9.8 31.8-23.4 0-16.3-13-22.3-34.8-31.8l-11.9-5.1c-34.5-14.7-57.5-33.2-57.5-72.3 0-35.8 27.5-63 70.8-63 30.8 0 52.8 11.8 67.4 37.4l-36.8 23.6c-7.4-13.2-17.3-18.5-30.6-18.5-13.9 0-23.3 8.8-23.3 20.3 0 13.9 8.8 19.7 29.2 28.5l11.9 5.1c41.3 17.7 63.8 35.4 63.8 76.5 0 43.8-34.5 66.8-79.6 66.8-44.5 0-72.8-21.7-84.3-48.4l38.6-23.3z"/>
  </svg>
);

// 4. C Programming Logo
export const CLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <polygon points="256,16 464,136 464,376 256,496 48,376 48,136" fill="#1B499A" stroke="#2B67C5" strokeWidth="16"/>
    <polygon points="256,48 436,152 436,360 256,464 76,360 76,152" fill="#29559E"/>
    <path d="M340 180c-22-24-52-36-84-36-66 0-120 54-120 120s54 120 120 120c32 0 62-12 84-36l32 32c-30 32-72 50-116 50-92 0-168-76-168-168s76-168 168-168c44 0 86 18 116 50l-32 32z" fill="#FFFFFF"/>
  </svg>
);

// 5. Java Logo
export const JavaLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M208 396c0 0-38 18 20 25 72 8 114-6 114-6s-18 14-84 22c-79 10-136-12-136-25 0-21 86-16 86-16z" fill="#E76F00"/>
    <path d="M185 348c0 0-44 23 20 30 76 8 126-5 126-5s-24 13-94 20c-84 8-146-10-146-24 0-23 94-21 94-21z" fill="#E76F00"/>
    <path d="M272 268c34 38-9 74-9 74s84-44 47-98c-34-51-60-76 82-164-96 41-168 118-120 188z" fill="#5382A1"/>
    <path d="M352 388s24 16-24 28c-57 14-135 15-182 4-18-4 35-18 58-22 64-10 148-10 148-10z" fill="#E76F00"/>
    <path d="M367 334s32 20-33 34c-78 17-184 18-246 4-24-6 48-23 79-27 86-12 200-11 200-11z" fill="#5382A1"/>
    <path d="M298 70c40 43-22 93-22 93s84-46 54-105c-28-56-118-42-32 12z" fill="#E76F00"/>
  </svg>
);

// 6. Python Logo
export const PythonLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M253.7 32C179.8 32 135 52.8 135 99.8v43.5h121.7v18.7H86.2C38.6 162 0 207.2 0 274.5c0 68.2 41.2 107.5 90.7 107.5h33.8v-49.8c0-54.7 46.8-99.7 103.8-99.7h120.3v-19.1H188.4v-43.5c0-47.5 42.7-72.9 101.4-72.9h95.7V32h-131.8z" fill="#3776AB"/>
    <circle cx="187" cy="88" r="14" fill="#FFFFFF"/>
    <path d="M258.3 480c73.9 0 118.7-20.8 118.7-67.8v-43.5H255.3V350h170.5C473.4 350 512 304.8 512 237.5c0-68.2-41.2-107.5-90.7-107.5h-33.8v49.8c0 54.7-46.8 99.7-103.8 99.7H163.4v19.1h160.2v43.5c0 47.5-42.7 72.9-101.4 72.9h-95.7V480h131.8z" fill="#FFD43B"/>
    <circle cx="325" cy="424" r="14" fill="#FFFFFF"/>
  </svg>
);

// 7. Bootstrap Logo
export const BootstrapLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="100" fill="#7952B3"/>
    <path d="M198 132h76c48 0 78 22 78 58 0 24-14 44-38 52 30 7 48 30 48 59 0 40-34 65-84 65h-80V132zm46 95h30c20 0 32-9 32-24 0-14-12-23-32-23h-30v47zm0 91h34c22 0 36-10 36-26 0-16-14-26-36-26h-34v52z" fill="#FFFFFF"/>
  </svg>
);

// 8. MS Office Logo (Official Microsoft 365 / Office orange ribbon)
export const MsOfficeLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="90" fill="#181B26" />
    <path d="M140 100h150c45 0 80 35 80 80v152c0 45-35 80-80 80H140c-15 0-25-10-25-25V125c0-15 10-25 25-25z" fill="#D83B01"/>
    <path d="M220 150h70c30 0 55 25 55 55v102c0 30-25 55-55 55h-70V150z" fill="#EB3C00"/>
    <path d="M115 140h130c15 0 25 10 25 25v182c0 15-10 25-25 25H115c-15 0-25-10-25-25V165c0-15 10-25 25-25z" fill="#F25022"/>
    <rect x="145" y="195" width="70" height="122" rx="14" fill="#FFFFFF"/>
  </svg>
);

// 9. React.js Logo
export const ReactLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

// 10. Express.js Logo
export const ExpressLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="240" fill="#303030"/>
    <text x="256" y="325" fill="#FFFFFF" fontSize="210" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ex</text>
  </svg>
);

// 11. Power BI Logo
export const PowerBiLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="64" y="64" width="384" height="384" rx="40" fill="#201F1E"/>
    <rect x="110" y="270" width="60" height="150" rx="12" fill="#F2C811"/>
    <rect x="195" y="190" width="60" height="230" rx="12" fill="#F2C811"/>
    <rect x="280" y="130" width="60" height="290" rx="12" fill="#F2C811"/>
    <rect x="365" y="90" width="45" height="330" rx="12" fill="#E5990B"/>
  </svg>
);

// 12. MySQL Logo
export const MySqlLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="80" fill="#00758F"/>
    <path d="M120 280c20-70 90-130 180-130 50 0 85 20 100 45-20 10-50 15-70 10-50-10-90 10-120 45-25 30-40 70-40 105 0 25 10 45 30 55-30-10-60-45-80-130z" fill="#F29111"/>
    <path d="M220 220c30-35 70-55 120-45 20 5 50 0 70-10 10 15 15 35 15 55 0 80-60 145-145 145-45 0-80-20-95-50 10 5 25 10 40 10 45 0 85-35 85-80 0-25-10-45-25-55-20-10-45-5-65 30z" fill="#FFFFFF"/>
  </svg>
);

// 13. Tableau Logo
export const TableauLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0,0)">
      {/* Center cross */}
      <rect x="238" y="160" width="36" height="192" rx="4" fill="#E8762D"/>
      <rect x="160" y="238" width="192" height="36" rx="4" fill="#E8762D"/>
      {/* Top right */}
      <rect x="340" y="110" width="28" height="110" rx="3" fill="#2A5788"/>
      <rect x="299" y="151" width="110" height="28" rx="3" fill="#2A5788"/>
      {/* Top left */}
      <rect x="144" y="110" width="28" height="110" rx="3" fill="#7599C1"/>
      <rect x="103" y="151" width="110" height="28" rx="3" fill="#7599C1"/>
      {/* Bottom right */}
      <rect x="340" y="292" width="28" height="110" rx="3" fill="#588B8B"/>
      <rect x="299" y="333" width="110" height="28" rx="3" fill="#588B8B"/>
      {/* Bottom left */}
      <rect x="144" y="292" width="28" height="110" rx="3" fill="#ED9957"/>
      <rect x="103" y="333" width="110" height="28" rx="3" fill="#ED9957"/>
    </g>
  </svg>
);

// 14. Pandas Logo
export const PandasLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="80" fill="#130754"/>
    <g transform="translate(100, 90)">
      <rect x="20" y="20" width="60" height="280" rx="10" fill="#FFD43B"/>
      <rect x="120" y="60" width="60" height="240" rx="10" fill="#E70488"/>
      <rect x="220" y="120" width="60" height="180" rx="10" fill="#00D2FF"/>
    </g>
  </svg>
);

// 15. Excel Logo
export const ExcelLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="64" y="64" width="384" height="384" rx="40" fill="#107C41"/>
    <path d="M190 170l55 86-55 86h45l35-60 35 60h45l-55-86 55-86h-45l-35 58-35-58h-45z" fill="#FFFFFF"/>
  </svg>
);

// 16. Git Logo
export const GitLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M501 228L284 11c-14-14-38-14-53 0L174 68l68 68c15-5 33 0 43 11 11 11 15 28 11 43l65 65c15-4 32 0 43 11 15 15 15 40 0 55s-40 15-55 0c-11-11-15-28-11-43l-61-61v145c4 3 8 7 11 11 15 15 15 40 0 55s-40 15-55 0-15-40 0-55c4-4 8-8 13-11v-145c-5-3-9-7-13-11-12-12-15-29-10-44L110 132 11 231c-14 14-14 38 0 53l217 217c14 14 38 14 53 0l220-220c15-15 15-39 0-53z" fill="#F05032"/>
  </svg>
);

// 17. Supabase Logo
export const SupabaseLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="80" fill="#1C1C1C"/>
    <path d="M268 438c-8 10-24 5-25-8l-8-164h152c16 0 24 19 13 31L268 438z" fill="#3ECF8E"/>
    <path d="M244 74c8-10 24-5 25 8l8 164H125c-16 0-24-19-13-31L244 74z" fill="#249361"/>
  </svg>
);

// 18. Node.js Logo
export const NodeLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M256 16l192 110v220l-192 110L64 346V126L256 16z" fill="#339933"/>
    <text x="256" y="300" fill="#FFFFFF" fontSize="130" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">node</text>
  </svg>
);

// 19. TypeScript Logo
export const TypeScriptLogo: React.FC<TechLogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="64" fill="#3178C6"/>
    <path d="M120 220h110v35h-35v145h-40V255h-35v-35zm130 115c10 15 25 25 50 25 20 0 35-10 35-25 0-18-15-24-40-34l-12-5c-35-15-60-35-60-75 0-40 30-70 78-70 35 0 60 15 75 40l-32 25c-8-15-20-22-42-22-18 0-30 8-30 20 0 15 12 20 35 30l12 5c45 20 68 40 68 80 0 45-35 75-88 75-45 0-75-20-92-50l31-24z" fill="#FFFFFF"/>
  </svg>
);

// Helper function to check if a technology has a recognized official vector logo
export const hasTechLogo = (name: string): boolean => {
  const cleanName = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!cleanName) return false;
  return Boolean(
    cleanName.includes('html') ||
    cleanName.includes('css') ||
    cleanName.includes('javascript') || cleanName === 'js' ||
    cleanName === 'c' || cleanName.startsWith('cprog') ||
    (cleanName.includes('java') && !cleanName.includes('script')) ||
    cleanName.includes('python') ||
    cleanName.includes('bootstrap') ||
    cleanName.includes('msoffice') || cleanName.includes('office') ||
    cleanName.includes('react') ||
    cleanName.includes('express') ||
    cleanName.includes('powerbi') || cleanName.includes('bi') ||
    cleanName.includes('mysql') || cleanName.includes('sql') ||
    cleanName.includes('tableau') ||
    cleanName.includes('panda') ||
    cleanName.includes('excel') ||
    cleanName.includes('git') ||
    cleanName.includes('supabase') ||
    cleanName.includes('node') ||
    cleanName.includes('typescript') || cleanName === 'ts'
  );
};

// Helper function to resolve logo dynamically
export const getTechLogo = (name: string, customIconUrl?: string, className = 'w-14 h-14') => {
  if (customIconUrl && customIconUrl.trim()) {
    return (
      <img
        src={customIconUrl}
        alt={name}
        className={`${className} object-contain rounded-lg drop-shadow`}
      />
    );
  }

  const cleanName = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (cleanName.includes('html')) return <HtmlLogo className={className} />;
  if (cleanName.includes('css')) return <CssLogo className={className} />;
  if (cleanName.includes('javascript') || cleanName === 'js') return <JavaScriptLogo className={className} />;
  if (cleanName === 'c' || cleanName.startsWith('cprog')) return <CLogo className={className} />;
  if (cleanName.includes('java') && !cleanName.includes('script')) return <JavaLogo className={className} />;
  if (cleanName.includes('python')) return <PythonLogo className={className} />;
  if (cleanName.includes('bootstrap')) return <BootstrapLogo className={className} />;
  if (cleanName.includes('msoffice') || cleanName.includes('office')) return <MsOfficeLogo className={className} />;
  if (cleanName.includes('react')) return <ReactLogo className={className} />;
  if (cleanName.includes('express')) return <ExpressLogo className={className} />;
  if (cleanName.includes('powerbi') || cleanName.includes('bi')) return <PowerBiLogo className={className} />;
  if (cleanName.includes('mysql') || cleanName.includes('sql')) return <MySqlLogo className={className} />;
  if (cleanName.includes('tableau')) return <TableauLogo className={className} />;
  if (cleanName.includes('panda')) return <PandasLogo className={className} />;
  if (cleanName.includes('excel')) return <ExcelLogo className={className} />;
  if (cleanName.includes('git')) return <GitLogo className={className} />;
  if (cleanName.includes('supabase')) return <SupabaseLogo className={className} />;
  if (cleanName.includes('node')) return <NodeLogo className={className} />;
  if (cleanName.includes('typescript') || cleanName === 'ts') return <TypeScriptLogo className={className} />;

  // Default fallback
  return <PowerBiLogo className={className} />;
};

