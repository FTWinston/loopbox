export type TrackState = {
    volume: number;
    muted: boolean;
    audio: HTMLAudioElement; // TODO: should be AudioBuffer instead?
};
