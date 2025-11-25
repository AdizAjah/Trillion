import { TIERS, TIER_STYLES, SPECIAL_NUMBERS } from './constants'

// Get tier information based on number
export function getTierInfo(number) {
  if (number === SPECIAL_NUMBERS.JACKPOT) {
    return TIER_STYLES.JACKPOT
  }
  if (number === TIERS.GODLIKE) {
    return TIER_STYLES.GODLIKE
  }
  if (number >= TIERS.LEGENDARY) {
    return TIER_STYLES.LEGENDARY
  }
  if (number >= TIERS.MYTHIC) {
    return TIER_STYLES.MYTHIC
  }
  if (number >= TIERS.EPIC) {
    return TIER_STYLES.EPIC
  }
  if (number >= TIERS.RARE) {
    return TIER_STYLES.RARE
  }
  if (number >= TIERS.UNCOMMON) {
    return TIER_STYLES.UNCOMMON
  }
  return TIER_STYLES.COMMON
}

// Get tier color for library display
export function getTierColor(num) {
  if (num === TIERS.GODLIKE) {
    return 'bg-gradient-to-r from-yellow-300 via-red-500 to-purple-600 border-yellow-400 text-black animate-pulse'
  }
  if (num >= TIERS.LEGENDARY) {
    return 'bg-red-900 border-red-500 text-red-200 shadow-[0_0_10px_red]'
  }
  if (num >= TIERS.EPIC) {
    return 'bg-purple-900 border-purple-500 text-purple-200'
  }
  if (num >= TIERS.RARE) {
    return 'bg-blue-900 border-blue-500 text-blue-200'
  }
  if (num >= TIERS.UNCOMMON) {
    return 'bg-green-900 border-green-500 text-green-200'
  }
  return 'bg-gray-700 border-gray-600 text-gray-400'
}

// Generate random number with exponential decay
export function generateRandomNumber(maxNumber, difficulty) {
  const random = Math.random()
  return Math.floor(1 + (maxNumber - 1) * Math.pow(random, difficulty))
}

// Format username from email
export function formatUsername(email) {
  return email.split('@')[0]
}
