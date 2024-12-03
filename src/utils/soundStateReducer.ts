import { SoundAction } from '../types/SoundAction';
import { SoundState } from '../types/SoundState';
import { TrackState } from '../types/TrackState';

export function soundStateReducer(soundState: SoundState, action: SoundAction): SoundState {
    switch (action.type) {
        case 'setWorkspace': {
            return {
                ...soundState,
                workspace: action.workspace,
            };
        }
        case 'record': {
            if (soundState.mode !== 'stopped') {
                return soundState;
            }

            return {
                ...soundState,
                mode: 'recording',
            };
        }
        case 'play': {
            if (soundState.mode !== 'stopped' || soundState.tracks.length === 0) {
                return soundState;
            }
            
            // TODO: trigger a stop action when playback is done.

            return {
                ...soundState,
                mode: 'playing',
            };
        }
        case 'stop': {
            if (soundState.audioContext.state === 'suspended') {
                soundState.audioContext.resume();
            }

            if (soundState.mode !== 'stopped') {
                return {
                    ...soundState,
                    mode: 'stopped',
                };
            }
            
            return soundState;
        }
        case 'addTrack': {
            if (soundState.mode === 'noAccess') {
                return soundState;
            }

            const newTrack: TrackState = {
                audioBuffer: action.audio,
                volume: 1,
                muted: false
            };

            return {
                ...soundState,
                tracks: [...soundState.tracks, newTrack],
            };
        }
        case 'toggleHeadphones': {
            return {
                ...soundState,
                headphones: !soundState.headphones,
            };
        }
        default: {
            return soundState;
        }
    }
}