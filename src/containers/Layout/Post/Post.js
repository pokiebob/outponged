import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ReactPlayer from 'react-player';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { autoShowTooltip } from "@aws-amplify/ui";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        justify: "center",
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '50ch',
        },
    },
    paper: {
        marginTop: "30px",
        width: 800
    },
    bar: {
        border: "none",
        boxShadow: "none"
    },
    container: {
        marginTop: "20px",
        marginBottom: "20px",
    },
    photoButton: {
        color: theme.palette.info.main,
        justifyContent: "center",
        display: "flex",
        marginTop: "10px"
    },

    subheading: {
        color: theme.palette.text.primary,
        textAlign: "center",
        "font-size": "15px",
    },
    subtext: {
        color: theme.palette.text.secondary,
        textAlign: "center",
        "font-size": "13px",
    },
    usattLabel: {
        color: theme.palette.text.secondary,
        textAlign: "center",
        "font-size": "13px",
        marginTop: "30px",
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginLeft: "40px",
    },
    name: {
        marginTop: "10px",
        marginLeft: "40px",
        "font-size": "20px",
    },
    header: {
        "font-size": "32px",
        textAlign: "center",
        marginBottom: "15px"
    },
    videoWrapper: {
        position: "relative",
        paddingTop: "56.25%",
        left: "40px"
    },
    videoPlayer: {
        position: "absolute",
        top: "0",
        height: "100%",
        width: "100%"
    },
    cardContent: {
        position: "relative",
        color: "#ffffff",
        justifyContent: "flex-end"
        // backgroundColor: "transparent"
    }
}));

const post = () => {
    const classes = useStyles();

    const renderPostCard = () => {

        return (
            <Paper className={classes.paper}>
                <Grid container className={classes.container} spacing={2}>
                    <Grid sm={12} item >
                        <div className={classes.header}>New Post</div>
                    </Grid>
                    <Grid item sm={1} >
                        <Avatar className={classes.small}></Avatar>
                    </Grid>
                    <Grid item sm={11}>
                        <div className={classes.name}>UserName</div>
                    </Grid>
                    <Grid xs={8} item >
                        <Card className={classes.videoWrapper}>
                            {/* <CardActionArea> */}
                            {/* <ReactPlayer
                                    url='https://www.youtube.com/watch?v=hh-X60E0ySI'
                                    className={classes.videoPlayer}
                                    width='60%'
                                    height='60%'
                                /> */}
                            <CardMedia
                                className={classes.videoPlayer}
                                media="picture"
                                alt="Title"
                                image="https://upload.wikimedia.org/wikipedia/commons/4/41/Ma_Long_2013.jpg"
                                title="Title"
                            />
                            {/* </CardActionArea> */}
                            <CardActions className={classes.cardContent}>
                                <Button
                                    size="small"
                                    color="inherit"
                                    variant="outlined"
                                >
                                    Edit
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        )
    }

    const renderPost = () => {
        return (
            <div className={classes.root}>
                <Grid container justify="center" >
                    {renderPostCard()}
                </Grid>
            </div>
        );
    }

    return (renderPost());
}

export default post;