import { createTheme } from '@mui/material/styles';

// Configuração do Tema Material UI
export const theme = createTheme({
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