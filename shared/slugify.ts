export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
    " ": "-", ".": "", ",": "", "!": "", "?": "", ":": "", ";": "",
    "'": "", '"': "", "(": "", ")": "", "[": "", "]": "", "/": "-",
    "&": "ve", ō: "o", Ō: "o",
  };

  return text
    .split("")
    .map((c) => trMap[c] || c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
