const parseBoolean = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();
  if (normalizedValue === "true") {
    return true;
  }
  if (normalizedValue === "false") {
    return false;
  }
  return null;
};

const getBaseCookieSettings = () => {
  const isProduction = String(process.env.NODE_ENV || "").toLowerCase() === "production";
  const secureFromEnv = parseBoolean(process.env.COOKIE_SECURE);
  const requestedSameSite = String(
    process.env.COOKIE_SAMESITE || (isProduction ? "none" : "lax")
  ).toLowerCase();

  const normalizedSameSite = ["lax", "strict", "none"].includes(requestedSameSite)
    ? requestedSameSite
    : isProduction
      ? "none"
      : "lax";

  const secure = normalizedSameSite === "none" ? true : (secureFromEnv ?? isProduction);

  return {
    httpOnly: true,
    secure,
    sameSite: normalizedSameSite,
    path: "/",
  };
};

export const getTokenCookieOptions = () => ({
  ...getBaseCookieSettings(),
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const getTokenClearCookieOptions = () => getBaseCookieSettings();

