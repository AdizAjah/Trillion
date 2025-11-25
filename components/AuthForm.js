'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [message, setMessage] = useState('')

  const email = `${username}@game.local`

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Akun dibuat! Silakan login.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? 'Daftar Akun' : 'Login Game'}
        </h2>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : isRegister ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-yellow-400 text-center">{message}</p>
        )}

        <p className="mt-4 text-xs text-center text-gray-400">
          {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 underline"
          >
            {isRegister ? 'Login' : 'Daftar'}
          </button>
        </p>
      </div>
    </div>
  )
}