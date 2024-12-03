export function stopRecording(
    recorder: MediaRecorder | undefined,
    onRecordingStopped: () => void,
) {
    recorder?.stop();
    onRecordingStopped();
}