import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "./build/vite-svg-loader";
import markdown from "vite-plugin-md";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    svgLoader(),
    markdown(),
  ],
});
