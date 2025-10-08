// src/components/AuthGuard.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
 

/**
 * Componente que protege as rotas. 
 * Redireciona para a tela de login se o usuário não estiver autenticado.
 */
const AuthGuard: React.FC = () => {
    // Usamos a presença do token no localStorage como fonte de verdade primária
    // para evitar a desnecessidade do useEffect no Login.tsx
    const isAuthenticated = !!localStorage.getItem('userToken');

    if (!isAuthenticated) {
        // Se não estiver logado, redireciona para a raiz (Login)
        return <Navigate to="/" replace />;
    }

    // Se estiver logado, permite o acesso aos componentes filhos (Dashboard)
    return <Outlet />;
};

export default AuthGuard;