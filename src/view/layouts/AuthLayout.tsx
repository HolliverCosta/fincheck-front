import { Outlet } from 'react-router-dom';
import Ilustration from '../../assets/Ilustration.png';
import { Logo } from '../components/Logo';
export function AuthLayout() {
  return (
    <div className="flex h-full w-full">
      <div className="w-full h-full flex items-center justify-center flex-col gap-1 lg:w-1/2">
        <Logo className='h-6 text-gray-500' />
        <div className='w-full max-w-[504px] px-8'>
          <Outlet />
        </div>
      </div>
      <div className="w-1/2 h-full hidden justify-center items-center p-8 relative lg:flex">
        <img src={Ilustration} alt="ilustration" className='object-cover w-full h-full max-w-[656px] max-h-[960px] select-none rounded-[32px]' />
        <div className='max-w-[656px] bg-white p-10 absolute rounded-b-[32px] bottom-8 mx-8 ' >
          <Logo className='text-teal-900 h-8' />
          <p className='text-gray-700 font-medium text-xl mt-6'>
            Gerencie suas finanças pessoais de uma forma simples com o fincheck, e o melhor, totalmente de graça!
          </p>
        </div>
      </div>
    </div>
  )
}