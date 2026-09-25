import React from 'react';

interface LogoBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeMap[size]} shrink-0 transition-transform hover:scale-105 duration-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.35)]`}>
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer ring gradient */}
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>

            {/* Inner vinyl gradient */}
            <radialGradient id="vinylGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="18%" stopColor="#0f172a" />
              <stop offset="35%" stopColor="#1e293b" />
              <stop offset="70%" stopColor="#020617" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            {/* Brass gold shimmer */}
            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            {/* Curved text paths */}
            <path
              id="topTextPath"
              d="M 50,200 A 150,150 0 0,1 350,200"
              fill="none"
            />
            <path
              id="bottomTextPath"
              d="M 360,200 A 160,160 0 0,1 40,200"
              fill="none"
            />
          </defs>

          {/* Outer Border & Background */}
          <circle cx="200" cy="200" r="195" fill="url(#bgGrad)" stroke="#020617" strokeWidth="8" />
          <circle cx="200" cy="200" r="185" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

          {/* White Circular Staff Ring */}
          <circle cx="200" cy="200" r="162" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" />
          <circle cx="200" cy="200" r="154" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.4" />
          <circle cx="200" cy="200" r="148" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.4" />
          <circle cx="200" cy="200" r="142" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.4" />

          {/* Decorative musical notes on white ring */}
          <g fill="#1e293b" fontSize="18" fontFamily="Arial, sans-serif" fontWeight="bold">
            <text x="80" y="150" transform="rotate(-35 80,150)">𝄞</text>
            <text x="120" y="80" transform="rotate(-15 120,80)">♪</text>
            <text x="180" y="65">♫</text>
            <text x="240" y="75" transform="rotate(15 240,75)">♬</text>
            <text x="310" y="140" transform="rotate(35 310,140)">𝄞</text>
            <text x="325" y="240" transform="rotate(75 325,240)">𝄢</text>
            <text x="290" y="320" transform="rotate(115 290,320)">♫</text>
            <text x="100" y="310" transform="rotate(-115 100,310)">♪</text>
            <text x="70" y="240" transform="rotate(-75 70,240)">♬</text>
          </g>

          {/* Central Blue & Orange Splashes */}
          <ellipse cx="160" cy="215" rx="35" ry="12" fill="#38bdf8" opacity="0.6" transform="rotate(-25 160,215)" />
          <ellipse cx="240" cy="215" rx="35" ry="12" fill="#fb923c" opacity="0.5" transform="rotate(25 240,215)" />

          {/* Center Vinyl Record */}
          <circle cx="200" cy="235" r="75" fill="url(#vinylGrad)" stroke="#090d16" strokeWidth="4" />
          <circle cx="200" cy="235" r="62" fill="none" stroke="#334155" strokeWidth="1" opacity="0.6" />
          <circle cx="200" cy="235" r="50" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.7" />
          <circle cx="200" cy="235" r="38" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.6" />
          
          {/* Vinyl Spindle hole */}
          <circle cx="200" cy="235" r="14" fill="#64748b" />
          <circle cx="200" cy="235" r="6" fill="#f8fafc" />

          {/* Marching Band Brass Silhouettes */}
          <g fill="#020617">
            {/* Left Trombone Player */}
            <path d="M125 180 Q130 150 145 155 Q155 160 150 185 L145 220 L120 220 Z" />
            <path d="M110 170 L160 178 L160 183 L110 175 Z" stroke="#ca8a04" strokeWidth="2.5" fill="none" />
            <circle cx="140" cy="145" r="10" />
            {/* Shako Hat with Plume */}
            <path d="M130 135 L148 135 L146 118 L132 118 Z" fill="#0f172a" stroke="#ca8a04" strokeWidth="1" />
            <path d="M138 118 Q132 100 144 95 Q148 105 142 118" fill="#f8fafc" />

            {/* Center Tuba / Sousaphone Player */}
            <path d="M185 175 Q195 140 215 140 Q225 150 220 180 L220 215 L180 215 Z" />
            <circle cx="205" cy="135" r="11" />
            {/* Shako hat & plume */}
            <path d="M196 124 L214 124 L212 106 L198 106 Z" fill="#0f172a" stroke="#ca8a04" strokeWidth="1" />
            <path d="M205 106 Q200 85 212 80 Q216 92 209 106" fill="#f8fafc" />
            {/* Sousaphone bell curve */}
            <path d="M175 140 Q160 110 195 100 Q235 90 220 135" fill="none" stroke="url(#brassGrad)" strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="178" cy="130" rx="14" ry="10" fill="#eab308" transform="rotate(-30 178,130)" />

            {/* Right Trumpet Player */}
            <path d="M245 190 Q255 160 270 165 Q280 175 270 205 L260 225 L240 225 Z" />
            <circle cx="260" cy="155" r="10" />
            {/* Shako hat & plume */}
            <path d="M252 145 L268 145 L266 128 L254 128 Z" fill="#0f172a" stroke="#ca8a04" strokeWidth="1" />
            <path d="M260 128 Q254 110 265 105 Q268 116 263 128" fill="#f8fafc" />
            {/* Trumpet raised */}
            <path d="M265 168 L305 174 L308 178 L265 172 Z" fill="url(#brassGrad)" />
          </g>

          {/* Sound waves over vinyl */}
          <path
            d="M 135 240 Q 150 225 165 240 T 195 240 T 225 240 T 255 240 T 270 240"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2"
            opacity="0.85"
          />
          <path
            d="M 145 245 Q 160 232 175 245 T 205 245 T 235 245 T 260 245"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.75"
          />

          {/* Circular Top Text */}
          <text fill="#ffffff" fontSize="13.5" fontWeight="bold" letterSpacing="2.2" fontFamily="sans-serif">
            <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
              KANCHANPISEK WITTAYALAI CHAIYAPHUM SCHOOL BAND
            </textPath>
          </text>

          {/* Circular Bottom Text (Thai) */}
          <text fill="#ffffff" fontSize="14" fontWeight="600" letterSpacing="1" fontFamily="'Prompt', 'Sarabun', sans-serif">
            <textPath href="#bottomTextPath" startOffset="50%" textAnchor="middle">
              ชุมนุมดนตรีสากล โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ
            </textPath>
          </text>
        </svg>
      </div>

      {showSubtitle && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">KPCH Band</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          <span className="font-bold text-slate-100 text-sm md:text-base leading-tight">
            ชุมนุมดนตรีสากล & วงโยธวาทิต
          </span>
          <span className="text-xs text-slate-400 font-light">
            โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ
          </span>
        </div>
      )}
    </div>
  );
};
