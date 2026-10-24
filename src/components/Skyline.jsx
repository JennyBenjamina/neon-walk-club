// A generic, stylized night skyline: towers, a pyramid and a lattice tower in neon outline.
export default function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="#120a1f" stroke="var(--violet)" strokeWidth="1.5" strokeOpacity=".55">
        <path d="M0 260 V190 H60 V150 H110 V200 H150 V260 Z" />
        <path d="M150 260 L240 160 L330 260 Z" stroke="var(--amber)" strokeOpacity=".7" />
        <path d="M340 260 V120 H380 V90 H420 V120 H450 V260 Z" />
        <path d="M470 260 L520 60 L570 260 M488 190 H552 M500 140 H540" fill="none" stroke="var(--pink)" strokeOpacity=".8" />
        <path d="M590 260 V140 Q620 110 650 140 V260 Z" />
        <path d="M670 260 V100 H720 V260 Z" />
        <path d="M740 260 V170 H800 V130 H830 V260 Z" />
        <path d="M850 260 V60 H858 V40 H866 V60 H874 V260 Z" stroke="var(--cyan)" strokeOpacity=".8" />
        <path d="M845 70 H880 V95 H845 Z" stroke="var(--cyan)" strokeOpacity=".8" />
        <path d="M900 260 V150 H960 V110 H1000 V260 Z" />
        <path d="M1010 260 V180 H1080 V140 H1120 V260 Z" />
        <path d="M1130 260 V200 H1200 V260 Z" />
      </g>
      <g fill="var(--amber)" opacity=".55">
        {[360, 372, 396, 408, 684, 700, 916, 940, 1030, 1050, 1094].map((x, i) => (
          <rect key={x} x={x} y={150 + (i % 4) * 22} width="6" height="8" />
        ))}
      </g>
    </svg>
  )
}
