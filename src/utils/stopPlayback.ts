export function stopPlayback(
    playingSourceNodes: Set<AudioBufferSourceNode>,
    onPlaybackStopped: () => void,
) {
    for (const playingSourceNode of playingSourceNodes) {
        playingSourceNode.stop();
        playingSourceNode.disconnect();
    }
    
    playingSourceNodes.clear();
    onPlaybackStopped();
}
