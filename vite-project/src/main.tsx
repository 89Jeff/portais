// Seu arquivo principal (main.tsx ou index.tsx)
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
import PermittedRoute from './components/PermittedRoute.tsx'; // IMPORTANTE: Importar o guarda!
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
      
      // ----------------------------------------------------
      // ROTA PROTEGIDA: CONSULTAR PEDIDO (Requer permissão PED)
      {
        // Este é o guarda de rota que verifica as permissões antes de renderizar os filhos.
        element: <PermittedRoute requiredPermission="PED" />, 
        children: [
          {
            path: 'consultar-pedido', // Caminho: /dashboard/consultar-pedido
            element: <ConsultarPedido />,
          },
        ],
      },
      // ----------------------------------------------------
      
      // ----------------------------------------------------
      // ROTA PROTEGIDA: CONSULTAR CHECKLIST (Requer permissão CKL)
      {
        // O guarda de rota para o Checklist.
        element: <PermittedRoute requiredPermission="CKL" />, 
        children: [
          {
            path: 'consultar-checklist', // Caminho: /dashboard/consultar-checklist
            element: <ConsultarChecklist />,
          },
        ],
      },
      // ----------------------------------------------------
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);


/*import React from 'react';
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
);*/
