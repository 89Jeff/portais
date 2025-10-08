import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// REMOVIDO: import { useNavigate } from 'react-router-dom'; <--- Linha removida!

import type { LoginResponse } from '../types/Contele.d';

// -------------------------------------------------------------------------------------
// TIPAGEM
// -------------------------------------------------------------------------------------

// O tipo de dados do usuário armazenado no contexto
interface AuthUser extends LoginResponse {}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: AuthUser | null;
    login: () => void;
    logout: () => void; // Apenas expõe a função de limpeza de estado
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------------------------------------------------------------------------
// PROVEDOR DE CONTEXTO
// -------------------------------------------------------------------------------------

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // REMOVIDO: const navigate = useNavigate(); <--- Linha removida!
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<AuthUser | null>(null);

    // Função para carregar os dados do localStorage
    const loadUserData = useCallback(() => {
        const token = localStorage.getItem('userToken');
        const permissionsJson = localStorage.getItem('userPermissions');
        const bloqueado = localStorage.getItem('usuarioBloqueado') as 'S' | 'N' | null;
        const trocarSenha = localStorage.getItem('senhaTrocar') as 'S' | 'N' | null;
        const validade = localStorage.getItem('usuarioValidade');

        if (token && permissionsJson && bloqueado && trocarSenha && validade) {
            const permissions = JSON.parse(permissionsJson);
            
            setUser({
                direitos: permissions,
                bloqueado: bloqueado,
                trocar_senha: trocarSenha,
                validade: validade,
            });
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    }, []);

    // Efeito para carregar dados na inicialização
    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    // Usado pelo Login.tsx para forçar o recarregamento dos dados após o sucesso
    const login = useCallback(() => {
        loadUserData();
    }, [loadUserData]);

    const logout = useCallback(() => {
        // Apenas limpa o estado e o localStorage
        localStorage.clear(); 
        setUser(null);
        setIsAuthenticated(false);
        // A NAVEGAÇÃO para '/' será feita pelo componente que CHAMA esta função (ex: Sidebar)
    }, []);

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ... useAuth permanece o mesmo
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};