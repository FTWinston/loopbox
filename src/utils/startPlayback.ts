import { TrackState } from '../types/TrackState';

export function startPlayback(
    audioContext: AudioContext,
    tracks: TrackState[],
    playingSourceNodes: Set<AudioBufferSourceNode>,
    onPlaybackStarted: () => void,
    onPlaybackStopped: () => void,
) {
    // Determine which track has the longest duration.
    // Shorter tracks will loop until the longest track stops.
    const longestTrack = tracks.reduce((prev, current) => {
        return prev.audioBuffer.duration > current.audioBuffer.duration ? prev : current;
    });

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
            // source.loopEnd // TODO: Truncate based on truncateToMultiplesOf and tempo.
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
