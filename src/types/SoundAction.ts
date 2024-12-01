export type SoundAction = {
    type: 'toggleHeadphones';
} | {
    type: 'accessGranted';
} | {
    type: 'record';
} | {
    type: 'play';
} | {
    type: 'stop';
} | {
    type: 'addTrack';
    audio: HTMLAudioElement;
}