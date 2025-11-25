'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import Library from './Library'
import Exchange from './Exchange'
import AnimatedBackground from './AnimatedBackground'
import ParticleBackground from './ParticleBackground'
import confetti from 'canvas-confetti'

export default function GachaGame({ session }) {
  const [number, setNumber] = useState(null)
  const [highScore, setHighScore] = useState(0)
  const [collection, setCollection] = useState([]) 
  const [itemsOwned, setItemsOwned] = useState(0)
  
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [isExchangeOpen, setIsExchangeOpen] = useState(false) 

  const [isRolling, setIsRolling] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [message, setMessage] = useState('')
  const [tierData, setTierData] = useState({ style: 'text-gray-500', label: '' })
  const [isAutoRolling, setIsAutoRolling] = useState(false)
  
  // State visual
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState(false)
  const [pop, setPop] = useState(false)
  const [bgTier, setBgTier] = useState('common')
  const [showParticles, setShowParticles] = useState(false)

  const user = session.user
  const displayUsername = user.email.split('@')[0]
  const confettiIntervalRef = useRef(null)

  // --- 1. LOAD DATA ---
  useEffect(() => {
    async function getProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('highest_roll, collection, items_owned') 
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') console.error('Error loading profile:', error.message)

      if (data) {
        setHighScore(data.highest_roll || 0)
        setCollection(data.collection || [])
        setItemsOwned(data.items_owned || 0)
      } else {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id, 
            username: displayUsername, 
            highest_roll: 0, 
            collection: [],
            items_owned: 0
          }])
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

  // --- AUTO REMOVE FLASH ELEMENT AFTER ANIMATION ---
  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => {
        setFlash(false)
      }, 3100) // Sedikit lebih lama dari durasi animasi
      return () => clearTimeout(timer)
    }
  }, [flash])

  // --- VISUAL EFFECTS ---
  const triggerVisualEffects = (result, isSuper = false) => {
    setShake(false); setFlash(false); setPop(false);
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current)

    requestAnimationFrame(() => {
        setPop(true) 
        
        // --- EFEK SUPER ROLL (1000 - 10000) ---
        if (isSuper) {
            setShake(true) // Selalu getar kalau super roll
            
            // Konfigurasi Confetti Super
            const superColors = ['#00FFFF', '#FF00FF', '#FFFF00', '#FFFFFF']; // Cyan, Magenta, Yellow, White
            
            if (result === 10000) {
                // INFINITY: THE ULTIMATE EFFECT
                setFlash(true)
                setTimeout(() => {
                  const duration = 8000;
                  const animationEnd = Date.now() + duration;
                  
                  confettiIntervalRef.current = setInterval(function() {
                      const timeLeft = animationEnd - Date.now();
                      if (timeLeft <= 0) return clearInterval(confettiIntervalRef.current);
                      
                      // Spiral Galaxy Effect
                      confetti({ particleCount: 50, startVelocity: 60, spread: 360, ticks: 100, origin: { x: 0.5, y: 0.5 }, colors: superColors, shapes: ['star'], scalar: 2 });
                  }, 200);
                }, 500);
            } else if (result >= 7500) {
                // OMEGA
                setFlash(true)
                setTimeout(() => {
                  confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 }, colors: superColors, shapes: ['star'], scalar: 1.5, startVelocity: 50 });
                }, 400);
            } else {
                // HYPER - MASTER
                setTimeout(() => {
                  confetti({ particleCount: 100, spread: 100, origin: { y: 0.7 }, colors: superColors, shapes: ['circle', 'square'], scalar: 1.2 });
                }, 300);
            }
            return; // Keluar dari fungsi agar tidak menimpa efek biasa
        }

        // --- EFEK BIASA (1 - 1000) ---
        const fireCannon = (angle, originX, opts = {}) => {
            confetti({ angle, spread: 55, particleCount: 100, origin: { x: originX, y: 0.8 }, startVelocity: 50, ticks: 200, gravity: 1.2, ...opts });
        }

        if (result === 777) {
            setFlash(true); setShake(true);
            setTimeout(() => {
              const duration = 5000; const animationEnd = Date.now() + duration; const goldColors = ['#FFD700', '#FFA500', '#DAA520', '#FFE135'];
              confettiIntervalRef.current = setInterval(function() {
                  const timeLeft = animationEnd - Date.now(); if (timeLeft <= 0) return clearInterval(confettiIntervalRef.current);
                  confetti({ particleCount: 20, angle: 60, spread: 80, origin: { x: 0, y: 0.8 }, colors: goldColors, shapes: ['circle'], scalar: 1.5, startVelocity: 60 });
                  confetti({ particleCount: 20, angle: 120, spread: 80, origin: { x: 1, y: 0.8 }, colors: goldColors, shapes: ['circle'], scalar: 1.5, startVelocity: 60 });
              }, 150);
            }, 500);
        } else if (result === 1000) {
            if (result >= 700) setShake(true)
            setTimeout(() => {
              const duration = 4000; const animationEnd = Date.now() + duration;
              confettiIntervalRef.current = setInterval(function() {
                  const timeLeft = animationEnd - Date.now(); if (timeLeft <= 0) return clearInterval(confettiIntervalRef.current);
                  confetti({ particleCount: 50, startVelocity: 30, spread: 360, ticks: 60, origin: { x: Math.random(), y: Math.random() * 0.3 }, colors: ['#FFD700', '#FFFFFF', '#FF0000'], shapes: ['star', 'circle'] });
              }, 200);
            }, 500);
        } else if (result >= 900) {
            setFlash(true); setShake(true);
            setTimeout(() => {
              fireCannon(60, 0); fireCannon(120, 1); 
              setTimeout(() => { confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#ef4444', '#b91c1c', '#FFD700'], shapes: ['star'], startVelocity: 40, gravity: 0.8 }); }, 200);
            }, 400);
        } else if (result >= 700) {
            setShake(true);
            setTimeout(() => {
              const epicOpts = { particleCount: 80, spread: 80, origin: { y: 0.7 }, colors: ['#a855f7', '#d8b4fe'] };
              confetti(epicOpts); setTimeout(() => confetti({ ...epicOpts, startVelocity: 45 }), 150);
            }, 300); 
        } else if (result >= 400) {
            setTimeout(() => {
              confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 }, colors: ['#60a5fa'], startVelocity: 35 });
            }, 200);
        }
    })
  }

  // --- LOGIKA EXCHANGE ---
  const handleExchange = async () => {
    const COSTS = [
        { min: 1, max: 99, req: 30 },
        { min: 100, max: 399, req: 20 },
        { min: 400, max: 699, req: 10 },
        { min: 700, max: 899, req: 5 },
        { min: 900, max: 999, req: 1 },
    ]
    let newCollection = [...collection]
    let canAfford = true
    for (const cost of COSTS) {
        const available = newCollection.filter(n => n >= cost.min && n <= cost.max)
        if (available.length < cost.req) { canAfford = false; break }
        const toBurn = available.slice(0, cost.req)
        newCollection = newCollection.filter(n => !toBurn.includes(n))
    }
    if (!canAfford) { alert("Bahan tidak cukup!"); return }

    const newItemCount = itemsOwned + 1
    setCollection(newCollection)
    setItemsOwned(newItemCount)
    setMessage('🔥 ITEM CRAFTED! 🔥')
    setIsExchangeOpen(false) 
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#FFD700', '#FFFFFF'], shapes: ['circle'], scalar: 2 });
    await supabase.from('profiles').update({ collection: newCollection, items_owned: newItemCount }).eq('id', user.id)
  }

  // --- LOGIKA SUPER ROLL (NEW) ---
  const superRollNumber = useCallback(async () => {
    if (isRolling) return
    if (itemsOwned < 1) {
        setMessage('🚫 BUTUH 1 ITEM! 🚫')
        setTimeout(() => setMessage(''), 2000)
        return
    }

    setIsRolling(true); setMessage(''); setPop(false); 
    setTierData({ style: 'text-cyan-300 animate-pulse', label: 'CHARGING SUPER...' }); 
    setBgTier('godlike')
    setShowParticles(true)

    // Kurangi Item Dulu (Optimistic UI)
    const newItemsOwned = itemsOwned - 1
    setItemsOwned(newItemsOwned)

    setTimeout(async () => {
        // RNG Super Roll: 1000 - 10000
        // Linear Random (Lebih Fair karena berbayar)
        const result = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
        // const result = 9000;

        setNumber(result)

        // --- TIER SYSTEM KHUSUS SUPER ---
        let currentTier = { style: 'text-white', label: 'SUPER' }
        let newBg = 'bg-black'

        if (result === 10000) {
            currentTier = { style: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-fuchsia-500 drop-shadow-[0_0_50px_rgba(255,255,255,1)] text-9xl font-black animate-bounce', label: '♾️ INFINITY ♾️' }
            setBgTier('jackpot')
        } else if (result >= 7500) {
            currentTier = { style: 'text-fuchsia-400 drop-shadow-[0_0_25px_rgba(232,121,249,0.8)] text-8xl font-black', label: 'Ω OMEGA Ω' }
            setBgTier('godlike')
        } else if (result >= 5000) {
            currentTier = { style: 'text-pink-400 drop-shadow-[0_0_20px_rgba(244,114,182,0.6)] text-8xl', label: 'MASTER' }
            setBgTier('legendary')
        } else if (result >= 2500) {
            currentTier = { style: 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)] text-8xl', label: 'ULTRA' }
            setBgTier('epic')
        } else {
            // 1000 - 2499
            currentTier = { style: 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] text-7xl', label: 'HYPER' }
            setBgTier('rare')
        }

        setTierData(currentTier)
        setShowParticles(true)
        triggerVisualEffects(result, true)

        // Logic Save
        let newHighScore = highScore; let newCollection = [...collection]; let needUpdate = false; let statusMsg = 'SUPER!'
        if (result > highScore) { newHighScore = result; statusMsg = '🎉 NEW RECORD! 🎉'; needUpdate = true }
        if (!collection.includes(result)) { newCollection.push(result); if (statusMsg === 'SUPER!') statusMsg = '✨ NEW COLLECTION! ✨'; needUpdate = true }
        
        // Selalu update karena item berkurang
        setMessage(statusMsg); setHighScore(newHighScore); setCollection(newCollection);
        const { error } = await supabase.from('profiles').update({ highest_roll: newHighScore, collection: newCollection, items_owned: newItemsOwned }).eq('id', user.id)
        if (error) console.error('GAGAL SUPER ROLL:', error.message)

        setIsRolling(false)
        // Super roll tidak memicu cooldown tombol biasa (opsional, tapi biar enak grinding)
    }, 1000) // Durasi animasi super lebih lama sedikit (1 detik)
  }, [isRolling, itemsOwned, highScore, collection, user.id])


  // --- LOGIKA NORMAL ROLL ---
  const rollNumber = useCallback(() => {
    if (cooldown > 0 || isRolling) return
    setIsRolling(true); setMessage(''); setPop(false); setTierData({ style: 'text-white animate-spin opacity-50', label: '...' }); setBgTier('common'); setShowParticles(false);

    setTimeout(async () => {
      const maxNumber = 1000; const difficulty = 4; const random = Math.random();
      const result = Math.floor(1 + (maxNumber - 1) * Math.pow(random, difficulty)) 
      
      setNumber(result)

      let currentTier = { style: 'text-gray-600 scale-90', label: 'COMMON' }
      if (result === 777) { 
        currentTier = { style: 'text-yellow-300 drop-shadow-[0_0_15px_rgba(255,215,0,1)] text-9xl font-black tracking-tighter animate-bounce', label: '🎰 LUCKY JACKPOT 🎰' }
        setBgTier('jackpot')
        setShowParticles(true)
      }
      else if (result === 1000) { 
        currentTier = { style: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-500 to-purple-600 drop-shadow-[0_0_35px_rgba(255,215,0,1)] text-8xl', label: '👑 GODLIKE 👑' }
        setBgTier('godlike')
        setShowParticles(true)
      } 
      else if (result >= 900) { 
        currentTier = { style: 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)] text-8xl', label: 'LEGENDARY' }
        setBgTier('legendary')
        setShowParticles(true)
      } 
      else if (result >= 800) { 
        currentTier = { style: 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.7)] text-7xl', label: 'MYTHIC' }
        setBgTier('mythic')
        setShowParticles(true)
      }
      else if (result >= 700) { 
        currentTier = { style: 'text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.7)] text-7xl', label: 'EPIC' }
        setBgTier('epic')
        setShowParticles(true)
      }
      else if (result >= 400) { 
        currentTier = { style: 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]', label: 'RARE' }
        setBgTier('rare')
      }
      else if (result >= 100) { 
        currentTier = { style: 'text-green-400', label: 'UNCOMMON' }
        setBgTier('common')
      }
      else {
        setBgTier('common')
      }
      
      setTierData(currentTier)
      triggerVisualEffects(result, false)

      let newHighScore = highScore; let newCollection = [...collection]; let needUpdate = false; let statusMsg = ''
      if (result > highScore) { newHighScore = result; statusMsg = '🎉 NEW RECORD! 🎉'; needUpdate = true }
      if (!collection.includes(result)) { newCollection.push(result); if (!statusMsg) statusMsg = '✨ NEW COLLECTION! ✨'; needUpdate = true }

      if (needUpdate) {
        setMessage(statusMsg); setHighScore(newHighScore); setCollection(newCollection);
        await supabase.from('profiles').update({ highest_roll: newHighScore, collection: newCollection }).eq('id', user.id)
      }

      setIsRolling(false); setCooldown(3)
    }, 500)
  }, [cooldown, isRolling, user.id, highScore, collection]) 

  useEffect(() => { if (isAutoRolling && cooldown === 0 && !isRolling) rollNumber() }, [isAutoRolling, cooldown, isRolling, rollNumber])
  const handleLogout = async () => { await supabase.auth.signOut() }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen text-white relative overflow-hidden ${shake ? 'animate-rumble' : ''}`}>
      <AnimatedBackground tier={bgTier} />
      <ParticleBackground tier={bgTier} isActive={showParticles} />
      {flash && <div className="animate-flash"></div>}

      <Library isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} collection={collection} />
      <Exchange isOpen={isExchangeOpen} onClose={() => setIsExchangeOpen(false)} collection={collection} onExchange={handleExchange} />

      {/* Header Info */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end">
        <span className="text-gray-400 text-sm font-mono">PLAYER: {displayUsername}</span>
        <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 bg-yellow-900/50 px-2 py-0.5 rounded border border-yellow-700" title="Mythical Gems Owned">
                <span className="text-sm">💎</span>
                <span className="text-sm font-bold text-yellow-400">{itemsOwned}</span>
            </div>
            <button onClick={handleLogout} className="text-red-500 text-xs hover:underline">LOGOUT</button>
        </div>
      </div>

      {/* Left UI */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-4">
            <div className="bg-gray-900/80 backdrop-blur border border-gray-700 px-4 py-2 rounded shadow-lg">
                <p className="text-xs text-gray-400 uppercase tracking-widest">High Score</p>
                <p className="text-xl font-mono text-yellow-500">{highScore}</p>
            </div>
            <button onClick={() => setIsLibraryOpen(true)} className="bg-indigo-900/80 backdrop-blur border border-indigo-500 px-4 py-2 rounded shadow-lg hover:bg-indigo-800 transition flex flex-col justify-center">
                <p className="text-xs text-indigo-300 uppercase tracking-widest">Library</p>
                <p className="text-sm font-bold text-white">{collection.length}</p>
            </button>
        </div>
        <button onClick={() => setIsExchangeOpen(true)} className="bg-yellow-900/80 backdrop-blur border border-yellow-500 px-4 py-2 rounded shadow-lg hover:bg-yellow-800 transition flex items-center justify-between group">
            <div className="flex flex-col items-start"><p className="text-xs text-yellow-300 uppercase tracking-widest group-hover:text-white">The Forge</p><p className="text-[10px] text-gray-300">Tukar Angka - Item</p></div><span className="text-xl ml-2 group-hover:animate-bounce">🔥</span>
        </button>
      </div>

      {/* Main Game Area */}
      <div className="z-10 flex flex-col items-center justify-center h-64 w-full">
        <p className={`text-sm font-bold tracking-[0.3em] mb-2 h-6 transition-all duration-300 ${number === 777 ? 'text-yellow-300 animate-pulse' : 'text-gray-400'}`}>
            {isRolling ? 'ROLLING...' : tierData.label}
        </p>
        
        {/* Number Display with Glow Effect */}
        <div className="relative">
          {!isRolling && number !== null && number >= 700 && (
            <div className="absolute inset-0 animate-pulse">
              <div className={`absolute inset-0 blur-3xl ${
                number === 777 || number === 1000 || number === 10000 ? 'bg-yellow-500/50' :
                number >= 900 ? 'bg-red-500/40' :
                number >= 800 ? 'bg-red-400/30' :
                'bg-purple-500/30'
              }`} />
            </div>
          )}
          <h1 className={`
            font-black font-mono transform relative z-10
            ${isRolling 
              ? 'text-6xl text-white opacity-50 blur-sm transition-all duration-300' 
              : `text-7xl ${tierData.style} ${pop ? 'scale-125 duration-75' : 'scale-100 duration-300'} transition-transform`
            }
          `}>
            {isRolling ? '???' : (number !== null ? number : 'READY')}
          </h1>
        </div>
        
        <div className="h-8 mt-4">
           {message && (
             <span className="text-yellow-300 font-bold animate-pulse text-lg drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]">
               {message}
             </span>
           )}
        </div>
      </div>

      {/* Controls Container */}
      <div className="z-10 flex flex-col items-center gap-4">
        
        {/* ROW TOMBOL UTAMA */}
        <div className="flex items-center gap-6">
            {/* Tombol Roll Biasa */}
            <button
              onClick={rollNumber}
              disabled={cooldown > 0 || isRolling}
              className={`
                w-32 h-32 rounded-full text-xl font-black tracking-wider shadow-[0_0_0_4px_rgba(255,255,255,0.1)]
                transition-all duration-200 transform active:scale-90 flex flex-col items-center justify-center relative overflow-hidden
                ${cooldown > 0 
                  ? 'bg-gray-800 text-gray-600 border-4 border-gray-700 cursor-not-allowed' 
                  : number === 777 
                    ? 'bg-yellow-600 text-white border-4 border-yellow-400 animate-pulse-glow' 
                    : 'bg-indigo-600 text-white border-4 border-indigo-400 hover:bg-indigo-500 hover:shadow-[0_0_50px_rgba(99,102,241,0.8)] hover:border-white hover:scale-110'}
              `}
            >
              {cooldown === 0 && !isRolling && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
              {cooldown > 0 ? <span className="text-4xl font-mono">{cooldown}</span> : (isRolling ? '...' : 'ROLL')}
              <span className="text-[10px] font-normal mt-1 opacity-70">Free</span>
              {isAutoRolling && <span className="absolute -top-2 -right-2 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span></span>}
            </button>

            {/* Tombol SUPER ROLL (NEW) */}
            <button
              onClick={superRollNumber}
              disabled={isRolling}
              className={`
                w-32 h-32 rounded-full text-xl font-black tracking-wider shadow-[0_0_0_4px_rgba(255,215,0,0.3)]
                transition-all duration-200 transform active:scale-90 flex flex-col items-center justify-center relative overflow-hidden
                ${itemsOwned < 1 
                  ? 'bg-gray-900 border-4 border-gray-700 text-gray-600 grayscale' 
                  : 'bg-gradient-to-br from-yellow-600 to-purple-800 border-4 border-yellow-400 text-white hover:shadow-[0_0_60px_rgba(234,179,8,0.6)] hover:scale-110 animate-gradient-flow'}
              `}
            >
               {itemsOwned >= 1 && !isRolling && (
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
               )}
               {isRolling ? '...' : 'SUPER'}
               <div className="flex items-center gap-1 mt-1 bg-black/40 px-2 rounded-full">
                 <span className="text-xs">💎</span>
                 <span className="text-xs font-bold text-yellow-300">1</span>
               </div>
            </button>
        </div>

        {/* Auto Roll Toggle */}
        <button onClick={() => setIsAutoRolling(!isAutoRolling)} className={`px-6 py-2 rounded-full font-mono text-sm font-bold border transition-all ${isAutoRolling ? 'bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-transparent border-gray-600 text-gray-500 hover:border-gray-400 hover:text-gray-300'}`}>
          AUTO ROLL: {isAutoRolling ? 'ON' : 'OFF'}
        </button>
      </div>

      <p className="z-10 mt-8 text-gray-500 text-xs font-mono mix-blend-overlay">Super Roll Range: 1000 - 10000</p>
    </div>
  )
}