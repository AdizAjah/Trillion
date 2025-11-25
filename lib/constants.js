// Game Configuration
export const GAME_CONFIG = {
  MAX_NUMBER: 1000,
  DIFFICULTY: 4,
  COOLDOWN_SECONDS: 3,
  ROLL_ANIMATION_DURATION: 500,
}

// Tier Thresholds
export const TIERS = {
  GODLIKE: 1000,
  LEGENDARY: 900,
  MYTHIC: 800,
  EPIC: 700,
  RARE: 400,
  UNCOMMON: 100,
}

// Special Numbers
export const SPECIAL_NUMBERS = {
  JACKPOT: 777,
}

// Tier Styles
export const TIER_STYLES = {
  JACKPOT: {
    style: 'text-yellow-300 drop-shadow-[0_0_15px_rgba(255,215,0,1)] text-9xl font-black tracking-tighter animate-bounce',
    label: '🎰 LUCKY JACKPOT 🎰',
    bg: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-600 via-yellow-900 to-black',
  },
  GODLIKE: {
    style: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-purple-600 drop-shadow-[0_0_35px_rgba(255,215,0,1)] text-8xl',
    label: '👑 GODLIKE 👑',
    bg: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-black',
  },
  LEGENDARY: {
    style: 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)] text-8xl',
    label: 'LEGENDARY',
    bg: 'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-900 via-gray-900 to-black',
  },
  MYTHIC: {
    style: 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.7)] text-7xl',
    label: 'MYTHIC',
    bg: 'bg-gradient-to-b from-gray-900 to-red-950',
  },
  EPIC: {
    style: 'text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.7)] text-7xl',
    label: 'EPIC',
    bg: 'bg-black',
  },
  RARE: {
    style: 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]',
    label: 'RARE',
    bg: 'bg-black',
  },
  UNCOMMON: {
    style: 'text-green-400',
    label: 'UNCOMMON',
    bg: 'bg-black',
  },
  COMMON: {
    style: 'text-gray-600 scale-90',
    label: 'COMMON',
    bg: 'bg-black',
  },
}
