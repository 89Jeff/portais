import { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { categorizeAnswers } from '../utils/ChecklistUtils'; // Já existe
import type { Tarefa, Form, Segment, Answer } from '../types/Contele.d'; 

// ----------------------------------------------------
// CONSTANTES
// ----------------------------------------------------
// Nota: Ajuste a porta se necessário, mas 8080 é comum para APIs de backend.
const API_BASE_URL = 'http://localhost:8080/api/v1/contele'; 
const INITIAL_STATE = {
    visita: null as Tarefa | null,
    formularios: null as Form[] | null,
    loading: false,
    error: ''
};

// ----------------------------------------------------
// HOOK PRINCIPAL
// ----------------------------------------------------

export const useChecklistData = () => {
    const [state, setState] = useState(INITIAL_STATE);
    const [osToSearch, setOsToSearch] = useState('');
    const navigate = useNavigate();

    const { visita, formularios, loading, error } = state;

    // Ações de erro (Reutiliza a lógica de autenticação do componente anterior)
    const handleAuthError = (message: string) => {
        setState({ ...INITIAL_STATE, error: message });
        localStorage.removeItem('userToken');
        alert(message);
        navigate('/'); // Redireciona para o login
    };

    // Lógica para buscar os dados da OS e dos Formulários
    const handleSearch = useCallback(async (os: string) => {
        if (!os.trim()) {
            setState({ ...INITIAL_STATE, error: 'Por favor, digite o número da OS.' });
            return;
        }

        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
             handleAuthError('Token de usuário não encontrado. Faça login novamente.');
             return;
        }
        
        // Define o cabeçalho de autenticação
        const authHeader = {
            'Authorization': userToken,
            'Content-Type': 'application/json'
        };

        setState(prev => ({ ...prev, loading: true, error: '', formularios: null, visita: null }));

        try {
            // 1. Buscar dados da OS (Tarefa)
            const visitaResponse = await axios.get<Tarefa>(
                `${API_BASE_URL}/tarefas/totvs/${os}`,
                { headers: authHeader }
            );
            const visitaData = visitaResponse.data;

            // VERIFICAÇÃO E DECLARAÇÃO DA VARIÁVEL FALTANTE (CORREÇÃO AQUI)
            if (!visitaData || !visitaData.id) {
                 throw new Error(`Não foi possível obter o ID da visita para a OS ${os}.`);
            }
            const idDaVisita = visitaData.id;
            // 2. Buscar respostas do Formulário
            const formsResponse = await axios.get<{ forms: Form[] }>(
                `${API_BASE_URL}/formularios/visita/${idDaVisita}`,
                { headers: authHeader }
            );
            const formulariosData = formsResponse.data.forms;

            setState({
                visita: visitaData,
                formularios: formulariosData,
                loading: false,
                error: '',
            });

        } catch (err) {
            let errorMessage = 'Erro ao buscar dados do Checklist.';
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    errorMessage = `OS ${os} não encontrada ou não possui Checklist.`;
                } else if (err.response?.status === 401 || err.response?.status === 403) {
                    handleAuthError('Sessão expirada. Faça login novamente.');
                    return; // Sai da função após o erro de autenticação
                } else if (err.response) {
                    errorMessage = `Erro do servidor: ${err.response.status} - ${err.response.statusText}`;
                } else {
                    errorMessage = `Erro de rede ou conexão: ${err.message}`;
                }
            }
            console.error(err);
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        }
    }, [navigate]);

    // Lógica de Processamento de Dados (usa useMemo para otimizar)
    const processedData = useMemo(() => {
        if (!formularios || formularios.length === 0) {
            return {
                questionTitlesMap: {} as Record<string, Segment>,
                categorizedAnswers: categorizeAnswers(null),
                allAnswers: [] as Answer[],
            };
        }

        // 1. Mapeia títulos de perguntas (Segments)
        const allSegments = formularios.flatMap(f => f.template?.segments || []);
        const questionTitlesMap: Record<string, Segment> = {};
        allSegments.forEach(segment => {
            // Usa o ID do Segment como a chave (form_question_id na Answer)
            questionTitlesMap[segment.id] = segment;
        });

        // 2. Categoriza as respostas
        const allAnswers = formularios.flatMap(f => f.answers);
        const categorizedAnswers = categorizeAnswers(formularios);
        
        return {
            questionTitlesMap,
            categorizedAnswers,
            allAnswers,
        };
    }, [formularios]);

    return {
        // Estado
        visita,
        loading,
        error,
        osToSearch,
        
        // Dados Processados
        questionTitlesMap: processedData.questionTitlesMap,
        categorizedAnswers: processedData.categorizedAnswers,

        // Ações
        handleSearch,
        setOsToSearch,
    };
};