'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import AuthForm from '../components/AuthForm'
import GachaGame from '../components/GachaGame'

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cek sesi saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listener perubahan auth (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
  }

  return (
    <main>
      {!session ? (
        <AuthForm />
      ) : (
        <GachaGame session={session} />
      )}
    </main>
  )
}