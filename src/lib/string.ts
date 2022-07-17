export const slugify = (str: string) => {
  return encodeURIComponent(str.replace(/ /g, '-')).toLowerCase();
};

export const deslugify = (str: string) => {
  return decodeURIComponent(str).replace(/-/g, ' ');
};
