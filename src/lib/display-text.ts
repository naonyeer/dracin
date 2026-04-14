export function normalizeUiText(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return value.replace(/sulih\s+suara/gi, "Dubbing Indo");
}
