import React from 'react';

// Procedural high-tech SVG Cyberpunk Avatars
export const CyberAvatar = ({ archetype = 'neon_ronin', size = 'md', className = '', glow = true }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Custom Cyberpunk Avatar Vectors
  const renderAvatarGraphic = () => {
    switch (archetype) {
      case 'neon_ronin':
      case 'usr_me':
        // Cyan Cyber Ninja with neon visor and carbon mask
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="ronin_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0f172a" />
                <stop offset="1" stopColor="#083344" />
              </linearGradient>
              <linearGradient id="ronin_cyan" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5eead4" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#ronin_bg)" stroke="#5eead4" strokeWidth="2" />
            {/* Hood / Helmet */}
            <path d="M22 68 C22 32 32 20 50 18 C68 20 78 32 78 68 C74 76 66 82 50 82 C34 82 26 76 22 68 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <path d="M28 45 L50 28 L72 45 L68 70 L32 70 Z" fill="#0f172a" />
            {/* Glowing Neon Visor */}
            <path d="M30 46 Q50 40 70 46 L68 54 Q50 48 32 54 Z" fill="url(#ronin_cyan)" filter="drop-shadow(0 0 6px #5eead4)" />
            {/* Cyber Respirator / Lower Mask */}
            <polygon points="42,58 58,58 55,74 45,74" fill="#334155" stroke="#5eead4" strokeWidth="1" />
            <line x1="45" y1="64" x2="55" y2="64" stroke="#5eead4" strokeWidth="1.5" />
            <line x1="47" y1="69" x2="53" y2="69" stroke="#5eead4" strokeWidth="1.5" />
            {/* Ear Node Implants */}
            <circle cx="27" cy="50" r="3" fill="#5eead4" />
            <circle cx="73" cy="50" r="3" fill="#5eead4" />
          </svg>
        );

      case 'quantum_hacker':
      case 'opp_3':
        // Purple Neural Hacker with multi-lens cyber optics
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="quantum_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e1b4b" />
                <stop offset="1" stopColor="#3b0764" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#quantum_bg)" stroke="#c084fc" strokeWidth="2" />
            {/* Cyber Head Silhouette */}
            <path d="M25 65 C25 35 34 22 50 22 C66 22 75 35 75 65 C70 78 62 82 50 82 C38 82 30 78 25 65 Z" fill="#1e1b4b" stroke="#6b21a8" strokeWidth="2" />
            {/* Neural Matrix Lines */}
            <path d="M50 22 L50 40 M38 28 L44 38 M62 28 L56 38" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2 2" />
            {/* Multi-ocular Optics */}
            <circle cx="40" cy="48" r="7" fill="#2e1065" stroke="#c084fc" strokeWidth="2" />
            <circle cx="40" cy="48" r="3" fill="#e879f9" filter="drop-shadow(0 0 4px #e879f9)" />
            <circle cx="60" cy="48" r="7" fill="#2e1065" stroke="#c084fc" strokeWidth="2" />
            <circle cx="60" cy="48" r="3" fill="#e879f9" filter="drop-shadow(0 0 4px #e879f9)" />
            <circle cx="50" cy="38" r="4" fill="#2e1065" stroke="#c084fc" strokeWidth="1.5" />
            <circle cx="50" cy="38" r="1.5" fill="#e879f9" />
            {/* Cyber Chin Interface */}
            <path d="M40 68 L50 74 L60 68" stroke="#a855f7" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'byte_reaper':
      case 'opp_1':
      case 'opp_2':
        // Fiery Orange / Red Cyber Assassin with skeletal optic plates
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="reaper_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#431407" />
                <stop offset="1" stopColor="#18181b" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#reaper_bg)" stroke="#fb7444" strokeWidth="2" />
            {/* Angular Cyber Mask */}
            <polygon points="50,18 78,32 72,70 50,84 28,70 22,32" fill="#1c1917" stroke="#ea580c" strokeWidth="2" />
            <polygon points="50,25 70,36 65,65 50,76 35,65 30,36" fill="#0c0a09" />
            {/* Aggressive Fiery Slit Eyes */}
            <polygon points="35,46 47,49 45,54 33,50" fill="#fb7444" filter="drop-shadow(0 0 6px #ea580c)" />
            <polygon points="65,46 53,49 55,54 67,50" fill="#fb7444" filter="drop-shadow(0 0 6px #ea580c)" />
            {/* Carbon Fiber Teeth Vent */}
            <path d="M42 63 L44 71 M47 63 L48 72 M50 63 L50 73 M53 63 L52 72 M58 63 L56 71" stroke="#fb7444" strokeWidth="1.5" />
          </svg>
        );

      case 'mech_overlord':
      case 'rank_1':
        // Grandmaster Golden / Crimson Mech Crown Titan
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="mech_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#451a03" />
                <stop offset="1" stopColor="#701a75" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#mech_bg)" stroke="#fbbf24" strokeWidth="2" />
            {/* Apex Crown Crest */}
            <polygon points="30,22 50,10 70,22 62,32 50,26 38,32" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" filter="drop-shadow(0 0 4px #fbbf24)" />
            {/* Armored Titanium Helmet */}
            <polygon points="26,38 50,28 74,38 70,72 50,84 30,72" fill="#18181b" stroke="#fbbf24" strokeWidth="2" />
            {/* Hexagonal Gold Visor */}
            <polygon points="35,46 50,42 65,46 62,56 50,60 38,56" fill="#fbbf24" filter="drop-shadow(0 0 8px #fbbf24)" opacity="0.9" />
            <line x1="50" y1="42" x2="50" y2="60" stroke="#78350f" strokeWidth="1.5" />
            {/* Power Exhausts */}
            <rect x="36" y="68" width="8" height="4" rx="1" fill="#f43f5e" />
            <rect x="56" y="68" width="8" height="4" rx="1" fill="#f43f5e" />
          </svg>
        );

      case 'glitch_valkyrie':
      case 'team_1':
        // Emerald/Cyan Cyber Valkyrie with glowing holographic wings
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="valk_bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#022c22" />
                <stop offset="1" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#valk_bg)" stroke="#34d399" strokeWidth="2" />
            {/* Holographic Wing Antennas */}
            <path d="M16 40 Q25 24 38 32 L34 44 Z" fill="#059669" opacity="0.8" />
            <path d="M84 40 Q75 24 62 32 L66 44 Z" fill="#059669" opacity="0.8" />
            {/* Sleek Face Armor */}
            <path d="M30 35 Q50 25 70 35 L66 70 Q50 82 34 70 Z" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
            {/* Twin Cyan Optics */}
            <ellipse cx="42" cy="50" rx="5" ry="3" fill="#6ee7b7" filter="drop-shadow(0 0 5px #34d399)" />
            <ellipse cx="58" cy="50" rx="5" ry="3" fill="#6ee7b7" filter="drop-shadow(0 0 5px #34d399)" />
            {/* Forehead Energy Diamond */}
            <polygon points="50,34 54,40 50,46 46,40" fill="#a7f3d0" />
          </svg>
        );

      default:
        // Core Cyber Sentinel
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="48" fill="#111827" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="30,30 70,30 65,70 50,80 35,70" fill="#1f2937" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="32" y1="48" x2="68" y2="48" stroke="#38bdf8" strokeWidth="4" filter="drop-shadow(0 0 6px #38bdf8)" />
            <circle cx="50" cy="62" r="3" fill="#38bdf8" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative rounded-full flex items-center justify-center select-none overflow-hidden transition-all duration-300 ${currentSize} ${className}`}>
      {renderAvatarGraphic()}
    </div>
  );
};
