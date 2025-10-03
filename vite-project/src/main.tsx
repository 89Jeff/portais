import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import DashboardHome from './pages/DashboardHome.tsx';
import ConsultarPedido from './pages/ConsultarPedido.tsx';
import ConsultarChecklist from './pages/ConsultarChecklist.tsx';
import './index.css';

// Cria o roteador com as rotas da nossa aplicação
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: 'consultar-pedido',
        element: <ConsultarPedido />,
      },
      // AQUI: A rota foi corrigida para não esperar um 'id' na URL
      {
        path: 'consultar-checklist',
        element: <ConsultarChecklist />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);
