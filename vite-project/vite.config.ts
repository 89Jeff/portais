// vite.config.js (Versão com o Proxy Simulado)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/portal': {
        target: 'https://totvs.casafortaleza.com.br:8139',
        changeOrigin: true, // Essencial para Host Spoofing
        secure: false, 
        rewrite: (path) => path.replace(/^\/portal/, '/portal'),

        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // CRÍTICO: FORÇA O HOST CORRETO
            proxyReq.setHeader('Host', 'totvs.casafortaleza.com.br:8139');
            // SIMULA O POSTMAN
            proxyReq.setHeader('user-agent', 'PostmanRuntime/7.37.0');

            // LIMPA HEADERS DE BROWSER QUE CONFUNDEM O BACKEND (opcional, mas recomendado)
            proxyReq.removeHeader?.('origin');
            proxyReq.removeHeader?.('referer');
            // ... (remova os outros headers que você tinha listado)
          });
        },
      },
    },
  },
});