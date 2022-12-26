import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
const base = process.env.BASE_URL || '/TodoApp/';
// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [vue(), svgLoader()],
});
