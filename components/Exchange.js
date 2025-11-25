'use client'
import { useState, useEffect } from 'react'

export default function Exchange({ isOpen, onClose, collection, onExchange }) {
  if (!isOpen) return null

  // Syarat Penukaran (Resep)
  const REQUIREMENTS = [
    { label: 'Common (1-99)', min: 1, max: 99, req: 30, color: 'text-gray-400', bg: 'bg-gray-700' },
    { label: 'Uncommon (100-399)', min: 100, max: 399, req: 20, color: 'text-green-400', bg: 'bg-green-900' },
    { label: 'Rare (400-699)', min: 400, max: 699, req: 10, color: 'text-blue-400', bg: 'bg-blue-900' },
    { label: 'Epic (700-899)', min: 700, max: 899, req: 5, color: 'text-purple-400', bg: 'bg-purple-900' },
    { label: 'Legendary (900-999)', min: 900, max: 999, req: 1, color: 'text-red-500', bg: 'bg-red-900' },
  ]

  // Hitung berapa angka yang dimiliki pemain untuk setiap kategori
  const countOwned = (min, max) => {
    return collection.filter(num => num >= min && num <= max).length
  }

  // Cek apakah semua syarat terpenuhi
  const canExchange = REQUIREMENTS.every(r => countOwned(r.min, r.max) >= r.req)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border-2 border-yellow-600 w-full max-w-md rounded-xl shadow-[0_0_50px_rgba(234,179,8,0.2)] flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-yellow-500 tracking-widest uppercase">The Forge</h2>
          <p className="text-xs text-gray-400 mt-1">Korbankan koleksimu demi Mythical Gem</p>
        </div>

        {/* List Requirement */}
        <div className="p-6 space-y-4">
          {REQUIREMENTS.map((tier, idx) => {
            const owned = countOwned(tier.min, tier.max)
            const isComplete = owned >= tier.req
            const progress = Math.min((owned / tier.req) * 100, 100)

            return (
              <div key={idx} className="relative">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className={`${tier.color} font-bold`}>{tier.label}</span>
                  <span className={isComplete ? 'text-green-400' : 'text-gray-500'}>
                    {owned} / {tier.req}
                  </span>
                </div>
                {/* Progress Bar Background */}
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                  {/* Progress Bar Fill */}
                  <div 
                    className={`h-full transition-all duration-500 ${isComplete ? 'bg-yellow-500 shadow-[0_0_10px_gold]' : tier.bg}`} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-950 border-t border-gray-800 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded text-sm text-gray-400 hover:bg-gray-800 transition"
          >
            Batal
          </button>
          <button 
            onClick={onExchange}
            disabled={!canExchange}
            className={`
              flex-2 px-8 py-3 rounded font-bold text-sm tracking-wider uppercase transition-all
              ${canExchange 
                ? 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-pulse' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
            `}
          >
            {canExchange ? '🔥 TEMPA ITEM 🔥' : 'Bahan Kurang'}
          </button>
        </div>
      </div>
    </div>
  )
}