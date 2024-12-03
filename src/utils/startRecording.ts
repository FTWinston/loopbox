export function startRecording(
    recorder: MediaRecorder | undefined,
    onRecordingStarted: () => void,
) {
    recorder?.start();
    onRecordingStarted();
}
