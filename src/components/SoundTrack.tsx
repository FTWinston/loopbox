import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface Props {
    volume: number;
    muted: boolean;
}

export const SoundTrack: React.FC<Props> = (props) => {
    return (
        <Paper>
            <Typography>
                volume: {props.volume}
            </Typography>
            <Typography>
                muted: {props.muted ? 'true' : 'false'}
            </Typography>
        </Paper>
    );
}