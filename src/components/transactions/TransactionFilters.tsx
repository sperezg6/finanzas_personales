import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { IoChevronDown, IoCheckmark } from 'react-icons/io5'
import { useState } from 'react'

interface DateRange {
    startDate: Date
    endDate: Date
}
  


interface TransactionFiltersProps {
    dateRange: DateRange
    onDateRangeChange: (range: DateRange) => void
    selectedPaymentMethods: string[]
    onPaymentMethodsChange: (methods: string[]) => void
    selectedCategories: string[]
    onCategoriesChange: (categories: string[]) => void
    categories: {[key: string]: string}
}




const PAYMENT_METHODS = [
    { value: 'cash', label: 'Efectivo' },
    { value: 'credit_card', label: 'Tarjeta' },
    { value: 'debit_card', label: 'Tarjeta de débito' },
    { value: 'transfer', label: 'Transferencia' }
  ]



  export default function TransactionFilters({
    dateRange,
    onDateRangeChange,
    selectedPaymentMethods,
    onPaymentMethodsChange,
    selectedCategories,
    onCategoriesChange,
    categories
  }: TransactionFiltersProps) {
    const [showPaymentMethods, setShowPaymentMethods] = useState(false)
    const [showCategories, setShowCategories] = useState(false)
  
    const handlePaymentMethodToggle = (method: string) => {
      const updated = selectedPaymentMethods.includes(method)
        ? selectedPaymentMethods.filter(m => m !== method)
        : [...selectedPaymentMethods, method]
      onPaymentMethodsChange(updated)
    }
  
    const handleCategoryToggle = (categoryId: string) => {
      const updated = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(c => c !== categoryId)
        : [...selectedCategories, categoryId]
      onCategoriesChange(updated)
    }
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rango de Fechas
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={format(dateRange.startDate, 'yyyy-MM-dd')}
                onChange={(e) => onDateRangeChange({
                  ...dateRange,
                  startDate: new Date(e.target.value)
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <input
                type="date"
                value={format(dateRange.endDate, 'yyyy-MM-dd')}
                onChange={(e) => onDateRangeChange({
                  ...dateRange,
                  endDate: new Date(e.target.value)
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
  
          {/* Payment Method Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <button
              onClick={() => setShowPaymentMethods(!showPaymentMethods)}
              className="relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <span className="block truncate">
                {selectedPaymentMethods.length === 0 
                  ? 'Todos los métodos' 
                  : `${selectedPaymentMethods.length} seleccionado${selectedPaymentMethods.length > 1 ? 's' : ''}`}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <IoChevronDown className="h-5 w-5 text-gray-400" />
              </span>
            </button>
  
            {showPaymentMethods && (
              <div className="absolute left-0 z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                <ul className="max-h-60 overflow-auto rounded-md py-1 text-base shadow-xs focus:outline-none sm:text-sm">
                  {PAYMENT_METHODS.map((method) => (
                    <li
                      key={method.value}
                      onClick={() => handlePaymentMethodToggle(method.value)}
                      className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-50"
                    >
                      <span className="block truncate">{method.label}</span>
                      {selectedPaymentMethods.includes(method.value) && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <IoCheckmark className="h-5 w-5 text-blue-600" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
  
          {/* Category Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            >
              <span className="block truncate">
                {selectedCategories.length === 0 
                  ? 'Todas las categorías' 
                  : `${selectedCategories.length} seleccionada${selectedCategories.length > 1 ? 's' : ''}`}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <IoChevronDown className="h-5 w-5 text-gray-400" />
              </span>
            </button>
  
            {showCategories && (
              <div className="absolute left-0 z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                <ul className="max-h-60 overflow-auto rounded-md py-1 text-base shadow-xs focus:outline-none sm:text-sm">
                  {Object.entries(categories).map(([id, name]) => (
                    <li
                      key={id}
                      onClick={() => handleCategoryToggle(id)}
                      className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-50"
                    >
                      <span className="block truncate">{name}</span>
                      {selectedCategories.includes(id) && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <IoCheckmark className="h-5 w-5 text-blue-600" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }