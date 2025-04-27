import LoginForm from '@/components/auth/LoginForm'
import Image from 'next/image'


export default function LoginPage() {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
       {/* Left side - Login Form */}
       <div className='w-full md:w-1/2 flex items justify-center bg-gray-100 p-6'>
        <div className='w-full max-w-md mt-20'>
          <div className='text-center mb-8'>
            <h1 className="text-6xl font-bold text-black-600">SPG</h1>
            <p className="mt-2 text-gray-600">Finanzas Personales</p>
          </div>
          <div className='mt-25'>
            <LoginForm />
          </div>
        </div>
       </div>


        {/* Right side - Image */}
        <div className='hidden md:block md:w-1/2 bg-blue-600 relative'>
          <Image
            src ="/images/cover2.png"
            alt= "Personal Finance"
            fill
            style={{ objectFit: 'cover' }}
            priority
            />
        </div>
    </div>
  )
}