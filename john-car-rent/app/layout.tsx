import "./globals.css";

import { Footer } from "@components/Footer";
import { NavBar } from "@components/Navbar";
import Provider from "@components/Provider";
import { Toaster } from "@components/ui/toaster";

export const metadata = {
  title: "Car Hub",
  description: "Discover world's best car showcase application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='relative'>
        <Provider>
          <main className='flex flex-col'>
          <NavBar />
          {children}
          </main>
        </Provider>
      </body>
      <Toaster />
    </html>
  );
}
