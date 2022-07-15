import { IReactHTMLNode } from '~/types/ReactHTMLElement';

export const Section: React.FC<IReactHTMLNode<HTMLDivElement>> = ({ children, className, ...attrs }) => (
  <section {...attrs} className={`${className} mx-auto mt-4 flex flex-col flex-wrap`}>
    {children}
  </section>
);

export const SectionTitle: React.FC<IReactHTMLNode<HTMLHeadingElement>> = ({ children, className, ...attrs }) => (
  <h2 {...attrs} className={`${className} mb-4 w-full border-b pb-2 text-2xl`}>
    {children}
  </h2>
);
