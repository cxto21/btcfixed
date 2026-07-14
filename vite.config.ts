import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    // Required for starknet.js to work in the browser (Buffer, global, etc.)
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      // Ensure starkzap tree-shakes server-only modules
      // MistCash SDK contains heavy ZK proof WASM — externalize to avoid OOM during build
      external: ['@mistcash/sdk', '@mistcash/config', 'garaga'],
      output: {
        manualChunks: {
          // Split heavy vendor libraries for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-starknet': ['starknet'],
          'vendor-ui': ['lucide-react'],
          // Privy is heavy - split it out
          'vendor-privy': ['@privy-io/react-auth'],
          // Cartridge is heavy - split it out
          'vendor-cartridge': ['@cartridge/controller'],
        },
      },
    },
  },
});
