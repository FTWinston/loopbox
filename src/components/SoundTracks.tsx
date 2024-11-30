import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { SoundState } from '../types/SoundState';
import { SoundAction } from '../types/SoundAction';
import { SoundTrack } from './SoundTrack';

interface Props {
    soundState: SoundState;
    soundDispatch: React.Dispatch<SoundAction>;
}

export const SoundTracks: React.FC<Props> = (props) => {
    return (
        <Paper square sx={{ pb: '50px' }}>
            <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
                Sound Channels
            </Typography>
            <List sx={{ mb: 2 }}>
                {props.soundState.tracks.map((track, index) => (
                    <SoundTrack
                        key={index}
                        volume={track.volume}
                        muted={track.muted}
                    />
                ))}
            </List>
        </Paper>
    );
}