import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"   // 👈 ADD THIS

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {              // 👈 ADD THIS BLOCK
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})