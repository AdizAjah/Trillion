'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false) // Toggle Login/Register
  const [message, setMessage] = useState('')

  // Trik: Tambahkan domain palsu agar Supabase menganggap ini email
  const email = `${username}@game.local`

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    let error
    if (isRegister) {
      // Register
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      error = signUpError
      if (!error) setMessage('Akun dibuat! Silakan login.')
    } else {
      // Login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      error = signInError
    }

    if (error) {
      setMessage(error.message)
    } 
    setLoading(false)
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
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : (isRegister ? 'Daftar' : 'Masuk')}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-yellow-400 text-center">{message}</p>}

        <p className="mt-4 text-xs text-center text-gray-400">
          {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          <button 
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