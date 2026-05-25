import { ref, watch } from "vue";

const STORAGE_KEY = "compsync-theme";

function getInitialTheme() {
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

function applyTheme(t) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("theme-dark", t === "dark");
  root.classList.toggle("theme-light", t === "light");
  root.style.colorScheme = t;
}

const theme = ref(getInitialTheme());
applyTheme(theme.value);

watch(theme, (t) => {
  applyTheme(t);
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    // Ignore quota/availability errors
  }
});

export function useTheme() {
  function setTheme(value) {
    if (value === "dark" || value === "light") theme.value = value;
  }
  function toggleTheme() {
    theme.value = theme.value === "dark" ? "light" : "dark";
  }
  return { theme, setTheme, toggleTheme };
}
