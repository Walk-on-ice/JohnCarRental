import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import { Button } from '@mui/material';
import UserAccountnav from './UserAccountnav';
import Link from 'next/link';
import Image from 'next/image';

const NavBar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className='bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container flex items-center justify-between px-4'>
        <Link href='/' className='flex justify-center items-center'>
          <Image
            src='/logo.svg'
            alt='logo'
            width={118}
            height={18}
            className='object-contain'
          />
        </Link>
        <div className='flex-1'></div>
        <Link href='/Cart'>
          <Button variant="contained" style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
            Cart
          </Button>
        </Link>
        {session?.user ? (
          <UserAccountnav />
        ) : (
          <Link href='/sign-in'>
            <Button variant="contained" style={{ backgroundColor: 'blue', color: 'white' }}>
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export { NavBar };