export function getErrorMessage(error: any, fallback = "Something went wrong."): string {
  const raw = error?.response?.data?.message;

  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw[0] ?? fallback;
  if (raw && typeof raw === "object" && typeof raw.message === "string") return raw.message;

  return fallback;
}