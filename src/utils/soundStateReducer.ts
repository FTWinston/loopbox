import { SoundAction } from '../types/SoundAction';
import { SoundState } from '../types/SoundState';

export function soundStateReducer(soundState: SoundState, action: SoundAction): SoundState {
    switch (action.type) {
        case 'toggleHeadphones':
            return {
                ...soundState,
                headphones: !soundState.headphones
            };
        default:
            return soundState;
    }
}