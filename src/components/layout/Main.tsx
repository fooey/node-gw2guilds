import Link from 'next/link';
import React from 'react';
import { MdLayers, MdSearch } from 'react-icons/md';
import { IReactHTMLNode } from '~/types/ReactHTMLElement';
import { Footer } from './Footer';

export const LayoutMain: React.FC<IReactHTMLNode<HTMLDivElement>> = ({ children, className, ...attrs }) => {
  return (
    <div
      {...attrs}
      className={`${className} flex min-h-screen min-w-full flex-col items-center justify-between bg-slate-50`}
    >
      <main className="w-full flex-auto">
        <header className="mb-2 flex flex-row items-center justify-between gap-4 border-b bg-white p-4 px-6 ">
          <h1 className="flex flex-auto flex-row items-center gap-4 text-xl">
            <MdLayers className="text-4xl text-slate-400" />
            <Link href="/">
              <a className="font-light tracking-tight">gw2w2w.com</a>
            </Link>
          </h1>
          <form action="/" className="flex flex-row items-center">
            <input type={'search'} name="q" className="h-10 rounded-l-xl border-slate-500 focus:border-slate-500" />
            <button className="m-0 h-10 rounded-r-xl bg-slate-500 p-1">
              <MdSearch className="  text-4xl text-white" />
            </button>
          </form>
        </header>
        {children}
      </main>
      <Footer />
    </div>
  );
};
