import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

const root = path.join(__dirname, 'src')
const outDir = path.join(__dirname, 'dist')
console.log('root',root);
// https://vitejs.dev/config/
export default defineConfig({
  base:"/",
  root,
  plugins: [react()],
  publicDir: path.join(root,'../public'),
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.join(root, 'dashboard','index.html'),
        about: path.join(root, 'login', 'index.html'),
      }
    },
  },
  server:{
    proxy:{
      // neobase core back-end url
      '/api': 'http://localhost:8080',
    }
  }
})
