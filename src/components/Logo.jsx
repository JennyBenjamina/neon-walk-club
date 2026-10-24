export function WalkerMark({ size = 40 }) {
  return (
    <svg className="walker-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="13" fill="none" stroke="var(--pink)" strokeWidth="3.5" />
      <g fill="none" stroke="var(--cyan)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="35" cy="17" r="4.5" />
        <path d="M34 23 L30 37 M32 27 L23 32 M32 27 L41 31 M30 37 L22 49 M30 37 L37 43 L42 50" />
      </g>
    </svg>
  )
}

export default function Logo({ size = 40 }) {
  return (
    <span className="logo">
      <WalkerMark size={size} />
      <span className="logo-words">
        <span className="logo-neon">NEON</span>
        <span className="logo-club">WALK CLUB</span>
      </span>
    </span>
  )
}
