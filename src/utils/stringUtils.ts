export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const camelCase = (str: string): string =>
  str
    .replace(/[-_\s]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());

export const kebabCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, '-')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const snakeCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, '')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();

export const truncate = (str: string, maxLength: number, suffix: string = '...'): string =>
  str.length > maxLength ? str.slice(0, maxLength - suffix.length) + suffix : str;

export const padZero = (num: number, length: number = 2): string =>
  String(num).padStart(length, '0');

export const pluralize = (count: number, singular: string, plural?: string): string =>
  count === 1 ? singular : (plural ?? singular + 's');

export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
