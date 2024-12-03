
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';
import MenuIcon from '@mui/icons-material/Tune';
import HeadphonesIcon from '@mui/icons-material/Headset';
import HeadphonesOffIcon from '@mui/icons-material/HeadsetOff';
import MoreIcon from '@mui/icons-material/MoreVert';
import RecordIcon from '@mui/icons-material/Mic';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useEffect, useRef, useState } from 'react';
import { SoundState } from '../types/SoundState';
import { SoundAction } from '../types/SoundAction';
import { WorkspaceSettings } from './WorkspaceSettings';
import { setupMicrophone } from '../utils/setupMicrophone';
import { startRecording } from '../utils/startRecording';
import { startPlayback } from '../utils/startPlayback';
import { stopRecording } from '../utils/stopRecording';
import { stopPlayback } from '../utils/stopPlayback';
import Typography from '@mui/material/Typography';

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

    const recorder = useRef<MediaRecorder>();
    const introTimeout = useRef<() => void>();
    const [introBeats, setIntroBeats] = useState(soundState.workspace.introBeats);
    const metronomeSourceNode = useRef<AudioBufferSourceNode>();
    const playingSourceNodes = useRef<Set<AudioBufferSourceNode>>(new Set());
    
    const setStateToStopped = () => soundDispatch({ type: 'stop' });
    const setStateToPlayback = () => soundDispatch({ type: 'play' });
    const setStateToIntro = () => soundDispatch({ type: 'intro' });
    const setStateToRecording = () => soundDispatch({ type: 'record' });

    useEffect(() => {
        const saveAudioTrack = (audio: AudioBuffer) => soundDispatch({ type: 'addTrack', audio });

        const setRecorder = (newRecorder: MediaRecorder) => {
            recorder.current = newRecorder;
            setStateToStopped();
        }

        setupMicrophone(soundState.audioContext, saveAudioTrack, setRecorder);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [showingSettings, showSettings] = useState(true);
    
    const showPlayRecord = soundState.mode === 'stopped' && !showingSettings;
    const showStop = soundState.mode !== 'stopped' && !showingSettings;
    const disableRecord = soundState.mode === 'noAccess';
    const disablePlayback = soundState.tracks.length === 0;
    const disableSettings = showingSettings || soundState.mode !== 'stopped';
    const introMode = soundState.mode === 'intro';

    return (
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="edit settings"
                    disabled={disableSettings}
                    onClick={() => showSettings(true)}
                >
                    <MenuIcon />
                </IconButton>

                <Zoom
                    in={showPlayRecord}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${showPlayRecord ? transitionDuration.exit : 0}ms`,
                    }}
                >
                    <FabBox>
                        <Fab
                            color="primary"
                            aria-label="record"
                            onClick={() => {
                                if (recorder.current) {
                                    startRecording(
                                        soundState.audioContext,
                                        recorder.current,
                                        soundState.workspace.tempo,
                                        soundState.workspace.introBeats,
                                        (oscillator, stopIntro) => {
                                            metronomeSourceNode.current = oscillator;
                                            introTimeout.current = stopIntro;
                                            setStateToIntro();
                                        },
                                        (beatsRemaining) => {
                                            if (beatsRemaining === 0) {
                                                setStateToRecording();
                                            }
                                            else {
                                                setIntroBeats(beatsRemaining);
                                            }
                                        }
                                    )
                                }
                            }}
                            disabled={disableRecord}
                            sx={{backgroundColor: disableRecord ? `${theme.palette.grey[800]} !important` : undefined}}
                        >
                            <RecordIcon />
                        </Fab>
                        <Fab
                            color="secondary"
                            aria-label="playback"
                            onClick={() => startPlayback(soundState.audioContext, soundState.tracks, playingSourceNodes.current, setStateToPlayback, setStateToStopped)}
                            disabled={disablePlayback}
                            sx={{backgroundColor: disablePlayback ? `${theme.palette.grey[800]} !important` : undefined}}
                        >
                            <PlayIcon />
                        </Fab>
                    </FabBox>
                </Zoom>
                
                <Zoom
                    in={showStop}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${showStop ? transitionDuration.exit : 0}ms`,
                    }}
                >
                    <FabBox>
                        <Fab
                            color={introMode ? 'warning' : 'error'}
                            aria-label="stop"
                            onClick={() => {
                                if (soundState.mode === 'playing') {
                                    stopPlayback(playingSourceNodes.current, setStateToStopped);
                                }
                                else {
                                    stopRecording(recorder.current, metronomeSourceNode.current, () => {
                                        metronomeSourceNode.current = undefined;
                                        introTimeout.current?.();
                                        introTimeout.current = undefined;
                                        setStateToStopped()
                                    });
                                }
                            }}
                        >
                            {introMode ? <Typography fontWeight="700">{introBeats}</Typography> : <StopIcon />}
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
            
            <Modal
                open={showingSettings}
                onClose={() => showSettings(false)}
            >
                <Box>
                    <WorkspaceSettings
                        state={soundState.workspace}
                        close={workspace => {
                            showSettings(false);
                            soundDispatch({ type: 'setWorkspace', workspace })
                        }}
                    />
                </Box>
            </Modal>
        </AppBar>
    );
}
