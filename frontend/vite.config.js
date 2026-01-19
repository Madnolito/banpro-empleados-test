import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkgJSON from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.js",
    globals: true,
    css: true,
  },  
  define: {
    __PACKAGE_JSON_VERSION__: JSON.stringify(pkgJSON.version),
  }
})
