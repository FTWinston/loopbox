
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HeadphonesIcon from '@mui/icons-material/Headset';
import HeadphonesOffIcon from '@mui/icons-material/HeadsetOff';
import MoreIcon from '@mui/icons-material/MoreVert';
import { styled, useTheme } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import RecordIcon from '@mui/icons-material/Mic';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import Zoom from '@mui/material/Zoom';
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
        
            recorder.current.onstop = () => {
                const audioBlob = new Blob(recordingAudioChunks.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
            
                soundDispatch({ type: 'addTrack', audio });
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
                            onClick={() => soundDispatch({ type: 'play' })}
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
                                soundDispatch({ type: 'stop' })
                                recorder.current?.stop();
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