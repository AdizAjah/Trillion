export default function Library({ isOpen, onClose, collection }) {
    if (!isOpen) return null
  
    // Helper untuk warna (sama dengan logika Gacha)
    const getTierColor = (num) => {
      if (num === 1000) return 'bg-gradient-to-r from-yellow-300 via-red-500 to-purple-600 border-yellow-400 text-black animate-pulse'
      if (num >= 900) return 'bg-red-900 border-red-500 text-red-200 shadow-[0_0_10px_red]'
      if (num >= 700) return 'bg-purple-900 border-purple-500 text-purple-200'
      if (num >= 400) return 'bg-blue-900 border-blue-500 text-blue-200'
      if (num >= 100) return 'bg-green-900 border-green-500 text-green-200'
      return 'bg-gray-700 border-gray-600 text-gray-400' // Common
    }
  
    // Hitung persentase kelengkapan
    const progress = ((collection.length / 1000) * 100).toFixed(1)
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-gray-900 border border-gray-700 w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header Library */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
            <div>
              <h2 className="text-xl font-bold text-white">📚 Library Angka</h2>
              <p className="text-xs text-gray-400">
                Progress: <span className="text-yellow-400 font-bold">{collection.length}</span> / 1000 ({progress}%)
              </p>
            </div>
            <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
              Tutup [X]
            </button>
          </div>
  
          {/* Grid Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {Array.from({ length: 1000 }, (_, i) => {
                const num = i + 1
                const isUnlocked = collection.includes(num)
                
                return (
                  <div 
                    key={num}
                    className={`
                      aspect-square flex items-center justify-center text-xs font-mono font-bold rounded border
                      transition-all duration-300
                      ${isUnlocked 
                        ? getTierColor(num) 
                        : 'bg-black border-gray-800 text-gray-800'
                      }
                    `}
                    title={isUnlocked ? `Angka ${num}` : 'Belum ditemukan'}
                  >
                    {isUnlocked ? num : '?'}
                  </div>
                )
              })}
            </div>
          </div>
  
        </div>
      </div>
    )
  }