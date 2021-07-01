import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ReactPlayer from 'react-player';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { aws } from '../../../keys';
import S3 from 'aws-s3';
import { API_URL } from '../../../api-url';

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

    const [file, setFile] = useState();

    const config = {
        bucketName: 'outponged-post',
        region: 'us-east-1',
        accessKeyId: aws.AWSAccessKeyId,
        secretAccessKey: aws.AWSSecretKey,
        s3Url: 'https://outponged-post.s3.amazonaws.com/'
    }

    const S3Client = new S3(config);

    const onUpload = (e) => {
        console.log("file uploaded", e.currentTarget.files[0]);
        if (e.currentTarget?.files[0]?.size > 650000000) {
            alert("file too big!");
        } else {
            setFile(e.currentTarget.files[0]);
            // if (file?.type.includes("video")) {
            //     console.log("file type: video");
            // } else {
            //     console.log("file type: image");
            // }
        }
    }

    const viewPost = () => {
        if (!file) {
            console.log("no file");
            return (
                <CardMedia
                    className={classes.videoPlayer}
                    media="picture"
                    alt="Title"
                    image="https://upload.wikimedia.org/wikipedia/commons/4/41/Ma_Long_2013.jpg"
                />
            );
        }
        if (file.type.includes("video")) {
            return (
                // <ReactPlayer
                //     url={URL.createObjectURL(file)}
                //     className={classes.videoPlayer}
                //     controls="true"
                // />
                <CardMedia
                    className={classes.videoPlayer}
                    component="video"
                    alt="Title"
                    image={URL.createObjectURL(file)}
                    controls="true"
                />
            );
        }
        else {
            return (
                <CardMedia
                    className={classes.videoPlayer}
                    media="picture"
                    alt="Title"
                    image={URL.createObjectURL(file)}
                />
            )
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        S3Client
            .uploadFile(file)
            .then((data) => {
                console.log('data', data);
                const url = data.location.replace('.com//', '.com/');
                console.log('url', url);
                // const patch = {
                //     method: 'PATCH',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({ 'postUrl': url })
                // }
            })
            .catch((err) => {
                alert(err);
            })
    }

    const renderPostCard = () => {

        // const forceUpdate = useForceUpdate();

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
                            {viewPost()}
                            <CardActions className={classes.cardContent}>
                                <Button
                                    size="small"
                                    color="inherit"
                                    variant="outlined"
                                    component="label"
                                // onClick={forceUpdate}
                                >
                                    Upload
                                    <input
                                        hidden
                                        type="file"
                                        accept="video/*, image/*"
                                        onChange={onUpload}
                                    />
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