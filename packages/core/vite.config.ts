import react from "@vitejs/plugin-react";
import ssrPlugin from "vite-plugin-ssr/plugin";
import { UserConfig } from "vite";

let ssr = {};
if (process.env.NODE_ENV !== "development") {
  console.log("vite mode:production");
  ssr = {
    noExternal: ["@mui/material", "@emotion/styled", "@mui/icons-material"],
    external: ["prop-types"],
  };
} else {
  console.log("vite mode:dev");
  ssr = {
    external: ["@mui/material", "@mui/icons-material", "@mui/icons-material"],
  };
}
const config: UserConfig = {
  plugins: [react(), ssrPlugin()],
  ssr,
};

export default config;
