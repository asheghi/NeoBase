import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  build: {
    lib: {
      entry: {
        api: './lib/api/index.ts',
        react: './lib/react/index.ts',
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'axios', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          axios: 'Axios',
          'react-dom': 'ReactDOM',
        },
      },
    }
  }
})
