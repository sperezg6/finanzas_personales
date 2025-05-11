"use client"

import { useEffect, useState } from 'react'
import { Transaction } from '@/types/database'
import { format, eachDayOfInterval, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface TransactionChartProps {
  transactions: Transaction[]
  dateRange: {
    startDate: Date
    endDate: Date
  }
  loading: boolean
}

interface PaymentMethodData {
  [date: string]: {
    cash: number
    credit_card: number
    debit_card: number
    transfer: number
  }
}

const PAYMENT_METHOD_COLORS = {
  cash: '#8884d8',
  credit_card: '#82ca9d',
  debit_card: '#ffc658',
  transfer: '#ffc658',

}

const PAYMENT_METHOD_LABELS = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  check: 'Cheque'
}

export default function TransactionChart({ transactions, dateRange, loading }: TransactionChartProps) {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  })

  useEffect(() => {
    if (loading || transactions.length === 0) return

    // Get all days in the date range
    const days = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate
    })

    // Initialize data structure
    const paymentMethodData: PaymentMethodData = {}
    days.forEach(day => {
      const dateString = format(day, 'yyyy-MM-dd')
      paymentMethodData[dateString] = {
        cash: 0,
        credit_card: 0,
        debit_card: 0,
        transfer: 0,
      }
    })

    // Aggregate transaction data
    transactions
      .filter(tx => tx.transaction_type === 'expense') // Only show expenses
      .forEach(tx => {
        const date = new Date(tx.transaction_date)
        const dateString = format(date, 'yyyy-MM-dd')
        
        if (paymentMethodData[dateString]) {
          const paymentMethod = tx.payment_method.toLowerCase()
          if (paymentMethod in paymentMethodData[dateString]) {
            paymentMethodData[dateString][paymentMethod as keyof typeof paymentMethodData[string]] += tx.amount
          }
        }
      })

    // Prepare chart data
    const labels = days.map(day => format(day, 'd MMM', { locale: es }))
    
    const datasets = Object.keys(PAYMENT_METHOD_COLORS).map(method => ({
      label: PAYMENT_METHOD_LABELS[method as keyof typeof PAYMENT_METHOD_LABELS],
      data: days.map(day => {
        const dateString = format(day, 'yyyy-MM-dd')
        return paymentMethodData[dateString][method as keyof typeof paymentMethodData[string]]
      }),
      backgroundColor: PAYMENT_METHOD_COLORS[method as keyof typeof PAYMENT_METHOD_COLORS],
      borderColor: PAYMENT_METHOD_COLORS[method as keyof typeof PAYMENT_METHOD_COLORS],
      borderWidth: 1
    }))

    setChartData({ labels, datasets })
  }, [transactions, dateRange, loading])

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('es-MX', { 
                style: 'currency', 
                currency: 'MXN' 
              }).format(context.parsed.y)
            }
            return label
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('es-MX', { 
              style: 'currency', 
              currency: 'MXN',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value as number)
          }
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No hay transacciones para el período seleccionado
      </div>
    )
  }

  return (
    <div className="h-96">
      <Bar data={chartData} options={options} />
    </div>
  )
}