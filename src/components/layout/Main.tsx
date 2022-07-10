import Link from 'next/link';
import React from 'react';
import { Footer } from './Footer';

export const LayoutMain: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen min-w-full flex-col items-center justify-center bg-slate-50">
      <main className="grow">
        <h1 className="my-8 text-center text-3xl font-bold underline">
          <Link href="/">GW2 Guild Emblems</Link>
        </h1>
        {children}
      </main>
      <Footer />
    </div>
  );
};
