export function removeDiacritics(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[îâă]/g, "a")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t");
}
