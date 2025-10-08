import React, { useState, useMemo } from 'react';
import { 
    Container, Paper, Typography, Box, TextField, Button, Grid, Chip, Divider, CircularProgress, 
    ThemeProvider, useTheme, 
    Alert, // Importação do Alert mantida
} from '@mui/material';
import { 
    Search, Schedule as AccessTime, LocationOn, Person, CheckCircle, Image, Videocam, NoteAlt 
} from '@mui/icons-material';

// ------------------------------------------------------------------------------------------------
// IMPORTAÇÕES LOCAIS
// ------------------------------------------------------------------------------------------------



import { useChecklistData } from '../hooks/useChecklistData'; 
import { formatarDataHora, calcularDuracao } from '../utils/ChecklistUtils'; 
import { ChecklistAnswerCard } from '../components/checklistAnswerCard'; 
import type { TabName } from '../types/Contele.d'; 
import { theme as defaultTheme } from '../styles/Theme'; 

// ------------------------------------------------------------------------------------------------
// SOLUÇÃO FINAL DO ERRO TS2769: CUSTOM GRID ITEM
// ------------------------------------------------------------------------------------------------

// Usamos a tipagem "any" no wrapper para forçar o Grid a aceitar as props de layout
// sem que o TypeScript caia na armadilha da sobrecarga complexa do MUI.
// Fazemos a asserção de tipo diretamente na função.
const CustomGridItem: React.FC<any> = (props) => {
    // Retornamos o Grid com item=true, espalhando as demais props.
    return <Grid item {...props} />;
};

// ------------------------------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------------------------------------------

const ConsultarChecklist: React.FC = () => {
    const theme = useTheme(); 
    
    const {
        visita, 
        loading: isLoading,
        error, 
        osToSearch: numeroTotvs, 
        questionTitlesMap, 
        categorizedAnswers, 
        handleSearch: originalHandleSearch,
        setOsToSearch: setNumeroTotvs,
    } = useChecklistData();

    const [activeTab, setActiveTab] = useState<'standard' | 'photos' | 'videos' | 'observations'>('standard');
    
    const activeAnswers = categorizedAnswers[activeTab] || [];
    
    const handleSearch = () => { originalHandleSearch(numeroTotvs); };
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    
    const tecnico = visita ? visita.userData : null;
    const totalAnswers = useMemo(() => Object.values(categorizedAnswers).flat().length, [categorizedAnswers]);
    const statusColor = visita?.status === 'Finalizado' ? 'success' : 'primary';
    const tagName = visita?.tags[0]?.tagName || 'Geral'; 

    const tabsConfig = useMemo(() => [
        { key: 'standard', label: 'Padrão', icon: <CheckCircle />, color: 'primary', count: categorizedAnswers.standard.length },
        { key: 'photos', label: 'Fotos', icon: <Image />, color: 'warning', count: categorizedAnswers.photos.length },
        { key: 'videos', label: 'Vídeos', icon: <Videocam />, color: 'error', count: categorizedAnswers.videos.length },
        { key: 'observations', label: 'Observações', icon: <NoteAlt />, color: 'info', count: categorizedAnswers.observations.length },
    ], [categorizedAnswers]);

    // ----------------------------------------------------
    // LAYOUT PRINCIPAL 
    // ----------------------------------------------------

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Seção de Busca */}
            <Paper elevation={4} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                    Consultar Checklist da Visita
                </Typography>
                
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
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Paper>
            
            {/* Conteúdo Principal */}
            {visita && (
                <>
                {/* Detalhes da Visita */}
                <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                        
                        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.dark, mb: { xs: 1, md: 0 } }}>
                            <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Cliente: {visita.poi.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary, mr: 1 }}>
                                Status da Visita:
                            </Typography>
                            <Chip label={visita.status.toUpperCase()} color={statusColor as 'primary'|'success'} sx={{ fontWeight: 'bold' }} />
                        </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={3}>
                        <CustomGridItem xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn color="action" sx={{ mr: 1 }} />
                                <Typography variant="body1">
                                    <strong>Endereço:</strong> {visita.poi.address.street}, {visita.poi.address.number}, {visita.poi.address.city} - {visita.poi.address.state}
                                </Typography>
                            </Box>
                        </CustomGridItem>
                        
                        <Divider sx={{ width: '100%', my: 1, mx: 3 }} /> 
                        
                        <CustomGridItem xs={12} md={4}>
                            <Typography variant="body1">
                                <strong>Empresa:</strong> <Chip label={tagName} size="small" variant="outlined" />
                            </Typography>
                        </CustomGridItem>
                        <CustomGridItem xs={12} md={4}>
                            <Typography variant="body1">
                                <strong>N° OS (Contele):</strong> {visita.os}
                            </Typography>
                        </CustomGridItem>
                        <CustomGridItem xs={12} md={4}>
                            <Typography variant="body1">
                                <strong>Observação:</strong> {visita.observation || 'N/A'}
                            </Typography>
                        </CustomGridItem>

                        <Divider sx={{ width: '100%', my: 1, mx: 3 }} />
                        
                        <CustomGridItem xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime color="success" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    <strong>Check-in:</strong> {formatarDataHora(visita.checkinTime)}
                                </Typography>
                            </Box>
                        </CustomGridItem>
                        <CustomGridItem xs={12} sm={6} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime color="error" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                    <strong>Check-out:</strong> {formatarDataHora(visita.checkoutTime)}
                                </Typography>
                            </Box>
                        </CustomGridItem>
                        <CustomGridItem xs={12} sm={12} md={3}>
                            <Typography variant="body1">
                                <strong>Duração Total:</strong> <Chip label={calcularDuracao(visita.checkinTime, visita.checkoutTime)} color="info" size="small" />
                            </Typography>
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
                                Respostas do Checklist
                            </Typography>
                        </Box>

                        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'white' }}>
                            
                            {/* Seletor de Abas (Buttons) */}
                            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: activeTab ? 3 : 0, borderBottom: activeTab ? '1px solid #eee' : 'none' }}>
                                {tabsConfig.map((tab) => (
                                    <Button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                        variant={activeTab === tab.key ? 'contained' : 'outlined'}
                                        color={tab.color as 'primary'|'secondary'|'success'|'error'|'info'|'warning'} 
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

                            {/* Conteúdo da Aba Ativa */}
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
                                                
                                                // Define as colunas (4 para fotos/vídeos/obs, 3 para padrão)
                                                if (activeTab === 'observations' || activeTab === 'videos' || activeTab === 'photos') {
                                                    gridCols = { xs: 12, sm: 6, md: 4 }; 
                                                } else {
                                                    gridCols = { xs: 12, sm: 6, md: 3 }; 
                                                }

                                                return (
                                                    <CustomGridItem key={index} {...gridCols}>
                                                        <ChecklistAnswerCard 
                                                            answer={answer} 
                                                            tabType={activeTab as TabName} 
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
    );
};

export default () => (
    <ThemeProvider theme={defaultTheme}>
        <ConsultarChecklist />
    </ThemeProvider>
);