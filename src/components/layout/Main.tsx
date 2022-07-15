import Link from 'next/link';
import React from 'react';
import { IReactHTMLNode } from '~/types/ReactHTMLElement';
import { Footer } from './Footer';

export const LayoutMain: React.FC<IReactHTMLNode<HTMLDivElement>> = ({ children, className, ...attrs }) => {
  return (
    <div
      {...attrs}
      className={`${className} flex min-h-screen min-w-full flex-col items-center  justify-between bg-slate-50`}
    >
      <main className="w-full flex-auto">
        <h1 className="my-8 text-center text-3xl font-bold underline">
          <Link href="/">GW2 Guild Emblems</Link>
        </h1>
        {children}
      </main>
      <Footer />
    </div>
  );
};
