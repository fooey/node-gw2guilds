export const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="mx-auto mt-4 flex flex-col flex-wrap ">{children}</section>
);

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mb-4 w-full border-b pb-2 text-2xl">{children}</h2>
);
