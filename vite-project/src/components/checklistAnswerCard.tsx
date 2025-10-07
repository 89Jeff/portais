// Importação Corrigida: Adicionando useState
import React, { useState } from 'react';
import { Paper, Typography, Box, Divider, Button, useTheme } from '@mui/material';
import { 
    CheckCircleOutline, 
    CancelOutlined, 
    NoteAlt, 
    Visibility, 
    Image, 
    TextSnippet, 
    Videocam,
} from '@mui/icons-material';

import { 
    isImageUrl, 
    isVideoUrl, 
    isLongObservation 
} from '../utils/ChecklistUtils';

import type { Answer, Segment, TabName } from '../types/Contele.d.tsx'; 

// =========================================================================
// COMPONENTE DE EXIBIÇÃO DA RESPOSTA
// =========================================================================

interface ChecklistAnswerCardProps {
    answer: Answer;
    tabType: TabName;
    questionTitlesMap: Record<string, Segment>; 
}

export const ChecklistAnswerCard: React.FC<ChecklistAnswerCardProps> = ({ answer, questionTitlesMap }) => {
    const [imageLoadError, setImageLoadError] = useState(false); 
    const theme = useTheme(); // Usando useTheme para acessar as cores

    const questionId = answer.form_question_id;
    const questionConfig = questionTitlesMap[questionId] || { title: `Pergunta ID: ${questionId.substring(0, 8)}...`, type: 'text_question', options: [] };

    let rawText = answer.answer?.trim() || '*Não respondido*';
    if (questionConfig.type === "radio_question") {
      rawText = questionConfig.options.find((opt) => opt.id === rawText)?.label || rawText;
    }

    const title = questionConfig.title || rawText;
    const text = rawText === '*Não respondido*' ? rawText : rawText.toUpperCase();
    
    const isYes = text === 'SIM';
    const isNo = text === 'NÃO' || text === 'NAO';
    const isPhoto = isImageUrl(rawText);
    const isVideo = isVideoUrl(rawText);
    const isObservation = isLongObservation(rawText);
    
    let color = 'text.primary';
    let icon = <TextSnippet fontSize="small" />;
    let bgColor = '#ffffff';

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