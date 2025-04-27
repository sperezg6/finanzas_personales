"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IoHomeOutline, 
  IoWalletOutline, 
  IoSwapHorizontalOutline,
  IoListOutline,
  IoCalculatorOutline,
  IoPieChartOutline,
  IoSettingsOutline,
  IoLogOutOutline
} from 'react-icons/io5';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation'



export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const handleSignOut = async () => {
    console.log('Signing out...')
    await supabase.auth.signOut();
    router.push('/login');
    console.log('User signed out');

  }

  const menuItems = [
    { name: 'Dashboard', icon: <IoHomeOutline size={24} />, path: '/' },
    { name: 'Cuentas', icon: <IoWalletOutline size={24} />, path: '/accounts' },
    { name: 'Transacciones', icon: <IoSwapHorizontalOutline size={24} />, path: '/transactions' },
    { name: 'Categorias', icon: <IoListOutline size={24} />, path: '/categories' },
    { name: 'Presupuestos', icon: <IoCalculatorOutline size={24} />, path: '/budgets' },
    { name: 'Inversiones', icon: <IoPieChartOutline size={24} />, path: '/investments' },
    { name: 'Settings', icon: <IoSettingsOutline size={24} />, path: '/settings' },
  ];

  return (
    <aside className="w-16 h-screen bg-white">
      <div className="p-4">
        <Link href="/" className="text-gray-600 font-bold text-sm">
          SPG
        </Link>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link 
                href={item.path}
                className={`flex flex-col items-center py-3 px-2 relative group ${
                  isActive(item.path) 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden group-hover:block absolute left-16 bg-white px-2 py-1 text-sm whitespace-nowrap shadow-md rounded z-10">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className='p-4'>
        <button
          onClick={handleSignOut}
          className='flex flex-col items-center py-3 px-2 text-gray-700 hover:text-blue-600 w-full relative group'
        >
          <IoLogOutOutline size={24} />
          <span className="hidden group-hover:block absolute left-16 bg-white px-2 py-1 text-sm whitespace-nowrap shadow-md rounded z-10">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}