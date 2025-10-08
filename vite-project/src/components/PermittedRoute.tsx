// src/components/PermittedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Supondo que cada permissão seja uma string, ex: "PED", "CKL"
interface PermittedRouteProps {
  requiredPermission: string;
}

const PermittedRoute: React.FC<PermittedRouteProps> = ({ requiredPermission }) => {
  const { user, isAuthenticated, isLoading } = useAuth(); // AGORA FUNCIONA GRAÇAS AO CONTEXTO

  // Enquanto carrega o estado de autenticação
  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}><p>Carregando permissões...</p></div>;

  // Usuário não autenticado
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Usuário sem permissão
  // O 'user' agora pode ser nulo se isAuthenticated for falso (checado acima), 
  // mas para garantir a tipagem, verificamos user?.direitos
  if (!user || !user.direitos.includes(requiredPermission)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>🔒 Acesso negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  // Usuário autenticado e com permissão
  return <Outlet />;
};

export default PermittedRoute;