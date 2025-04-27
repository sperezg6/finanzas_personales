"use client"

import AppLayout from '@/components/layout/AppLayout';
import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { supabase } from '@/lib/supabase'


export default function Home() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">👋 Hola, Santiago!</h1>
        <p className="text-gray-600">Aquí tienes un resumen de tus finanzas personales</p>
      </div>


      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mb-5">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Gastos</h2>
          <div className="text-3xl font-bold">$0.00</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Ingresos</h2>
          <div className="text-3xl font-bold">$0.00</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Ahorro</h2>
          <div className="text-3xl font-bold">$0.00</div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-medium mb-4">Tu flujo de dinero</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p className="text-center">Aquí irá un gráfico de tu flujo de dinero</p>
        </div>
      </div>
    </AppLayout>
  );
}