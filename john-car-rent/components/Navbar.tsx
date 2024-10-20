import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import { Button } from '@mui/material';
import UserAccountnav from './UserAccountnav';
import Link from 'next/link';
import Image from 'next/image';

const NavBar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div
      className='bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'
      style={{ '--navbar-height': '64px' } as React.CSSProperties} // Adjust as per your design
    >
      <div className='container flex items-center justify-between px-4 md:px-8'>
        <Link href='/' aria-label='Home' className='flex items-center'>
          <Image
            src='/logo.svg'
            alt='CarHub logo'
            width={118}
            height={18}
            className='object-contain'
          />
        </Link>
        <div className='flex-1' />

        <Link href='/Cart' aria-label='Go to Cart'>
          <Button variant="contained" color="success" sx={{ mr: 1 }}>
            Cart
          </Button>
        </Link>

        {session?.user ? (
          <UserAccountnav />
        ) : (
          <Link href='/sign-in' aria-label='Sign in'>
            <Button variant="contained" color="primary">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export { NavBar };
