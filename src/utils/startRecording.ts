export function startRecording(
    audioContext: AudioContext,
    recorder: MediaRecorder,
    tempo: number,
    introBeats: number,
    startIntro: (source: AudioBufferSourceNode, stopIntro: () => void) => void,
    setRemainingIntroBeats: (beats: number) => void,
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

    let beatsRemaining = introBeats;
    setRemainingIntroBeats(beatsRemaining);

    // Start the recorder once the required number of beats have passed.
    let introTimer: number | undefined = setInterval(() => {
        beatsRemaining--;
        if (beatsRemaining <= 0) {
            clearInterval(introTimer);
            introTimer = undefined;
            recorder.start();
        }
        setRemainingIntroBeats(beatsRemaining);
    }, beatInterval * 1000);

    // Pass out a function to stop the intro, so that if recording stops during the intro, it doesn't still start recording after.
    const stopIntro = () => {
        if (introTimer !== undefined) {
            clearInterval(introTimer);
            introTimer = undefined;
        }
    }

    startIntro(source, stopIntro);
}
