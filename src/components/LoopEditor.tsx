import { useImmerReducer } from 'use-immer';
import { initialSoundState } from '../types/SoundState';
import { soundStateReducer } from '../utils/soundStateReducer';
import { ActionBar } from './ActionBar';
import { SoundTracks } from './SoundTracks';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material';

export const LoopEditor = () => {
    const [soundState, soundDispatch] = useImmerReducer(soundStateReducer, initialSoundState);
    const theme = useTheme();

    return (
        <Container maxWidth="md" sx={{backgroundColor: theme.palette.background.paper, minHeight: '100vh'}}>
            <SoundTracks soundState={soundState} soundDispatch={soundDispatch} />
            <ActionBar soundState={soundState} soundDispatch={soundDispatch} />
        </Container>
    )
}
