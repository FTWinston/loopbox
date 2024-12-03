export async function setupMicrophone(
    audioContext: AudioContext,
    saveAudioTrack: (audio: AudioBuffer) => void,
    setRecorder: (recorder: MediaRecorder) => void,
) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    const recordingAudioChunks: Blob[] = [];

    recorder.ondataavailable = event => {
        recordingAudioChunks.push(event.data);
    };

    recorder.onstart = () => {
        recordingAudioChunks.splice(0, recordingAudioChunks.length);
    }

    recorder.onstop = async () => {
        const audioBlob = new Blob(recordingAudioChunks, { type: 'audio/wav' });
        const buffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(buffer);

        saveAudioTrack(audioBuffer);
        recordingAudioChunks.splice(0, recordingAudioChunks.length);
    };

    setRecorder(recorder);
};
