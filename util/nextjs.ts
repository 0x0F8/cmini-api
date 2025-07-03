import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function isServer() {
  return typeof window === "undefined";
}

export function isAppBuilding() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function objectFromCookies(
  cookies: ReadonlyRequestCookies,
  prefix?: string,
  delimiter = "-",
) {
  return cookies.getAll().reduce((prev, current) => {
    if (typeof prefix !== "undefined") {
      if (current.name.startsWith(prefix + delimiter)) {
        const name = current.name.substring(
          current.name.indexOf(delimiter) + 1,
        );
        prev[name] = current.value;
      }
    } else {
      prev[current.name] = current.value;
    }

    return prev;
  }, {});
}
