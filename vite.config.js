import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Minificación agresiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Eliminar funciones específicas
      },
    },
    // Code splitting optimizado
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libs para mejor caching
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
        },
      },
    },
    // Optimización de chunks
    chunkSizeWarningLimit: 600,
    // Source maps solo para errores (no mapas completos)
    sourcemap: false,
  },
  // Optimizar dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
});
