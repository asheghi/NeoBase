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
  plugins: [react(),SpaFallbackMiddleware()],
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
});

export function SpaFallbackMiddleware() {
  return {
    name: 'real-spa-fallback',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [, firstPart, ...pathParts] = req.url.split('/')
        const lastPart = pathParts[pathParts.length- 1]

        if(req.url === '/'){
          res.statusCode = 302;
          res.setHeader('Location', '/dashboard/');
          res.setHeader('Content-Length', '0');
          res.end();
          return;
        }

        if(req.url === '/register'){
          res.statusCode = 302;
          res.setHeader('Location', '/register/');
          res.setHeader('Content-Length', '0');
          res.end();
          return;
        }


        if(req.url === '/login'){
          res.statusCode = 302;
          res.setHeader('Location', '/login/');
          res.setHeader('Content-Length', '0');
          res.end();
          return;
        }

        // these a vite internal URLs
        if (firstPart.startsWith('_') || firstPart.startsWith('@')) {
          return next()
        }

        // URLs that explicitly target files are not rewritten
        if (lastPart && lastPart.includes('.')) {
          return next()
        }
        // console.log('check first part', firstPart);
        // console.log('check last part', lastPart);

        console.log('url before', req.url);
        if(req.url.includes('dashboard')){
          req.url = '/dashboard/'
        }

        // // rewrite /foo/bar/baz to /foo/ the downstream middleware 'indexhtml' will take care of the rest
        // const match = req.url.match(/^\/([^\/]+)\/?/)
        // if (match && match[1]) {
        //   req.url = `/${match[1]}/`
        // }

        console.log('url after', req.url);
        next()
      })
    }
  }
}
