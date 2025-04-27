"use client"

import AppLayout from '@/components/layout/AppLayout'
import MonthSelector from '@/components/dashboard/MonthSelector'
import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth, set } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types/database'
import { setLazyProp } from 'next/dist/server/api-utils'



export default function Home() {

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)



  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)

      const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd')

      // First check if we have any transactions at all
      const { data: transactions, error: All } = await supabase
      .from('transactions')
      .select('*')

  

      console.log("Sample of all transactions:", transactions)
  

      // Fetch transactions from Supabase
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })

        console.log("Selected date range:", startDate, endDate)
        console.log('Fetched transactions:', data)

        if (error) {
          console.error('Error fetching transactions:', error)
          setLoading(false)
          return
        }

        setTransactions(data || [])

        let totalIncome = 0
        let totalExpenses = 0

        data?.forEach((transaction) => {
          if (transaction.type === 'income') {
            totalIncome += transaction.amount
          } else if (transaction.type === 'expense') {
            totalExpenses += transaction.amount
          }
        })

        setTotalIncome(totalIncome)
        setTotalExpenses(totalExpenses)
        setLoading(false)
    }
    fetchTransactions()
  }, [selectedDate])


  const handleMonthChange = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">👋 Hola, Santiago!</h1>
        <p className="text-gray-600">Aquí tienes un resumen de tus finanzas personales</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mb-5">
        <MonthSelector
          selectedDate={selectedDate}
          onChange={handleMonthChange}
        />
      </div>


      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mb-5">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Gastos</h2>
          <div className="text-3xl font-bold">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            ) : (
              `$${totalExpenses.toFixed(2)}`
            )}  
          </div>
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