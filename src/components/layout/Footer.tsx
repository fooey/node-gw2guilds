export const Footer = () => {
  return (
    <footer className="mx-auto flex max-w-3xl flex-col place-content-center gap-2 text-center text-sm">
      <p>
        Please send comments and bugs to <a href="mailto:website@gw2w2w.com">website@gw2w2w.com</a>
      </p>
      <p>
        Source available at{' '}
        <a href="https://github.com/fooey/node-gw2guilds">https://github.com/fooey/node-gw2guilds</a>
      </p>

      <p>
        © 2013 ArenaNet, Inc. All rights reserved. NCsoft, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars
        Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, and all associated logos and designs
        are trademarks or registered trademarks of NCsoft Corporation. All other trademarks are the property of their
        respective owners.
      </p>
    </footer>
  );
};
