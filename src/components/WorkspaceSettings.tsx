import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import TempoIcon from '@mui/icons-material/MusicNote';
import IntroIcon from '@mui/icons-material/Timer';
import TruncateIcon from '@mui/icons-material/ContentCut';
import { useState } from 'react';
import { initialWorkspaceState, WorkspaceState } from '../types/WorkspaceState';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface Props {
    state: WorkspaceState;
    close: (state: WorkspaceState) => void;
}

export const WorkspaceSettings: React.FC<Props> = (props) => {
    const [tempo, setTempo] = useState(props.state.tempo.toString());
    const [introBeats, setIntroBeats] = useState(props.state.introBeats.toString());
    const [truncateBeats, setTruncateBeats] = useState(props.state.truncateToMultiplesOf.toString());

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 2,
                position: 'fixed',
                top: 'auto',
                bottom: 32,
                left: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: 300,
            }}
        >
            <TextField
                label="Tempo"
                fullWidth
                value={tempo}
                onChange={e => setTempo(e.target.value)}
                helperText="Number of beats per minute"
                slotProps={{
                    htmlInput: {
                        type: 'number',
                        inputMode: 'numeric',
                        sx: {textAlign: 'right'},
                        min: 10,
                        max: 300,
                    },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <TempoIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">bpm</InputAdornment>
                        ),
                    },
                }}
                variant="standard"
            />

            
            <TextField
                label="Intro"
                fullWidth
                value={introBeats}
                onChange={e => setIntroBeats(e.target.value)}
                helperText="How many beats to play before recording"
                slotProps={{
                    htmlInput: {
                        type: 'number',
                        inputMode: 'numeric',
                        sx: {textAlign: 'right'},
                        min: 2,
                        max: 32,
                    },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <IntroIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">beats</InputAdornment>
                        ),
                    },
                }}
                variant="standard"
            />

            <TextField
                label="Truncate to nearest"
                fullWidth
                value={truncateBeats}
                onChange={e => setTruncateBeats(e.target.value)}
                helperText="When tracks have different lengths, shorter ones will be cut short, to the nearest multiple of this quantity of beats, so they can be looped neatly"
                slotProps={{
                    htmlInput: {
                        type: 'number',
                        inputMode: 'numeric',
                        sx: {textAlign: 'right'},
                        min: 0,
                        max: 32,
                    },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <TruncateIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">beats</InputAdornment>
                        ),
                    },
                }}
                variant="standard"
            />

            <Box display="flex" gap={2}>
                <Button
                    variant="contained"
                    onClick={() => props.close({
                        tempo: parseInt(tempo),
                        introBeats: parseInt(introBeats),
                        truncateToMultiplesOf: parseInt(truncateBeats),
                    })}
                >
                    Save
                </Button>
                <Button
                    variant="outlined"
                    disabled={props.state === initialWorkspaceState}
                    onClick={() => props.close(props.state)}
                >
                    Cancel
                </Button>
            </Box>
        </Paper>
    );
}