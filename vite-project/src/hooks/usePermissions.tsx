import type { PermittedRouteProps } from '../types/Contele.d';

/**
 * Obtém a lista de permissões do usuário logado.
 * Esta função espera encontrar a lista no localStorage sob a chave 'userPermissions'.
 * * NOTA: Esta função não é exportada. É usada internamente apenas por 'checkPermission'.
 * * @returns Um array de strings com as permissões (ou array vazio se não houver).
 */
const getPermissionsFromStorage = (): string[] => {
    try {
        // Pega a string de permissões do localStorage
        const permissionsRaw = localStorage.getItem('userPermissions');
        
        // Converte a string JSON em um array de strings. Se for null, usa um array vazio.
        const permissions: string[] = permissionsRaw ? JSON.parse(permissionsRaw) : [];
        return permissions;
    } catch (e) {
        // Em caso de erro (ex: JSON mal formatado), retorna um array vazio (nega o acesso por padrão)
        console.error("Erro ao ler permissões do storage:", e);
        return [];
    }
}

/**
 * Hook principal para verificar se o usuário logado possui a permissão necessária para acessar 
 * uma rota/funcionalidade específica.
 * * O componente Login.tsx é responsável por salvar a lista de permissões no localStorage
 * após a autenticação bem-sucedida.
 * * @param requiredPermission A string de permissão necessária (tipada via PermittedRouteProps, ex: 'CKL', 'PED').
 * @returns true se o usuário tiver a permissão, false caso contrário.
 */
export const checkPermission = (requiredPermission: PermittedRouteProps): boolean => {
    // Busca a lista de permissões armazenada
    const permissions = getPermissionsFromStorage();
    
    // Verifica se a permissão necessária está na lista
    return permissions.includes(requiredPermission);
};
