import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StrictMode, useMemo } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { LoopEditor } from './LoopEditor';

export const App: React.FC = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
      () => createTheme({ palette: { mode: prefersDarkMode ? 'dark' : 'light', }, }),
      [prefersDarkMode]
    );

    return (
        <StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <LoopEditor />
            </ThemeProvider>
        </StrictMode>
    )
}
