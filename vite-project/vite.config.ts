// vite.config.js (VERSÃO CORRIGIDA/SIMPLIFICADA)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/portal': {
        // 1. Aponta para o endereço real do backend
        target: 'https://totvs.casafortaleza.com.br:8139', 
        
        // 2. Essencial para que o backend veja a requisição vindo do domínio correto
        changeOrigin: true, 
        
        // 3. Permite comunicação segura (HTTPS) em desenvolvimento
        secure: false, 

        // 4. (OPCIONAL, MAS IMPORTANTE) Mantenha o configure para forçar o HOST, que o TOTVS gosta
        configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
                // Força o HOST correto, ignorando o localhost:5173
                proxyReq.setHeader('Host', 'totvs.casafortaleza.com.br:8139');
                // Remove o header de origem que pode causar bloqueio
                proxyReq.removeHeader?.('origin');
            });
        },
        
        // 5. REMOVIDO: A linha 'rewrite' confusa
      },
    },
  },
});