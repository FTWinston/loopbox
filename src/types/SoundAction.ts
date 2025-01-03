import { WorkspaceState } from './WorkspaceState';

export type SoundAction = {
    type: 'setWorkspace';
    workspace: WorkspaceState;
} | {
    type: 'toggleHeadphones';
} | {
    type: 'intro';
} | {
    type: 'record';
} | {
    type: 'play';
} | {
    type: 'stop';
} | {
    type: 'addTrack';
    audio: AudioBuffer;
}