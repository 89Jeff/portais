import { createBrowserRouter, /*RouterProvider*/ } from 'react-router-dom';

// Importações dos Componentes de Página e Layout
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import DashboardHome from '../pages/DashboardHome';
import ConsultarPedido from '../pages/ConsultarPedido';
import ConsultarChecklist from '../pages/ConsultarChecklist';
import ConsultarArmazem from '../pages/ConsultarArmazem';
import TrocarSenha from '../pages/TrocarSenha';

// Importações dos Guards e Wrappers
import AuthGuard from '../components/AuthGuard';
import PermittedRoute from '../components/PermittedRoute';
import App from '../App'; // O componente principal que contém o <Outlet />

// Definição das Rotas
export const router = createBrowserRouter([
    {
        path: '/',
        // O App.tsx é o wrapper principal que renderiza o Outlet
        element: <App />, 
        children: [
            { 
                index: true, // Rota '/'
                element: <Login />,
            },
            {
                path: 'dashboard',
                element: <AuthGuard />, // 1️⃣ Protege a rota: Se não tiver token, volta para a rota '/'
                children: [
                    {
                        element: <Dashboard />, // Dashboard como layout (Sidebar + Main Content)
                        children: [
                            { index: true, element: <DashboardHome /> }, // Rota /dashboard
                            
                            // Rota protegida por Permissão: PED
                            {
                                element: <PermittedRoute requiredPermission="PED" />, // 2️⃣ Protege por permissão
                                children: [{ 
                                    path: 'consultar-pedido', 
                                    element: <ConsultarPedido /> 
                                }],
                            },

                            {
                                element: <PermittedRoute requiredPermission="ARM" />, // 2️⃣ Protege por permissão
                                children: [{ 
                                    path: 'consultar-armazém', 
                                    element: <ConsultarArmazem /> 
                                }],
                            },
                            
                            // Rota protegida por Permissão: CKL
                            {
                                element: <PermittedRoute requiredPermission="CKL" />, // 2️⃣ Protege por permissão
                                children: [{ 
                                    path: 'consultar-checklist', 
                                    element: <ConsultarChecklist /> 
                                }],
                            },
                        ],
                    },
                ],
            },
            {
                path: 'trocar-senha',
                element: <TrocarSenha />,
            },
        ]
    },
]);

// A exportação 'export const router' já torna o objeto 'router' acessível no main.tsx