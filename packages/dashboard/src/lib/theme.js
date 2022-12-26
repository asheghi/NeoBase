import { ref } from "vue";

const defaultMode = JSON.parse(localStorage.getItem("isDarkMode") || "false");
export const isDarkMode = ref(defaultMode);
export function toggleDarkMode() {
  if (!isDarkMode.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("isDarkMode", !isDarkMode.value);
  isDarkMode.value = !isDarkMode.value;
}
