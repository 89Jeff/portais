// src/hooks/usePermissions.ts

// 1. Exporta o tipo para ser usado em outros componentes
export type PermittedRouteProps = 'CKL' | 'PED' | string;

/**
 * Verifica se o usuário logado possui a permissão necessária.
 * @param requiredPermission A string de permissão necessária (ex: 'CKL', 'PED').
 * @returns true se o usuário tiver a permissão, false caso contrário.
 */
export const checkPermission = (requiredPermission: PermittedRouteProps): boolean => {
    try {
        const permissionsRaw = localStorage.getItem('userPermissions');
        const permissions: string[] = permissionsRaw ? JSON.parse(permissionsRaw) : [];
        
        // Verifica se a permissão necessária está na lista
        return permissions.includes(requiredPermission);
    } catch (e) {
        console.error("Erro ao verificar permissão:", e);
        return false;
    }
};

// Como a função é exportada como 'named export' (checkPermission),
// não precisamos de um 'default export'.