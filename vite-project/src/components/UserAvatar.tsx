import React from 'react';

/**
 * Hook para obter as iniciais e o nome do usuário a partir do localStorage.
 * Agora prioriza o campo 'nome', conforme a resposta confirmada da API.
 * @returns { { initials: string, fullName: string } }
 */
const useUserInitials = () => {
    const userString = localStorage.getItem('user');
    let fullName = 'Usuário'; 
    let initials = 'U'; 

    if (userString) {
        try {
            const userData = JSON.parse(userString);
            
            // 1. Prioriza o campo 'nome' (confirmado pela API)
            // 2. Mantém o fallback para 'cnomeuser' ou 'cnome' por segurança
            const userName = userData.nome || userData.cnomeuser || userData.cnome; 

            if (typeof userName === 'string' && userName.trim().length > 0) {
                fullName = userName.trim();
                
                // Lógica de iniciais:
                const parts = fullName.split(' ').filter(p => p.length > 0);
                
                if (parts.length === 1) {
                    initials = parts[0][0].toUpperCase();
                } else if (parts.length >= 2) {
                    const firstInitial = parts[0][0].toUpperCase();
                    // Pega a inicial da última palavra
                    const lastInitial = parts[parts.length - 1][0].toUpperCase(); 
                    initials = `${firstInitial}${lastInitial}`;
                }
            }
        } catch (e) {
            console.error("Erro ao fazer parse do objeto 'user' no localStorage", e);
        }
    }

    return { initials, fullName };
};

const UserAvatar: React.FC = () => {
    const { initials, fullName } = useUserInitials();

    return (
        // data-tooltip é usado pelo CSS do Dashboard para exibir o nome no menu colapsado
        <div className="user-avatar-container" data-tooltip={fullName}> 
            <div className="user-initials">
                {initials}
            </div>
            <div className="user-name-wrapper">
                <span className="user-name-text">{fullName}</span>
            </div>
        </div>
    );
};

export default UserAvatar;