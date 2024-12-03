import { TrackState } from './TrackState';
import { initialWorkspaceState, WorkspaceState } from './WorkspaceState';

export type SoundState = {
    workspace: WorkspaceState;
    mode: 'noAccess' | 'intro' | 'recording' | 'playing' | 'stopped';
    audioContext: AudioContext;
    headphones: boolean;
    tracks: TrackState[];
}

export const initialSoundState: SoundState = {
    workspace: initialWorkspaceState,
    mode: 'noAccess',
    audioContext: new AudioContext(),
    headphones: false,
    tracks: [],
}