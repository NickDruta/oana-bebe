export const normalizeText = (text: string) => {
  return decodeURIComponent(text.replaceAll(" ", "—"))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};
