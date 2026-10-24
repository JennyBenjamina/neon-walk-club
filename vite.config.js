import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // React + map + Firestore Lite land around 600 kB (about 180 kB gzipped); fine for this site.
  build: { chunkSizeWarningLimit: 700 },
})
