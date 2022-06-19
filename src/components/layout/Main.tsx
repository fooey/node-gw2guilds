import React from 'react';
import { Footer } from './Footer';

export const LayoutMain: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex min-h-screen min-w-full flex-col place-content-center bg-slate-100">
      {children}
      <Footer />
    </main>
  );
};
