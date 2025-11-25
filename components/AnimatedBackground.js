'use client'

export default function AnimatedBackground({ tier = 'common' }) {
  const backgrounds = {
    jackpot: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-yellow-800 to-black animate-gradient-flow" />
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-600/30 via-transparent to-yellow-600/30 animate-gradient-flow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </>
    ),
    godlike: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-black animate-gradient-flow" />
        <div className="absolute inset-0 bg-gradient-to-tl from-yellow-600/20 via-transparent to-purple-600/20 animate-gradient-flow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-purple-500 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-pink-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '0.7s' }} />
        </div>
      </>
    ),
    legendary: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black animate-gradient-flow" />
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-600/20 via-transparent to-red-600/20 animate-gradient-flow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-red-600 rounded-full blur-[120px] animate-pulse -translate-x-1/2 -translate-y-1/2" />
        </div>
      </>
    ),
    mythic: (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-red-950 to-black animate-gradient-flow" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-red-500 rounded-full blur-[100px] animate-pulse" />
        </div>
      </>
    ),
    epic: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-gray-900 to-black animate-gradient-flow" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-purple-600 rounded-full blur-[90px] animate-pulse" />
        </div>
      </>
    ),
    rare: (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900 to-black animate-gradient-flow" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-blue-600 rounded-full blur-[80px] animate-pulse -translate-x-1/2 -translate-y-1/2" />
        </div>
      </>
    ),
    common: (
      <div className="absolute inset-0 bg-black" />
    ),
  }

  return (
    <div className="absolute inset-0 overflow-hidden transition-opacity duration-1000">
      {backgrounds[tier] || backgrounds.common}
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  )
}
