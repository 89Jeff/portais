import type { Answer, Form } from '../types/Contele.d.tsx';

// =========================================================================
// CONSTANTES E FUNÇÕES DE VALIDAÇÃO
// =========================================================================

const IMAGE_EXTENSIONS = 'jpg|jpeg|png|gif|webp|svg|heic';
const VIDEO_EXTENSIONS = 'mp4|mov|avi|webm|mkv|3gp';

export const isImageUrl = (text: string): boolean => {
    if (!text || text.length < 50) return false;
    const urlPattern = new RegExp(`^(https?:\/\/[^\\s]+)\.(${IMAGE_EXTENSIONS})(\\?.*)?$`, 'i');
    return urlPattern.test(text.trim());
};

export const isVideoUrl = (text: string): boolean => {
    if (!text || text.length < 50) return false;
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)\S+/i;
    const directVideoPattern = new RegExp(`^(https?:\/\/[^\\s]+)\.(${VIDEO_EXTENSIONS})(\\?.*)?$`, 'i');
    
    return youtubePattern.test(text.trim()) || directVideoPattern.test(text.trim());
};

export const isLongObservation = (text: string): boolean => {
    const trimmedText = text?.trim() || '';
    if (trimmedText.length < 50) return false;
    return !isImageUrl(trimmedText) && !isVideoUrl(trimmedText);
};


// =========================================================================
// FUNÇÕES DE FORMATO E TEMPO
// =========================================================================

export const formatarDataHora = (isoString: string | null): string => {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('pt-BR') + ' ' + 
               date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return 'N/A'; }
};

export const calcularDuracao = (checkin: string | null, checkout: string | null): string => {
    if (!checkin || !checkout) return 'N/A';
    const start = new Date(checkin).getTime();
    const end = new Date(checkout).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return '0m'; 
    let durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    durationMs -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(durationMs / (1000 * 60));
    let result = '';
    if (hours > 0) { result += `${hours}h `; }
    result += `${minutes}m`;
    return result.trim() || 'N/A';
};

// =========================================================================
// LÓGICA DE CATEGORIZAÇÃO DAS RESPOSTAS
// =========================================================================

export const categorizeAnswers = (formularios: Form[] | null) => {
    if (!formularios) return { standard: [], photos: [], videos: [], observations: [] }; 

    const allAnswers = formularios.flatMap(form => form.answers);

    // Funções de filtro
    const isPhotoCheck = (answer: Answer) => isImageUrl(answer.answer);
    const isVideoCheck = (answer: Answer) => isVideoUrl(answer.answer); 
    const isObservationCheck = (answer: Answer) => isLongObservation(answer.answer);
    
    // Prioridade 1: Mídia
    const photoAnswers = allAnswers.filter(isPhotoCheck);
    const videoAnswers = allAnswers.filter(isVideoCheck);
    
    // Prioridade 2: Observações (Textos longos que NÃO SÃO mídia)
    const nonMediaAnswers = allAnswers.filter(a => !isPhotoCheck(a) && !isVideoCheck(a));
    const observationAnswers = nonMediaAnswers.filter(isObservationCheck);

    // Prioridade 3: Padrão (Tudo que não é mídia nem observação longa)
    const standardAnswers = nonMediaAnswers.filter(a => !isObservationCheck(a));

    return { 
        standard: standardAnswers, 
        photos: photoAnswers, 
        videos: videoAnswers, 
        observations: observationAnswers 
    };
};