import Container from '@mui/material/Container';
import { useReducer } from 'react';
import { initialSoundState } from '../types/SoundState';
import { soundStateReducer } from '../utils/soundStateReducer';
import { ActionBar } from './ActionBar';
import { SoundTracks } from './SoundTracks';

export const LoopEditor = () => {
    const [soundState, soundDispatch] = useReducer(soundStateReducer, initialSoundState);
    
    return (
        <Container maxWidth="md" sx={{minHeight: '100vh'}}>
            <SoundTracks soundState={soundState} soundDispatch={soundDispatch} />
            <ActionBar soundState={soundState} soundDispatch={soundDispatch} />
        </Container>
    )
}
