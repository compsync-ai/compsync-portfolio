export const sectionRoutes = ["platform", "monitoring", "intelligence", "contact"];

export function jumpToSection(hash) {
  const id = hash.replace("#", "");
  if (!sectionRoutes.includes(id)) return;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
