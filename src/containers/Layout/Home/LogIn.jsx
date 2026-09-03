import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '../../../makeStyles';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React from 'react';
import GoogleButton from 'react-google-button';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://global-uploads.webflow.com/5b44edefca321a1e2d0c2aa6/5fc5965e2b09e400cc962362_Dimensions-Sports-Ping-Pong-Paddle-Table-Tennis-Racket-Dimensions.svg)',
        backgroundColor:
            theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        marginTop: theme.spacing(5)
    },
}));

const logIn = ({ handleLogIn }) => {
    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h2">
                        OutPonged
                    </Typography>
                    {/* <Typography component="h2" variant="h5">
                    Sign in
                    </Typography> */}
                    <span className={classes.form} >
                        <GoogleButton onClick={handleLogIn} />
                    </span>
                </div>
            </Grid>
        </Grid>
    );
}

export default logIn;
