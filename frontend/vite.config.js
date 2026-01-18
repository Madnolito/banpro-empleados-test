import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkgJSON from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __PACKAGE_JSON_VERSION__: JSON.stringify(pkgJSON.version),
  }
})
