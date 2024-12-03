export function startRecording(
    audioContext: AudioContext,
    recorder: MediaRecorder,
    tempo: number,
    setMetronomeSource: (source: AudioBufferSourceNode) => void,
) {
    // Define a buffer containing a beat: one short peak followed by silence.
    const beatInterval = 60 / tempo;
    const frameCount = audioContext.sampleRate * beatInterval;
    const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    data[0] = 1;

    // Create a looping audio source from this buffer.
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    source.connect(audioContext.destination);

    source.start();
    recorder.start();

    setMetronomeSource(source);
}
