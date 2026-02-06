// Utility functions for locale management

export const setLocalePreference = (locale: string) => {
  // Set cookie to remember user's locale preference
  document.cookie = `locale-preference=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

  // Redirect to the new locale
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split("/");

  // Remove the current locale if it exists
  if (pathParts[1] === "en" || pathParts[1] === "bn") {
    pathParts.splice(1, 1);
  }

  // Add the new locale
  const newPath = `/${locale}${pathParts.join("/")}`;
  window.location.href = newPath;
};

export const getLocaleFromPath = (pathname: string): string => {
  const pathParts = pathname.split("/");
  const locale = pathParts[1];
  return locale === "en" || locale === "bn" ? locale : "en";
};

export const removeLocaleFromPath = (pathname: string): string => {
  const pathParts = pathname.split("/");
  if (pathParts[1] === "en" || pathParts[1] === "bn") {
    pathParts.splice(1, 1);
  }
  return pathParts.join("/") || "/";
};

export const addLocaleToPath = (pathname: string, locale: string): string => {
  const pathWithoutLocale = removeLocaleFromPath(pathname);
  return `/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
};
