import { TrackState } from './TrackState';

export type SoundState = {
    headphones: boolean;
    tracks: TrackState[];
};

export const initialSoundState: SoundState = {
    headphones: false,
    tracks: [],
}