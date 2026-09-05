import { type SVGProps } from 'react';

interface LogoIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * LaporKuy icon mark — megaphone + clipboard.
 * Pure SVG, ~1.5KB, scales to any size.
 */
export function LogoIcon({ size = 40, className, ...props }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Clipboard body */}
      <rect x="22" y="4" width="28" height="36" rx="3" fill="#d4e4f7" stroke="#2563eb" strokeWidth="2" />
      {/* Clipboard clip */}
      <rect x="30" y="1" width="12" height="8" rx="2" fill="#3b82f6" />
      {/* Clipboard lines */}
      <line x1="28" y1="18" x2="44" y2="18" stroke="#93b4e0" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="24" x2="40" y2="24" stroke="#93b4e0" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="30" x2="42" y2="30" stroke="#93b4e0" strokeWidth="2" strokeLinecap="round" />
      {/* Clipboard accent dot */}
      <circle cx="30" cy="14" r="2.5" fill="#f59e0b" />

      {/* Megaphone body */}
      <path
        d="M6 30 L22 22 L22 46 L6 38 Z"
        fill="url(#megaGrad)"
        stroke="#1d4ed8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Megaphone bell */}
      <path
        d="M22 20 C34 14, 34 54, 22 48 Z"
        fill="url(#megaGrad)"
        stroke="#1d4ed8"
        strokeWidth="1.5"
      />
      {/* Megaphone handle */}
      <rect x="2" y="29" width="6" height="10" rx="2" fill="#1e40af" />
      {/* Megaphone grip */}
      <rect x="8" y="40" width="4" height="10" rx="2" fill="#f59e0b" />
      <rect x="13" y="43" width="4" height="12" rx="2" fill="#f59e0b" />

      {/* Sound waves */}
      <path d="M28 28 Q33 34, 28 40" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M33 24 Q40 34, 33 44" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />

      <defs>
        <linearGradient id="megaGrad" x1="6" y1="22" x2="22" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface LogoProps {
  /** 'full' = icon + text, 'icon' = icon only */
  variant?: 'full' | 'icon';
  /** Icon size in pixels */
  size?: number;
  /** 'light' for light backgrounds, 'dark' for dark backgrounds */
  theme?: 'light' | 'dark';
  /** Additional class for the wrapper */
  className?: string;
}

/**
 * LaporKuy full logo — icon + brand text.
 *
 * Usage:
 * ```tsx
 * <Logo />                           // full logo, default size
 * <Logo variant="icon" />            // icon only (favicon, nav)
 * <Logo size={48} />                 // custom icon size
 * <Logo theme="dark" />              // white text for dark backgrounds
 * ```
 */
export function Logo({ variant = 'full', size = 40, theme = 'light', className }: LogoProps) {
  if (variant === 'icon') {
    return <LogoIcon size={size} className={className} />;
  }

  // Scale text proportionally to icon size
  const textScale = size / 40;
  const fontSize = 24 * textScale;

  const laporColor = theme === 'dark' ? 'text-white' : 'text-blue-700';
  const kuyColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';

  return (
    <div className={`flex items-center gap-1 ${className ?? ''}`} aria-label="LaporKuy">
      <LogoIcon size={size} />
      <span
        style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
        className="font-extrabold tracking-tight select-none"
      >
        <span className={`${laporColor} italic`}>lapor</span>
        <span className={`${kuyColor} italic`}>kuy</span>
      </span>
    </div>
  );
}
