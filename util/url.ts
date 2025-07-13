export function parseQuery(
  url: string,
): Record<string, string | undefined | number | boolean> {
  if (!url.includes("?")) {
    return {};
  }
  const result: Record<string, string | undefined | number | boolean> = {};
  const str = url.substring(url.indexOf("?") + 1);
  for (const pair of str.split("&")) {
    const [key, value] = pair.split("=");

    if (value === "undefined" || value === "" || typeof value === "undefined") {
      result[key] = undefined;
    } else if (value === "true") {
      result[key] = true;
    } else if (value === "false") {
      result[key] = false;
    } else if (!Number.isNaN(Number(value))) {
      result[key] = Number(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function stringifyQuery(
  obj: Record<string, string | undefined | number | boolean>,
) {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    let strValue = "";
    if (typeof value === "function") return prev;
    if (typeof value !== "undefined" && value !== null) {
      strValue = String(value);
    }

    if (strValue && strValue.length > 0) {
      const prefix = prev.length > 0 ? "&" : "";
      prev += `${prefix}${key}=${strValue}`;
    }
    return prev;
  }, "");
}

export function convertQuery(
  obj: Record<string, string | string[] | undefined>,
): Record<string, string | undefined | number | boolean> {
  const result: Record<string, string | undefined | number | boolean> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === "undefined" || value === "" || typeof value === "undefined") {
      result[key] = undefined;
    } else if (value === "true") {
      result[key] = true;
    } else if (value === "false") {
      result[key] = false;
    } else if (!Number.isNaN(Number(value))) {
      result[key] = Number(value);
    } else {
      result[key] = value as string;
    }
  }
  return result;
}
