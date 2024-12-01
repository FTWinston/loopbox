import { SoundAction } from '../types/SoundAction';
import { SoundState } from '../types/SoundState';

export function soundStateReducer(soundState: SoundState, action: SoundAction): SoundState {
    switch (action.type) {
        case 'accessGranted': {
            return {
                ...soundState,
                mode: 'stopped',
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
            
            soundState.tracks[0].audio.play();

            // TODO: trigger a stop action when playback is done.

            return {
                ...soundState,
                mode: 'playing',
            };
        }
        case 'stop': {
            if (soundState.mode === 'recording' || soundState.mode === 'playing') {
                return {
                    ...soundState,
                    mode: 'stopped',
                };
            }
            
            return soundState;
        }
        case 'addTrack': {
            const newTrack = {
                audio: action.audio,
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