'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import Library from './Library'
import confetti from 'canvas-confetti'

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
  // State baru: Pop Effect (Agar angka membesar saat muncul)
  const [pop, setPop] = useState(false)

  const user = session.user
  const displayUsername = user.email.split('@')[0]

  // Ref untuk mengontrol interval confetti agar bisa distop paksa
  const confettiIntervalRef = useRef(null)

  // --- 1. LOAD DATA ---
  useEffect(() => {
    async function getProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('highest_roll, collection')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') console.error('Error loading profile:', error.message)

      if (data) {
        setHighScore(data.highest_roll || 0)
        setCollection(data.collection || [])
      } else {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username: displayUsername, highest_roll: 0, collection: [] }])
        if (insertError) console.error('GAGAL MEMBUAT PROFIL:', insertError.message)
      }
    }
    getProfile()
  }, [user.id, displayUsername])

  // --- 2. TIMER COOLDOWN ---
  useEffect(() => {
    let interval
    if (cooldown > 0) {
      interval = setInterval(() => setCooldown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [cooldown])

  // --- EFEK VISUAL (DIPERBAIKI) ---
  const triggerVisualEffects = (result) => {
    // 1. Reset state visual seketika
    setShake(false)
    setFlash(false)
    setPop(false)
    
    // Bersihkan confetti lama jika ada (khusus godlike)
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current)

    // 2. Gunakan requestAnimationFrame agar sinkron dengan frame browser berikutnya
    requestAnimationFrame(() => {
        // Trigger Pop Text (Angka membesar mendadak)
        setPop(true) 

        // Trigger Shake & Flash sesuai Tier
        if (result >= 700) setShake(true) 
        if (result >= 900) setFlash(true)

        // 3. Trigger Confetti LANGSUNG (Tanpa Delay)
        // EFEK: GODLIKE (1000)
        if (result === 1000) {
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            confettiIntervalRef.current = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(confettiIntervalRef.current);
                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        } 
        // EFEK: LEGENDARY (900+)
        else if (result >= 900) {
            // Tembak langsung banyak
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, gravity: 1.2, colors: ['#ef4444', '#b91c1c'] });
            // Tembak susulan sedikit lebih cepat (50ms)
            setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.6 }, angle: 60 }), 50);
            setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.6 }, angle: 120 }), 100);
        }
        // EFEK: EPIC (700+)
        else if (result >= 700) {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#a855f7', '#d8b4fe'] });
        }
        // EFEK: RARE (400+)
        else if (result >= 400) {
            confetti({ particleCount: 40, spread: 40, origin: { y: 0.8 }, colors: ['#60a5fa'] });
        }
    })
  }

  // --- 3. LOGIKA ROLL ---
  const rollNumber = useCallback(() => {
    if (cooldown > 0 || isRolling) return

    setIsRolling(true)
    setMessage('')
    setPop(false) // Reset pop sebelum roll
    setTierData({ style: 'text-white animate-spin opacity-50', label: '...' }) 

    setTimeout(async () => {
      const maxNumber = 1000
      const difficulty = 4
      const random = Math.random()
      const result = Math.floor(1 + (maxNumber - 1) * Math.pow(random, difficulty))

      // 1. Update Angka & Tier
      setNumber(result)
      
      let currentTier = { style: 'text-gray-600 scale-90', label: 'COMMON' }
      if (result === 1000) currentTier = { style: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-purple-600 drop-shadow-[0_0_35px_rgba(255,215,0,1)] text-8xl', label: '👑 GODLIKE 👑' }
      else if (result >= 900) currentTier = { style: 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)] text-8xl', label: 'LEGENDARY' }
      else if (result >= 700) currentTier = { style: 'text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.7)] text-7xl', label: 'EPIC' }
      else if (result >= 400) currentTier = { style: 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]', label: 'RARE' }
      else if (result >= 100) currentTier = { style: 'text-green-400', label: 'UNCOMMON' }
      
      setTierData(currentTier)

      // 2. TRIGGER EFEK SEGERA (Sync)
      triggerVisualEffects(result)

      // 3. Logic Database & Collection
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

        if (error) console.error('GAGAL UPDATE DB:', error.message)
      }

      setIsRolling(false)
      setCooldown(3) 
    }, 500)
  }, [cooldown, isRolling, user.id, highScore, collection]) 

  // --- 4. AUTO ROLL ---
  useEffect(() => {
    if (isAutoRolling && cooldown === 0 && !isRolling) {
      rollNumber()
    }
  }, [isAutoRolling, cooldown, isRolling, rollNumber])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden ${shake ? 'animate-rumble' : ''}`}>
      
      {flash && <div className="animate-flash"></div>}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

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
        <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded shadow-lg">
            <p className="text-xs text-gray-500 uppercase tracking-widest">High Score</p>
            <p className="text-xl font-mono text-yellow-500">{highScore}</p>
        </div>
        
        <button 
            onClick={() => setIsLibraryOpen(true)}
            className="bg-indigo-900 border border-indigo-500 px-4 py-2 rounded shadow-lg hover:bg-indigo-800 transition flex flex-col justify-center"
        >
            <p className="text-xs text-indigo-300 uppercase tracking-widest">Library</p>
            <p className="text-sm font-bold text-white">
                {collection.length} / 1000
            </p>
        </button>
      </div>

      {/* Main Game Area */}
      <div className="z-10 flex flex-col items-center justify-center h-64 w-full">
        <p className="text-sm font-bold tracking-[0.3em] text-gray-500 mb-2 h-6">
            {isRolling ? 'ROLLING...' : tierData.label}
        </p>

        {/* PERBAIKAN CSS: Hilangkan transition saat result muncul agar SNAPPY/CEPAT */}
        <h1 className={`
            font-black font-mono transform 
            ${isRolling 
                ? 'text-6xl text-white opacity-50 blur-sm transition-all duration-300' // Saat rolling pelan
                : `text-7xl ${tierData.style} ${pop ? 'scale-125 duration-75' : 'scale-100 duration-300'} transition-transform` // Saat muncul: INSTAN
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

      <p className="z-10 mt-8 text-gray-600 text-xs font-mono">
        RNG System: Exponential Decay (Diff: 4)
      </p>
    </div>
  )
}