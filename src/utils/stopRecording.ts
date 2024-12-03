export function stopRecording(
    recorder: MediaRecorder | undefined,
    metronomeSourceNode: AudioBufferSourceNode | undefined,
    onRecordingStopped: () => void,
) {
    recorder?.stop();
    metronomeSourceNode?.stop();
    metronomeSourceNode?.disconnect();
    onRecordingStopped();
}