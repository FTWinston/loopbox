import { TrackState } from '../types/TrackState';

export function startPlayback(
    audioContext: AudioContext,
    tracks: TrackState[],
    tempo: number,
    truncateToMultiplesOf: number,
    playingSourceNodes: Set<AudioBufferSourceNode>,
    onPlaybackStarted: () => void,
    onPlaybackStopped: () => void,
) {
    // Determine which track has the longest duration.
    // Shorter tracks will loop until the longest track stops.
    const longestTrack = tracks.reduce((prev, current) => {
        return prev.audioBuffer.duration > current.audioBuffer.duration ? prev : current;
    });

    const truncationInterval = truncateToMultiplesOf * 60 / tempo;

    for (const track of tracks) {
        // Create a source to play each track.
        const source = audioContext.createBufferSource();
        source.buffer = track.audioBuffer;
        source.connect(audioContext.destination);

        if (track === longestTrack) {
            source.onended = () => {
                // When the longest track stops, stop all others from looping.
                for (const sourceNode of playingSourceNodes) {
                    sourceNode.loop = false;
                }

                // If this was the last/only track, mark playback as stopped.
                playingSourceNodes.delete(source);
                if (playingSourceNodes.size === 0) {
                    onPlaybackStopped();
                }
            };
        }
        else {
            source.loop = true;

            // Truncate this source so that it loops based on truncateToMultiplesOf and tempo.
            // This will ensure that it loops in time with the tempo.
            source.loopEnd = Math.floor(source.buffer.duration / truncationInterval) * truncationInterval;

            source.onended = () => {
                // If this was the last track, mark playback as stopped.
                playingSourceNodes.delete(source);
                if (playingSourceNodes.size === 0) {
                    onPlaybackStopped();
                }
            };
        };

        // Keep track of this source node, and start playing.
        playingSourceNodes.add(source);
        source.start();
    }

    onPlaybackStarted();
}
