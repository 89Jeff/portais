// src/hooks/usePermissions.tsx

// 1. Exporta o tipo para ser usado em outros componentes (como PermittedRoute)
export type PermittedRouteProps = 'CKL' | 'PED' | string;

/**
 * Verifica se o usuário logado possui a permissão necessária.
 * A lista de permissões do usuário é esperada no localStorage como 'userPermissions'.
 * * @param requiredPermission A string de permissão necessária (ex: 'CKL', 'PED').
 * @returns true se o usuário tiver a permissão, false caso contrário.
 */
export const checkPermission = (requiredPermission: PermittedRouteProps): boolean => {
    try {
        // Pega a string de permissões do localStorage
        const permissionsRaw = localStorage.getItem('userPermissions');
        
        // Converte a string JSON em um array de strings. Se for null, usa um array vazio.
        const permissions: string[] = permissionsRaw ? JSON.parse(permissionsRaw) : [];
        
        // Verifica se a permissão necessária está na lista
        return permissions.includes(requiredPermission);
    } catch (e) {
        console.error("Erro ao verificar permissão:", e);
        // Em caso de erro (ex: JSON inválido), nega o acesso por segurança
        return false;
    }
};

// Nota: Por ser um arquivo de hook/lógica (e não um componente com export default), 
// usamos apenas 'named exports'.