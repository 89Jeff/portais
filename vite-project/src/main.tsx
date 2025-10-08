// src/main.tsx (Ajustado)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importação do novo AuthProvider
import { ThemeProvider } from '@mui/material/styles'; // Usando ThemeProvider do MUI
import { theme } from './styles/Theme'; // Assumindo que você tem um arquivo de tema

// ... importação do seu objeto 'router' de './router.tsx'
import { router } from './router/router'; // Supondo que você exportou 'router' no router.tsx

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* ENVOLVE A APLICAÇÃO */}
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);