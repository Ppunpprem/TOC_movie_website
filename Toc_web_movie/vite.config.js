import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  root: '.', // Ensure Vite is resolving from the root of the project
  plugins: [react()],
});