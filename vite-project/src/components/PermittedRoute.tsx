// src/components/PermittedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// SEPARAÇÃO DE IMPORTS:
import { checkPermission } from '../hooks/usePermissions'; // Importação de VALOR (função)
import type { PermittedRouteProps } from '../hooks/usePermissions'; // Importação de TIPO

// A interface agora usa o tipo importado para garantir consistência
interface PermittedRouteComponentProps {
    requiredPermission: PermittedRouteProps; 
}

const PermittedRoute: React.FC<PermittedRouteComponentProps> = ({ requiredPermission }) => {
    // 1. Verifica se o usuário está logado (se há um token no localStorage)
    const isAuthenticated = !!localStorage.getItem('userToken');

    // Se não estiver logado, redireciona para a tela de login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    
    // 2. Verifica se o usuário tem a permissão necessária
    const hasPermission = checkPermission(requiredPermission);

    if (!hasPermission) {
        // Se não tiver a permissão, bloqueia o acesso, alerta o usuário, e redireciona para o dashboard
        console.warn(`Acesso negado. Permissão necessária: ${requiredPermission}`);
        alert(`Você não tem permissão (${requiredPermission}) para acessar esta funcionalidade.`);
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Se estiver logado e tiver a permissão, permite o acesso ao componente filho (a tela)
    return <Outlet />;
};

export default PermittedRoute;