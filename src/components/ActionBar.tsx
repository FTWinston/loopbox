
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import MenuIcon from '@mui/icons-material/Menu';
import HeadphonesIcon from '@mui/icons-material/Headset';
import HeadphonesOffIcon from '@mui/icons-material/HeadsetOff';
import MoreIcon from '@mui/icons-material/MoreVert';
import RecordIcon from '@mui/icons-material/Mic';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useEffect, useRef } from 'react';
import { SoundState } from '../types/SoundState';
import { SoundAction } from '../types/SoundAction';

interface Props {
    soundState: SoundState;
    soundDispatch: React.Dispatch<SoundAction>;
}

const FabBox = styled(Box)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    left: 0,
    right: 0,
    margin: '0 auto',
});

export const ActionBar: React.FC<Props> = ({ soundState, soundDispatch }) => {
    const theme = useTheme();

    const recordingAudioChunks = useRef<Blob[]>([]);
    const recorder = useRef<MediaRecorder>();
    const trackSourceNodes = useRef<AudioBufferSourceNode[]>([]);
    
    const audioContext = soundState.audioContext;

    useEffect(() => {
        const accessMicrophone = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            recorder.current = new MediaRecorder(stream);

            recorder.current.ondataavailable = event => {
                recordingAudioChunks.current.push(event.data);
            };
        
            recorder.current.onstart = () => {
                recordingAudioChunks.current = [];
            }
        
            recorder.current.onstop = async () => {
                const audioBlob = new Blob(recordingAudioChunks.current, { type: 'audio/wav' });
                const buffer = await audioBlob.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(buffer);

                soundDispatch({ type: 'addTrack', audio: audioBuffer });
                recordingAudioChunks.current = [];
            };

            soundDispatch({ type: 'accessGranted' });
        };

        accessMicrophone();
    }, []);

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
    
    const stopped = soundState.mode === 'stopped';
    const disableRecord = soundState.mode === 'noAccess';
    const disablePlayback = soundState.tracks.length === 0;

    return (
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer">
                    <MenuIcon />
                </IconButton>

                <Zoom
                    in={stopped}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${stopped ? transitionDuration.exit : 0}ms`,
                    }}
                >
                    <FabBox>
                        <Fab
                            color="primary"
                            aria-label="record"
                            onClick={() => {
                                soundDispatch({ type: 'record' });
                                recorder.current?.start();
                            }}
                            disabled={disableRecord}
                            sx={{backgroundColor: disableRecord ? `${theme.palette.grey[800]} !important` : undefined}}
                        >
                            <RecordIcon />
                        </Fab>
                        <Fab
                            color="secondary"
                            aria-label="playback"
                            onClick={() => {
                                for (const track of soundState.tracks) {
                                    const source = soundState.audioContext.createBufferSource();
                                    source.buffer = track.audioBuffer;
                                    source.connect(soundState.audioContext.destination);
                                    source.start();
                                    trackSourceNodes.current.push(source);
                                }

                                soundDispatch({ type: 'play' })
                            }}
                            disabled={disablePlayback}
                            sx={{backgroundColor: disablePlayback ? `${theme.palette.grey[800]} !important` : undefined}}
                        >
                            <PlayIcon />
                        </Fab>
                    </FabBox>
                </Zoom>
                
                <Zoom
                    in={!stopped}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${!stopped ? transitionDuration.exit : 0}ms`,
                    }}
                >
                    <FabBox>
                        <Fab
                            color="error"
                            aria-label="stop"
                            onClick={() => {
                                if (soundState.mode === 'recording') {
                                    recorder.current?.stop();
                                }
                                else if (soundState.mode === 'playing') {
                                    for (const trackSourceNode of trackSourceNodes.current) {
                                        trackSourceNode.stop();
                                    }
                                    trackSourceNodes.current = [];
                                }
                                soundDispatch({ type: 'stop' })
                            }}
                        >
                            <StopIcon />
                        </Fab>
                    </FabBox>
                </Zoom>

                <Box sx={{ flexGrow: 1 }} />

                <IconButton color="primary" onClick={() => soundDispatch({ type: 'toggleHeadphones' })}>
                    {soundState.headphones ? <HeadphonesIcon /> : <HeadphonesOffIcon />}
                </IconButton>
                <IconButton color="inherit">
                    <MoreIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}