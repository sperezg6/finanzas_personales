"use client"

import AppLayout from '@/components/layout/AppLayout'
import { useEffect, useState } from 'react'
import { format, startOfDay, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types/database'
import App from 'next/app'
import TransactionChart from '@/components/transactions/TransactionChart'
import TransactionFilters from '@/components/transactions/TransactionFilters'

interface DateRange {
    startDate: Date
    endDate: Date
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState<DateRange>({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    })
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [categories, setCategories] = useState<{[key: string]: string}>({})
  
    useEffect(() => {
      fetchCategories()
    }, [])
  
    useEffect(() => {
      fetchTransactions()
    }, [dateRange, selectedPaymentMethods, selectedCategories])
  
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
      
      if (error) {
        console.error('Error fetching categories:', error)
        return
      }
  
      const categoryMap = data.reduce((map: {[key: string]: string}, category) => {
        map[category.id] = category.name
        return map
      }, {})
      
      setCategories(categoryMap)
    }
  
    const fetchTransactions = async () => {
      setLoading(true)
  
      const startDate = format(startOfDay(dateRange.startDate), 'yyyy-MM-dd')
      const endDate = format(endOfDay(dateRange.endDate), 'yyyy-MM-dd')
  
      let query = supabase
        .from('transactions')
        .select('*')
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)
        .order('transaction_date', { ascending: false })
  
      if (selectedPaymentMethods.length > 0) {
        query = query.in('payment_method', selectedPaymentMethods)
      }
  
      if (selectedCategories.length > 0) {
        query = query.in('category_id', selectedCategories)
      }
  
      const { data, error } = await query
  
      if (error) {
        console.error('Error fetching transactions:', error)
        setLoading(false)
        return
      }
  
      setTransactions(data || [])
      setLoading(false)
    }
    
    return (
        <AppLayout>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold'>Transacciones</h1>
                <p className='text-gray-500'>Analiza tus movimientos financieros</p>
            </div>

            <div className="grid gap-6 mb-3">
            {/* Filters Section */}
                <TransactionFilters
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    selectedPaymentMethods={selectedPaymentMethods}
                    onPaymentMethodsChange={setSelectedPaymentMethods}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    categories={categories}
                />
            </div>

            {/* Recent Transactions Section */}


            {/* Chart Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium mb-4">Gastos por Día y Método de Pago</h2>
                <TransactionChart 
                    transactions={transactions} 
                    dateRange={dateRange}
                    loading={loading}
                />
            </div>



        </AppLayout>
    )
}

