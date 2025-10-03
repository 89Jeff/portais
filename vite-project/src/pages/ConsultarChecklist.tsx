import React, { useState, useMemo } from 'react';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    CircularProgress,
    Box,
    Divider,
    TextField,
    Button,
    Grid,
    Chip,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import { 
    AccessTime, 
    CheckCircleOutline, 
    CancelOutlined, 
    //LocationOn, 
    Person, 
    NoteAlt, 
    Visibility, 
    Image, 
    TextSnippet, 
    Search, 
    ListAlt,
    ZoomIn,
    TextFields,
    Videocam,
} from '@mui/icons-material';

// Configuração do Tema Material UI
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', 
        },
        secondary: {
            main: '#dc004e', 
        },
        success: {
            main: '#4caf50',
        },
        error: {
            main: '#f44336',
        },
        info: {
            main: '#2196f3',
        },
        warning: {
            main: '#ff9800', 
        },
    },
    shape: {
        borderRadius: 2,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                }
            }
        }
    }
});

// A URL da API deve ser ajustada para o seu ambiente real.
const API_BASE_URL = 'http://localhost:8080/api/v1/contele';

// =========================================================================
// INTERFACES E TIPOS (Mantidas)
// =========================================================================

interface Answer {
    id: string;
    answer: string;
    form_question_id: string;
}

interface Form {
    forms_id?: string;
    form_title?: string; 
    answers: Answer[];
    template: Template;
}

interface Template {
    id: string;
    name: string;
    template_public: boolean;
    settings_flags: string[];
    created_at: string;
    last_update: string;
    segments: Segment[];
}

interface Segment {
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

interface RespostaFormulariosContele {
    forms: Form[];
}

interface Tag { id: string; tagName: string; }
interface UserDetail { id: string; name: string; username: string; email: string; role: string; phoneNumber: string; }
interface Endereco { street: string; number: string; city: string; state: string; }
interface POI { name: string; address: Endereco; }
interface Tarefa { id: string; creatorName: string; observation: string; status: string; os: string; tags: Tag[]; checkinTime: string | null; checkoutTime: string | null; poi: POI; userData: UserDetail; }

type TabName = 'Standard' | 'Photos' | 'Videos' | 'Observations' | '';

const CustomGridItem = (props: any) => <Grid {...props} item />;

// =========================================================================
// UTILITÁRIOS E FILTROS (Mantidas)
// =========================================================================

const IMAGE_EXTENSIONS = 'jpg|jpeg|png|gif|webp|svg|heic';
const VIDEO_EXTENSIONS = 'mp4|mov|avi|webm|mkv|3gp';

const isImageUrl = (text: string): boolean => {
    if (!text || text.length < 50) return false;
    const urlPattern = new RegExp(`^(https?:\/\/[^\\s]+)\.(${IMAGE_EXTENSIONS})(\\?.*)?$`, 'i');
    return urlPattern.test(text.trim());
};

const isVideoUrl = (text: string): boolean => {
    if (!text || text.length < 50) return false;
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)\S+/i;
    const directVideoPattern = new RegExp(`^(https?:\/\/[^\\s]+)\.(${VIDEO_EXTENSIONS})(\\?.*)?$`, 'i');
    
    return youtubePattern.test(text.trim()) || directVideoPattern.test(text.trim());
};

const isLongObservation = (text: string): boolean => {
    const trimmedText = text?.trim() || '';
    if (trimmedText.length < 50) return false;
    return !isImageUrl(trimmedText) && !isVideoUrl(trimmedText);
};


// =========================================================================
// COMPONENTE DE EXIBIÇÃO DA RESPOSTA (Mantido)
// =========================================================================

interface ChecklistAnswerCardProps {
    answer: Answer;
    tabType: TabName;
    questionTitlesMap: Record<string, Segment>; 
}

const ChecklistAnswerCard: React.FC<ChecklistAnswerCardProps> = ({ answer, /*tabType,*/ questionTitlesMap }) => {
    const [imageLoadError, setImageLoadError] = useState(false); 
    
    // Agora o título deve vir do questionTitlesMap (que é preenchido pela API)
    const questionId = answer.form_question_id;
    const questionConfig = questionTitlesMap[questionId]
    // Se não encontrar o título, ele volta a mostrar o ID, indicando que a API não retornou o mapeamento para essa ID.
    const title =  questionConfig.title || `Pergunta ID: ${questionId.substring(0, 8)}... (Título não carregado)`; 

    let rawText = answer.answer?.trim() || '*Não respondido*';
    if (questionConfig.type === "radio_question") {
      rawText = questionConfig.options.find((opt) => opt.id === rawText)?.label || rawText;
    }

    const text = rawText === '*Não respondido*' ? rawText : rawText.toUpperCase();
    
    const isYes = text === 'SIM';
    const isNo = text === 'NÃO' || text === 'NAO';
    const isPhoto = isImageUrl(rawText);
    const isVideo = isVideoUrl(rawText);
    const isObservation = isLongObservation(rawText);
    
    let color = 'text.primary';
    let icon = <TextSnippet fontSize="small" />;
    let bgColor = '#ffffff';
    let minHeight = (isPhoto || isVideo || isObservation) ? 150 : 100; 

    // Define estilos com base no conteúdo
    if (isPhoto) {
        color = theme.palette.info.dark;
        icon = <Image fontSize="small" />;
        bgColor = '#e3f2fd'; 
    } else if (isVideo) {
        color = theme.palette.success.dark;
        icon = <Videocam fontSize="small" />;
        bgColor = '#e8f5e9'; 
    } else if (isYes) {
        color = theme.palette.success.main;
        icon = <CheckCircleOutline fontSize="small" />;
        bgColor = '#e8f5e9'; 
    } else if (isNo) {
        color = theme.palette.error.main;
        icon = <CancelOutlined fontSize="small" />;
        bgColor = '#ffebee'; 
    } else if (isObservation) {
        color = theme.palette.text.secondary;
        icon = <NoteAlt fontSize="small" />;
        bgColor = '#fff3e0'; 
    } else if (rawText === '*Não respondido*') {
        color = theme.palette.text.disabled;
        bgColor = '#f7f7f7'; 
    } else {
        bgColor = '#f7f7f7'; 
    }

    const handleViewMedia = () => {
        window.open(rawText, '_blank');
    };

    const renderMediaContent = () => {
        if (isPhoto) {
            return (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', p: 1 }}>
                    {imageLoadError ? (
                        <Box sx={{ height: 120, width: '100%', bgcolor: '#f0f0f0', borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #aaa' }}>
                            <Image color="disabled" sx={{ fontSize: 40 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                                Não foi possível carregar o preview.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ position: 'relative', width: '100%', pt: '75%', overflow: 'hidden', borderRadius: 1 }}>
                            <img 
                                src={rawText} 
                                alt={title} 
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                                onError={() => setImageLoadError(true)}
                                onClick={handleViewMedia}
                            />
                        </Box>
                    )}
                    <Button 
                        variant="outlined" 
                        color="info" 
                        onClick={handleViewMedia} 
                        startIcon={<Visibility />}
                        size="small"
                        sx={{ mt: 1, textTransform: 'none', width: '100%' }}
                    >
                        Visualizar Original
                    </Button>
                </Box>
            );
        }

        if (isVideo) {
            return (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                     <Box sx={{ 
                            height: 120, width: '100%', bgcolor: theme.palette.success.light, 
                            borderRadius: 1, display: 'flex', flexDirection: 'column', 
                            alignItems: 'center', justifyContent: 'center', border: '1px dashed #4caf50'
                        }}>
                            <Videocam color="success" sx={{ fontSize: 40 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 0.5 }}>
                                Clique para abrir o vídeo.
                            </Typography>
                        </Box>
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={handleViewMedia} 
                        startIcon={<Visibility />}
                        size="small"
                        sx={{ mt: 1, textTransform: 'none', width: '100%' }}
                    >
                        Visualizar Vídeo
                    </Button>
                </Box>
            );
        }

        // Padrão e Observação (Texto)
        return (
            <Typography 
                variant="body1" 
                sx={{ 
                    color: color, 
                    fontWeight: isYes || isNo ? 'bold' : 'normal',
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word',
                    flexGrow: 1,
                    fontSize: isObservation ? '0.9rem' : '1rem' 
                }}
            >
                {isYes || isNo ? text : rawText}
            </Typography>
        );
    };

    return (
        <Paper 
            elevation={2} 
            sx={{ 
                p: 2, 
                borderRadius: theme.shape.borderRadius, 
                bgcolor: bgColor, 
                width: '100%',
                // height: '100%',
                // minHeight: minHeight,
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.3s, transform 0.3s',
                border: `1px solid ${isPhoto ? theme.palette.info.light : isVideo ? theme.palette.success.light : isObservation ? theme.palette.warning.light : '#eee'}`,
                '&:hover': {
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.text.secondary, display: 'flex', alignItems: 'center' }}>
                {icon}
                <Box component="span" sx={{ ml: 1, lineHeight: 1.2 }}>{title}</Box>
            </Typography>
            <Divider sx={{ mb: 1 }} />
            
            {renderMediaContent()}
        </Paper>
    );
};


// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================

const ConsultarChecklist: React.FC = () => {
    const [numeroTotvs, setNumeroTotvs] = useState('');
    const [visita, setVisita] = useState<Tarefa | null>(null);
    const [formularios, setFormularios] = useState<Form[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // ABA ATIVA: Inicializa como string vazia
    const [activeTab, setActiveTab] = useState<TabName>(''); 
    

    // --- LÓGICA DE MAPEAR TÍTULOS (APENAS COM DADOS DA API) ---
    const questionTitlesMap = useMemo(() => {
        const map: Record<string, Segment> = {};

        // Percorre todos os formulários e extrai a ID e o Título de cada pergunta
        // Isso depende que o campo 'questions' em 'Form' seja preenchido corretamente pela API.
        formularios?.forEach(form => {
            form.template.segments.forEach(segment => {
                map[segment.id] = segment;
            });
        });

        // Este mapa conterá as IDs de pergunta como chaves e os títulos como valores.
        // Se sua API não estiver retornando 'questions', este mapa estará vazio.
        return map;
    }, [formularios]);


    // --- FUNÇÕES AUXILIARES (Formatação e Duração) --- (Mantidas)
    const formatarDataHora = (isoString: string | null): string => {
        if (!isoString) return 'N/A';
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('pt-BR') + ' ' + 
                   date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return 'N/A'; }
    };

    const calcularDuracao = (checkin: string | null, checkout: string | null): string => {
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


    // --- LÓGICA DE CATEGORIZAÇÃO DAS RESPOSTAS --- (Mantida)
    const categorizedAnswers = useMemo(() => {
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
    }, [formularios]);


    // --- BUSCA DE DADOS ---
    const handleSearch = async () => {
        const osToSearch = numeroTotvs.trim();

        if (!osToSearch) {
            setError('Por favor, digite um número do Checklist da Totvs.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setVisita(null); 
        setFormularios(null);
        setActiveTab('');

        try {
            // 1. Busca a visita
            const visitaResponse = await axios.get<Tarefa>(
                `${API_BASE_URL}/tarefas/totvs/${osToSearch}`
            );
            const visitaData = visitaResponse.data;
            setVisita(visitaData);

            // 2. Busca os formulários
            const formulariosResponse = await axios.get<RespostaFormulariosContele>(
                `${API_BASE_URL}/formularios/visita/${visitaData.id}`
            );
            
            // Mapeia o título do formulário. Assume que 'forms' já contém 'questions' com 'title'
            const formsWithTitle: Form[] = formulariosResponse.data.forms.map(form => ({
                ...form,
                form_title: form.forms_id ? `Checklist OS ${visitaData.os}` : 'Formulário Desconhecido',
                // O campo 'questions' DEVE estar vindo aqui da API para o mapeamento funcionar.
            }));

            setFormularios(formsWithTitle);
            setActiveTab('');

        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setError(`Visita com OS Totvs: ${osToSearch} não encontrada.`);
            } else {
                setError('Ocorreu um erro ao buscar os dados. Verifique sua conexão ou tente novamente.');
            }
            console.error('Erro na busca:', err);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !isLoading) {
            handleSearch();
        }
    };

    const tecnico = visita?.userData;
    const tagName = visita?.tags && visita.tags.length > 0 ? visita.tags[0].tagName : 'Não Taggeado';
    const statusColor = visita?.status === 'completo' ? 'success' : visita?.status === 'pendente' ? 'warning' : 'default';

    // Conteúdo da aba ativa e configuração
    const activeAnswers = activeTab ? categorizedAnswers[activeTab.toLowerCase() as keyof typeof categorizedAnswers] : [];
    const totalAnswers = categorizedAnswers.standard.length + categorizedAnswers.photos.length + categorizedAnswers.videos.length + categorizedAnswers.observations.length;
    
    // Configuração das abas para renderização
    const tabsConfig = [
        { key: 'Standard', label: 'Formulário', icon: <ListAlt />, count: categorizedAnswers.standard.length, color: 'primary' as 'primary' },
        { key: 'Photos', label: 'Fotos', icon: <ZoomIn />, count: categorizedAnswers.photos.length, color: 'info' as 'info' },
        { key: 'Videos', label: 'Vídeos', icon: <Videocam />, count: categorizedAnswers.videos.length, color: 'success' as 'success' },
        { key: 'Observations', label: 'Observação', icon: <TextFields />, count: categorizedAnswers.observations.length, color: 'warning' as 'warning' },
    ];


    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Seção de Busca */}
                <Paper elevation={4} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                        Consultar Checklist da Visita
                    </Typography>
                    {/*<Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                        Digite o número da OS/Checklist da Totvs.
                    </Typography>*/}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
                        <TextField
                            fullWidth
                            label="Número do Checklist Totvs"
                            variant="outlined"
                            value={numeroTotvs}
                            onChange={(e) => setNumeroTotvs(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            disabled={isLoading}
                            startIcon={<Search />}
                            sx={{ px: 4, height: 56, minWidth: 120, borderRadius: 1, boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)' }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Buscar'}
                        </Button>
                    </Box>
                    {error && (
                        <Typography variant="body1" color="error" sx={{ mt: 2, p: 1, bgcolor: theme.palette.error.light, color: theme.palette.error.dark, borderRadius: 1, fontWeight: 500 }}>
                            {error}
                        </Typography>
                    )}
                </Paper>
                
                {/* Conteúdo Principal */}
                 {visita && (
                    <>
                    {/* Detalhes da Visita */}
                    <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
                        {/* Cliente e Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                            
                            {/* TÍTULO/CLIENTE/LOCAL - ALTERADO AQUI */}
                            <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.dark, mb: { xs: 1, md: 0 } }}>
                                {/* ÍCONE MUDOU DE LocationOn PARA Person */}
                                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Cliente: {visita.poi.name}
                            </Typography>
                            
                            {/* STATUS DA VISITA */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary, mr: 1 }}>
                                    Status da Visita:
                                </Typography>
                                <Chip label={visita.status.toUpperCase()} color={statusColor} sx={{ fontWeight: 'bold' }} />
                            </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Grid container spacing={3}>
                            {/* Endereço (Linha 1) */}
                            <CustomGridItem xs={12}><Typography variant="body1"><strong>Endereço:</strong> {visita.poi.address.street}, {visita.poi.address.number}, {visita.poi.address.city} - {visita.poi.address.state}</Typography></CustomGridItem>
                            
                            <Divider sx={{ width: '100%', my: 1, mx: 3 }} /> 
                            
                            {/* Linha 2: Tags, OS, Observação */}
                            <CustomGridItem xs={12} md={4}><Typography variant="body1"><strong>Empresa:</strong> <Chip label={tagName} size="small" variant="outlined" /></Typography></CustomGridItem>
                            <CustomGridItem xs={12} md={4}><Typography variant="body1"><strong>N°:OS (Contele):</strong> {visita.os}</Typography></CustomGridItem>
                            <CustomGridItem xs={12} md={4}><Typography variant="body1"><strong>Checklist:</strong> {visita.observation || 'N/A'}</Typography></CustomGridItem>

                            <Divider sx={{ width: '100%', my: 1, mx: 3 }} />
                            
                            {/* Linha 3: Tempos (Check-in, Check-out, Duração) */}
                            <CustomGridItem xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime color="success" sx={{ mr: 1 }} />
                                    <Typography variant="body2"><strong>Check-in:</strong> {formatarDataHora(visita.checkinTime)}</Typography>
                                </Box>
                            </CustomGridItem>
                            <CustomGridItem xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime color="error" sx={{ mr: 1 }} />
                                    <Typography variant="body2"><strong>Check-out:</strong> {formatarDataHora(visita.checkoutTime)}</Typography>
                                </Box>
                            </CustomGridItem>
                            <CustomGridItem xs={12} sm={12} md={3}>
                                <Typography variant="body1"><strong>Duração Total:</strong> <Chip label={calcularDuracao(visita.checkinTime, visita.checkoutTime)} color="info" size="small" /></Typography>
                            </CustomGridItem>
                        </Grid>
                    </Paper>


                    {/* Detalhes do Técnico */}
                    {tecnico && (
                        <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2, fontWeight: 600 }}>
                                <Person sx={{ mr: 1, verticalAlign: 'middle', color: theme.palette.secondary.main }} />
                                Técnico
                            </Typography>
                            <Grid container spacing={3}>
                                <CustomGridItem xs={12} sm={6}><Typography variant="body1"><strong>Nome:</strong> {tecnico.name}</Typography></CustomGridItem>
                                <CustomGridItem xs={12} sm={6}><Typography variant="body1"><strong>Função:</strong> {tecnico.role || 'N/A'}</Typography></CustomGridItem>
                                <CustomGridItem xs={12} sm={6}><Typography variant="body1"><strong>E-mail:</strong> {tecnico.email}</Typography></CustomGridItem>
                                <CustomGridItem xs={12} sm={6}><Typography variant="body1"><strong>Telefone:</strong> {tecnico.phoneNumber || 'N/A'}</Typography></CustomGridItem>
                            </Grid>
                        </Paper>
                    )}
                    
                    {/* Respostas do Checklist */}
                    {totalAnswers > 0 && (
                        <Paper 
                            elevation={4} 
                            sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}
                        >
                            {/* Cabeçalho do Painel */}
                            <Box
                                sx={{ 
                                    bgcolor: theme.palette.info.main, 
                                    p: 2, 
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <NoteAlt sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Informações da Visita  {/*({totalAnswers} itens) - OS: {visita.os}*/}
                                </Typography>
                            </Box>

                            <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'white' }}>
                                
                                {/* Seletor de Abas (Buttons) */}
                                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: activeTab ? 3 : 0, borderBottom: activeTab ? '1px solid #eee' : 'none' }}>
                                    {tabsConfig.map((tab) => (
                                        <Button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key as TabName)}
                                            variant={activeTab === tab.key ? 'contained' : 'outlined'}
                                            color={tab.color}
                                            startIcon={tab.icon}
                                            sx={{ 
                                                flexShrink: 0,
                                                fontWeight: activeTab === tab.key ? 700 : 500,
                                                minWidth: 120,
                                            }}
                                        >
                                            {tab.label} ({tab.count})
                                        </Button>
                                    ))}
                                </Box>

                                {/* Conteúdo da Aba Ativa: SÓ RENDERIZA SE activeTab NÃO FOR VAZIO */}
                                {activeTab && (
                                    <Box sx={{ minHeight: 200, py: 2 }}>
                                        {activeAnswers.length === 0 ? (
                                            <Box sx={{ textAlign: 'center', py: 5, border: '1px dashed #ccc', borderRadius: 2, bgcolor: '#fafafa' }}>
                                                <Typography variant="h6" color="text.secondary">
                                                    Nenhuma resposta na categoria "{tabsConfig.find(t => t.key === activeTab)?.label}".
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Grid container spacing={6} sx={{ mt: 1 }} >
                                                {activeAnswers.map((answer, index) => {
                                                    let gridCols;
                                                    // Fotos, Vídeos e Observação usam 4 colunas em desktop; Padrão (Formulário) usa 3.
                                                    if (activeTab === 'Observations' || activeTab === 'Videos' || activeTab === 'Photos') {
                                                        gridCols = { xs: 12, sm: 6, md: 4 }; 
                                                    } else {
                                                        gridCols = { xs: 12, sm: 6, md: 3 }; 
                                                    }

                                                    return (
                                                        <CustomGridItem key={index} {...gridCols}>
                                                            <ChecklistAnswerCard 
                                                                answer={answer} 
                                                                tabType={activeTab} 
                                                                questionTitlesMap={questionTitlesMap} 
                                                            />
                                                        </CustomGridItem>
                                                    );
                                                })}
                                            </Grid>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    )}
                    </>
                )}
            </Container>
        </ThemeProvider>
    );
};

const App = () => (
    <ConsultarChecklist />
);

export default App;
