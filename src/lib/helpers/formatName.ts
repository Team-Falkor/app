type StringTransformer = (input: string) => string;

export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (arg: T): T =>
    fns.reduce((prev, fn) => fn(prev), arg);

export const removeReleaseYearFromName: StringTransformer = (name) =>
  name.replace(/\(\d{4}\)/g, "");

export const removeSymbolsFromName: StringTransformer = (name) =>
  name.replace(/[^A-Za-z0-9 ]/g, "");

export const removeSpecialEditionFromName: StringTransformer = (name) =>
  name.replace(
    /\b(The |Digital )?(GOTY|Deluxe|Standard|Ultimate|Definitive|Enhanced|Collector's|Premium|Digital|Limited|Game of the Year|Reloaded|\d{4}) Edition\b/g,
    ""
  );

export const removeDuplicateSpaces: StringTransformer = (name) =>
  name.replace(/\s{2,}/g, " ");

export const replaceUnderscoreWithSpace: StringTransformer = (name) =>
  name.replace(/_/g, " ");

export const removeDirectorsCut: StringTransformer = (name) =>
  name.replace(/DIRECTOR'S CUT/g, "");

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
