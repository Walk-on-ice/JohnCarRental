import { buttonVariants } from "@components/ui/button";
import Link from "next/link";
import { Hero } from "@components/Hero";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";

export default async function Home  () {
  const session = await  getServerSession(authOptions);

  return(
    <main className='overflow-hidden'>
      <Hero />
    <div>
      <Link className={buttonVariants()} href='/admin'>
        Admin
      </Link>
    </div>
    </main>
  )
}