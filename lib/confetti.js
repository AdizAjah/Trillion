import confetti from 'canvas-confetti'
import { SPECIAL_NUMBERS, TIERS } from './constants'

// Fire confetti cannon
function fireCannon(angle, originX, opts = {}) {
  confetti({
    angle,
    spread: 55,
    particleCount: 100,
    origin: { x: originX, y: 0.8 },
    startVelocity: 50,
    ticks: 200,
    gravity: 1.2,
    ...opts,
  })
}

// Jackpot 777 effect - Gold coins rain
export function triggerJackpotEffect() {
  const duration = 5000
  const animationEnd = Date.now() + duration
  const goldColors = ['#FFD700', '#FFA500', '#DAA520', '#FFE135']

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    // Fire gold coins from left and right
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.8 },
      colors: goldColors,
      shapes: ['circle'],
      scalar: 1.5,
      startVelocity: 60,
    })
    confetti({
      particleCount: 20,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.8 },
      colors: goldColors,
      shapes: ['circle'],
      scalar: 1.5,
      startVelocity: 60,
    })
  }, 150)

  return interval
}

// Godlike 1000 effect - Random star burst
export function triggerGodlikeEffect() {
  const duration = 4000
  const animationEnd = Date.now() + duration

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() * 0.3 },
      colors: ['#FFD700', '#FFFFFF', '#FF0000'],
      shapes: ['star', 'circle'],
    })
  }, 200)

  return interval
}

// Legendary 900+ effect - Double cannon + star burst
export function triggerLegendaryEffect() {
  fireCannon(60, 0)
  fireCannon(120, 1)

  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#b91c1c', '#FFD700'],
      shapes: ['star'],
      startVelocity: 40,
      gravity: 0.8,
    })
  }, 200)
}

// Epic 700+ effect - Purple burst
export function triggerEpicEffect() {
  const epicOpts = {
    particleCount: 80,
    spread: 80,
    origin: { y: 0.7 },
    colors: ['#a855f7', '#d8b4fe'],
  }
  confetti(epicOpts)
  setTimeout(() => confetti({ ...epicOpts, startVelocity: 45 }), 150)
}

// Rare 400+ effect - Blue burst
export function triggerRareEffect() {
  confetti({
    particleCount: 60,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#60a5fa'],
    startVelocity: 35,
  })
}

// Main trigger function
export function triggerConfettiEffect(result) {
  if (result === SPECIAL_NUMBERS.JACKPOT) {
    return triggerJackpotEffect()
  }
  if (result === TIERS.GODLIKE) {
    return triggerGodlikeEffect()
  }
  if (result >= TIERS.LEGENDARY) {
    triggerLegendaryEffect()
  } else if (result >= TIERS.EPIC) {
    triggerEpicEffect()
  } else if (result >= TIERS.RARE) {
    triggerRareEffect()
  }
  return null
}
