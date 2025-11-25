'use client'
import { useEffect, useRef } from 'react'

export default function ParticleBackground({ tier = 'common', isActive = false }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle configuration based on tier
    const configs = {
      jackpot: { count: 100, colors: ['#FFD700', '#FFA500', '#FFED4E'], size: 3, speed: 2 },
      godlike: { count: 80, colors: ['#a855f7', '#ec4899', '#f59e0b'], size: 2.5, speed: 1.5 },
      legendary: { count: 60, colors: ['#ef4444', '#dc2626', '#FF6B6B'], size: 2, speed: 1.2 },
      epic: { count: 40, colors: ['#a855f7', '#c084fc', '#e9d5ff'], size: 2, speed: 1 },
      rare: { count: 30, colors: ['#60a5fa', '#93c5fd', '#dbeafe'], size: 1.5, speed: 0.8 },
      common: { count: 15, colors: ['#6b7280', '#9ca3af', '#d1d5db'], size: 1, speed: 0.5 },
    }

    const config = configs[tier] || configs.common

    class Particle {
      constructor() {
        this.reset()
        this.y = Math.random() * canvas.height
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 10
        this.size = Math.random() * config.size + 1
        this.speedY = -Math.random() * config.speed - 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)]
        this.opacity = Math.random() * 0.5 + 0.3
        this.life = 0
      }

      update() {
        this.y += this.speedY
        this.x += this.speedX
        this.life += 0.01

        // Fade in and out
        if (this.life < 0.2) {
          this.opacity = this.life * 5 * 0.8
        } else if (this.life > 0.8) {
          this.opacity = (1 - this.life) * 5 * 0.8
        }

        if (this.y < -10 || this.life > 1) {
          this.reset()
        }
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Glow effect for special tiers
        if (tier === 'jackpot' || tier === 'godlike') {
          ctx.shadowBlur = 10
          ctx.shadowColor = this.color
          ctx.fill()
        }
        
        ctx.restore()
      }
    }

    // Initialize particles
    if (isActive) {
      particlesRef.current = Array.from({ length: config.count }, () => new Particle())
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isActive) {
        particlesRef.current.forEach((particle) => {
          particle.update()
          particle.draw()
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [tier, isActive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
