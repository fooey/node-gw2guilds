import { AiFillGithub } from 'react-icons/ai';
import { MdCopyright, MdEmail } from 'react-icons/md';

export const Footer = () => {
  return (
    <footer className="mt-8 w-full bg-slate-100">
      <div className="mx-auto my-8 flex max-w-3xl flex-col place-content-center gap-2 text-center text-xs text-slate-500">
        <div className="flex flex-row items-center justify-center">
          <div className="flex w-64 flex-col items-center justify-center">
            <MdEmail className="text-6xl" />
            <p>
              Please send comments and bugs to{' '}
              <a className="whitespace-nowrap" href="mailto:website@gw2w2w.com">
                website@gw2w2w.com
              </a>
            </p>
          </div>
          <div className="flex w-64 flex-col items-center justify-center">
            <AiFillGithub className="text-6xl" />
            <p>
              Source available at{' '}
              <a className="whitespace-nowrap" href="https://github.com/fooey/node-gw2guilds">
                github.com/fooey/node-gw2guilds
              </a>
            </p>
          </div>
        </div>

        <p>
          <MdCopyright className="relative -top-1 m-0 inline p-0" /> 2013 ArenaNet, Inc. All rights reserved. NCsoft,
          the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of
          the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of
          NCsoft Corporation. All other trademarks are the property of their respective owners.
        </p>
      </div>
    </footer>
  );
};
