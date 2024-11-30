export type TrackState = {
    volume: number;
    muted: boolean;
};

export const initialTrackState: TrackState = {
    volume: 50,
    muted: false,
};