// src/types/Contele.d.tsx

// =========================================================================
// TIPOS GERAIS
// =========================================================================

// Tipagem para as abas de resposta do Checklist
export type TabName = 'Standard' | 'Photos' | 'Videos' | 'Observations'; 

// Tipagem para as permissões usadas no PermittedRoute e Dashboard
export type PermittedRouteProps = 'CKL' | 'PED' | string;

// =========================================================================
// INTERFACES DE AUTENTICAÇÃO (Adicionadas)
// =========================================================================

/**
 * Interface que representa a resposta do endpoint /portal/login.
 */
export interface LoginResponse {
    // Array de permissões (ex: ['CKL', 'PED'])
    direitos: string[]; 
    // Indicador se o usuário está bloqueado ('S' ou 'N')
    bloqueado: 'S' | 'N';
    // Indicador se a senha deve ser trocada ('S' ou 'N')
    trocar_senha: 'S' | 'N';
    // Data de validade do usuário (formato "YYYYMMDD")
    validade: string;
}

// =========================================================================
// INTERFACES E TIPOS DA API CONTELE (Existentes)
// =========================================================================

export interface Answer {
    id: string;
    answer: string;
    form_question_id: string;
}

export interface Segment {
    id: string;
    type: string;
    title: string;
    options: {
        id: string;
        label: string;
        option_avatar_photo_uri: string;
    }[];
    is_required_to_answer: boolean;
}

export interface Template {
    id: string;
    name: string;
    template_public: boolean;
    settings_flags: string[];
    created_at: string;
    last_update: string;
    segments: Segment[]; // Onde as perguntas (questions) estão
}

export interface Form {
    forms_id?: string;
    form_title?: string;
    answers: Answer[];
    template: Template;
}

export interface RespostaFormulariosContele {
    forms: Form[];
}

export interface Tag { id: string; tagName: string; }
export interface UserDetail { id: string; name: string; username: string; email: string; role: string; phoneNumber: string; }
export interface Endereco { street: string; number: string; city: string; state: string; }
export interface POI { name: string; address: Endereco; }
export interface Tarefa { 
    id: string; 
    creatorName: string; 
    observation: string; 
    status: string; 
    os: string; 
    tags: Tag[]; 
    checkinTime: string | null; 
    checkoutTime: string | null; 
    poi: POI; 
    userData: UserDetail; 
}