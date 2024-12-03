export type WorkspaceState = {
    tempo: number;
    introBeats: number;
    truncateToMultiplesOf: number;
};

export const initialWorkspaceState: WorkspaceState = {
    tempo: 100,
    introBeats: 4,
    truncateToMultiplesOf: 8,
}