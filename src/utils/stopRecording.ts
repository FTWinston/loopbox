export function stopRecording(
    recorder: MediaRecorder | undefined,
    playingSourceNodes: Set<AudioBufferSourceNode>,
    onRecordingStopped: () => void,
) {
    recorder?.stop();

    for (const sourceNode of playingSourceNodes) {
        sourceNode.stop();
        sourceNode.disconnect();
    }
    
    playingSourceNodes.clear();

    onRecordingStopped();
}