import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "./build/vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
});
