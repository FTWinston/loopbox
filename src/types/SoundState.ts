import { TrackState } from './TrackState';

export type SoundState = {
    mode: 'noAccess' | 'recording' | 'playing' | 'stopped';
    // audioContext: AudioContext;
    headphones: boolean;
    tracks: TrackState[];
};

export const initialSoundState: SoundState = {
    mode: 'noAccess',
    // audioContext: new AudioContext(),
    headphones: false,
    tracks: [],
}