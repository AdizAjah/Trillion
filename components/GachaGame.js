'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { GAME_CONFIG, SPECIAL_NUMBERS, TIERS } from '../lib/constants'
import { getTierInfo, generateRandomNumber, formatUsername } from '../lib/utils'
import { triggerConfettiEffect } from '../lib/confetti'
import Library from './Library'

export default function GachaGame({ session }) {
  const [number, setNumber] = useState(null)
  const [highScore, setHighScore] = useState(0)
  const [collection, setCollection] = useState([])
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const [isRolling, setIsRolling] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [message, setMessage] = useState('')
  const [tierData, setTierData] = useState({ style: 'text-gray-500', label: '' })
  const [isAutoRolling, setIsAutoRolling] = useState(false)

  // State visual
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState(false)
  const [pop, setPop] = useState(false)
  const [bgStyle, setBgStyle] = useState('bg-black') // Background State

  const user = session.user
  const displayUsername = formatUsername(user.email)
  const confettiIntervalRef = useRef(null)

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('highest_roll, collection')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error.message)
      }

      if (data) {
        setHighScore(data.highest_roll || 0)
        setCollection(data.collection || [])
      } else {
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert(
            { id: user.id, username: displayUsername, highest_roll: 0, collection: [] },
            { onConflict: 'id', ignoreDuplicates: true }
          )
        if (insertError) {
          console.error('Failed to create profile:', insertError.message)
        }
      }
    }
    loadProfile()
  }, [user.id, displayUsername])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldown])

  // Visual effects handler
  const triggerVisualEffects = (result) => {
    setShake(false)
    setFlash(false)
    setPop(false)

    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current)
    }

    requestAnimationFrame(() => {
      setPop(true)

      // Special effects based on tier
      if (result === SPECIAL_NUMBERS.JACKPOT) {
        setFlash(true)
        setShake(true)
        confettiIntervalRef.current = triggerConfettiEffect(result)
      } else if (result === TIERS.GODLIKE) {
        if (result >= TIERS.EPIC) setShake(true)
        confettiIntervalRef.current = triggerConfettiEffect(result)
      } else if (result >= TIERS.LEGENDARY) {
        setFlash(true)
        setShake(true)
        triggerConfettiEffect(result)
      } else if (result >= TIERS.EPIC) {
        setShake(true)
        triggerConfettiEffect(result)
      } else if (result >= TIERS.RARE) {
        triggerConfettiEffect(result)
      }
    })
  }

  // Roll number logic
  const rollNumber = useCallback(() => {
    if (cooldown > 0 || isRolling) return

    setIsRolling(true)
    setMessage('')
    setPop(false)
    setTierData({ style: 'text-white animate-spin opacity-50', label: '...' })
    setBgStyle('bg-black')

    setTimeout(async () => {
      const result = generateRandomNumber(GAME_CONFIG.MAX_NUMBER, GAME_CONFIG.DIFFICULTY)
      setNumber(result)

      const tierInfo = getTierInfo(result)
      setTierData({ style: tierInfo.style, label: tierInfo.label })
      setBgStyle(tierInfo.bg)
      triggerVisualEffects(result)

      // Update database if needed
      let newHighScore = highScore
      let newCollection = [...collection]
      let needUpdate = false
      let statusMsg = ''

      if (result > highScore) {
        newHighScore = result
        statusMsg = '🎉 NEW RECORD! 🎉'
        needUpdate = true
      }

      if (!collection.includes(result)) {
        newCollection.push(result)
        if (!statusMsg) statusMsg = '✨ NEW COLLECTION! ✨'
        needUpdate = true
      }

      if (needUpdate) {
        setMessage(statusMsg)
        setHighScore(newHighScore)
        setCollection(newCollection)

        const { error } = await supabase
          .from('profiles')
          .update({ highest_roll: newHighScore, collection: newCollection })
          .eq('id', user.id)

        if (error) {
          console.error('Failed to update database:', error.message)
        }
      }

      setIsRolling(false)
      setCooldown(GAME_CONFIG.COOLDOWN_SECONDS)
    }, GAME_CONFIG.ROLL_ANIMATION_DURATION)
  }, [cooldown, isRolling, user.id, highScore, collection])

  // Auto roll effect
  useEffect(() => {
    if (isAutoRolling && cooldown === 0 && !isRolling) {
      rollNumber()
    }
  }, [isAutoRolling, cooldown, isRolling, rollNumber])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen text-white relative overflow-hidden transition-colors duration-700 ${bgStyle} ${shake ? 'animate-rumble' : ''}`}>

      {flash && <div className="animate-flash"></div>}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <Library
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        collection={collection}
      />

      {/* Header */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end">
        <span className="text-gray-400 text-sm font-mono">PLAYER: {displayUsername}</span>
        <button onClick={handleLogout} className="text-red-500 text-xs hover:underline mt-1">LOGOUT</button>
      </div>

      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <div className="bg-gray-900/80 backdrop-blur border border-gray-700 px-4 py-2 rounded shadow-lg">
          <p className="text-xs text-gray-400 uppercase tracking-widest">High Score</p>
          <p className="text-xl font-mono text-yellow-500">{highScore}</p>
        </div>

        <button
          onClick={() => setIsLibraryOpen(true)}
          className="bg-indigo-900/80 backdrop-blur border border-indigo-500 px-4 py-2 rounded shadow-lg hover:bg-indigo-800 transition flex flex-col justify-center"
        >
          <p className="text-xs text-indigo-300 uppercase tracking-widest">Library</p>
          <p className="text-sm font-bold text-white">
            {collection.length} / {GAME_CONFIG.MAX_NUMBER}
          </p>
        </button>
      </div>

      {/* Main Game Area */}
      <div className="z-10 flex flex-col items-center justify-center h-64 w-full">
        <p className={`text-sm font-bold tracking-[0.3em] mb-2 h-6 ${number === SPECIAL_NUMBERS.JACKPOT ? 'text-yellow-300' : 'text-gray-400'}`}>
          {isRolling ? 'ROLLING...' : tierData.label}
        </p>

        <h1 className={`
            font-black font-mono transform 
            ${isRolling
            ? 'text-6xl text-white opacity-50 blur-sm transition-all duration-300'
            : `text-7xl ${tierData.style} ${pop ? 'scale-125 duration-75' : 'scale-100 duration-300'} transition-transform`
          }
        `}>
          {isRolling ? '???' : (number !== null ? number : 'READY')}
        </h1>

        <div className="h-8 mt-4">
          {message && <span className="text-yellow-300 font-bold animate-pulse text-lg drop-shadow-md">{message}</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="z-10 flex flex-col items-center gap-6">
        <button
          onClick={rollNumber}
          disabled={cooldown > 0 || isRolling}
          className={`
            w-36 h-36 rounded-full text-xl font-black tracking-wider shadow-[0_0_0_4px_rgba(255,255,255,0.1)]
            transition-all duration-100 transform active:scale-90 flex items-center justify-center relative
            ${cooldown > 0
              ? 'bg-gray-800 text-gray-600 border-4 border-gray-700 cursor-not-allowed'
              : number === SPECIAL_NUMBERS.JACKPOT
                ? 'bg-yellow-600 text-white border-4 border-yellow-400 animate-pulse'
                : 'bg-indigo-600 text-white border-4 border-indigo-400 hover:bg-indigo-500 hover:shadow-[0_0_50px_rgba(99,102,241,0.8)] hover:border-white'}
          `}
        >
          {cooldown > 0 ? (
            <span className="text-4xl font-mono">{cooldown}</span>
          ) : (
            isRolling ? '...' : 'ROLL'
          )}

          {isAutoRolling && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
          )}
        </button>

        <button
          onClick={() => setIsAutoRolling(!isAutoRolling)}
          className={`
            px-6 py-2 rounded-full font-mono text-sm font-bold border transition-all
            ${isAutoRolling
              ? 'bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
              : 'bg-transparent border-gray-600 text-gray-500 hover:border-gray-400 hover:text-gray-300'}
          `}
        >
          AUTO ROLL: {isAutoRolling ? 'ON' : 'OFF'}
        </button>
      </div>

      <p className="z-10 mt-8 text-gray-500 text-xs font-mono mix-blend-overlay">
        RNG System: Exponential Decay (Diff: {GAME_CONFIG.DIFFICULTY})
      </p>
    </div>
  )
}