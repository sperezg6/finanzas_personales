"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import { supabase } from '@/lib/supabase'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simple auth check
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      
      if (!data.session) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}