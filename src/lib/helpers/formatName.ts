type StringTransformer = (input: string) => string;

export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (arg: T): T =>
    fns.reduce((prev, fn) => fn(prev), arg);

export const removeReleaseYearFromName: StringTransformer = (name) =>
  name.replace(/\(\d{4}\)/g, "");

export const removeSymbolsFromName: StringTransformer = (name) =>
  name.replace(/[^A-Za-z0-9À-ÖØ-öø-ÿ ]+/g, ""); // Allow letters with accents

export const removeSpecialEditionFromName: StringTransformer = (name) =>
  name.replace(
    /\b(The |Digital )?(GOTY|Deluxe|Standard|Ultimate|Definitive|Enhanced|Collector's|Premium|Digital|Limited|Game of the Year|Reloaded) Edition\b/gi,
    ""
  );

export const removeDuplicateSpaces: StringTransformer = (name) =>
  name.replace(/\s{2,}/g, " ");

export const replaceUnderscoreWithSpace: StringTransformer = (name) =>
  name.replace(/_/g, " ");

export const removeDirectorsCut: StringTransformer = (name) =>
  name.replace(/Director's Cut/gi, ""); // Case-insensitive match

export const trimName: StringTransformer = (name) => name.trim();

export const formatName = pipe<string>(
  removeReleaseYearFromName,
  removeSpecialEditionFromName,
  replaceUnderscoreWithSpace,
  removeDirectorsCut,
  removeSymbolsFromName,
  removeDuplicateSpaces,
  trimName
);
