import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../Context";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from '@material-ui/icons/Create';
import ReactPlayer from 'react-player';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { aws } from '../../../keys';
import S3 from 'aws-s3';
import { API_URL } from '../../../api-url';
import { TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        justify: "center",
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
        marginBottom: "10px",
        marginLeft: "40px"
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    editIcon: {
        width: theme.spacing(5),
        height: theme.spacing(5)
    },
    name: {
        marginTop: "10px",
        "font-size": "20px",
        marginLeft: "20px",
    },
    videoWrapper: {
        position: "relative",
        paddingTop: "56.25%",
        marginTop: "10px",
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
    },
    form: {
        marginTop: "2px",
    },
    createPost: {
        marginTop: "15px",
        whiteSpace: "nowrap"
    }
}));


const post = () => {
    const classes = useStyles();

    const history = useHistory();

    const [file, setFile] = useState();

    // the context modified in Home when user logs in
    const [userContext, setUserContext] = useContext(Context);
    console.log(userContext);

    // const personId = user?.attributes?.sub;
    // console.log("personId", personId);
    const postRef = React.useRef();

    const updatePostRef = (key, value) => {
        const temp = { ...postRef.current };
        temp[key] = value;
        postRef.current = temp;
        // setPostState(temp);
        // console.log("postRef", postRef.current);
    }

    const config = {
        bucketName: 'outponged-post',
        region: 'us-east-1',
        accessKeyId: aws.AWSAccessKeyId,
        secretAccessKey: aws.AWSSecretKey,
        s3Url: 'https://outponged-post.s3.amazonaws.com/'
    }

    const S3Client = new S3(config);

    const onUpload = (e) => {

        // console.log("file uploaded", e.currentTarget.files[0]);
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

    const displayFile = () => {
        if (!file) {
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
        console.log('submitting', postRef.current);

        S3Client
            .uploadFile(file)
            .then((data) => {
                console.log('data', data);
                const url = data.location.replace('.com//', '.com/');
                console.log('url', url);
                const post = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            "ownerId" : userContext.personId,
                            "ownerType" : "person",
                            "visibility" : {
                                "level" : "public"
                            },
                            "fileUrl": url,
                            "title" : postRef.current.title,
                            "description" : postRef.current.description,
                        }
                    )
                }

                fetch(API_URL.post, post)
                    .then(resp => resp.json())
                    .then((resp) => {
                        console.log(resp);
                        navigateToPersonProfile(userContext.personId);
                    });
            })
            .catch((err) => {
                alert(err);
            });
    }

    const navigateToPersonProfile = (personId) => {
        history.push("/person-profile/" + personId);
    }

    const renderPostCard = () => {

        return (
            <Paper className={classes.paper}>
                <Grid direction="column" className={classes.container} >
                    {/* <Grid container>
                        <Grid xs={12} item >
                            <div className={classes.header}>New Post</div>
                        </Grid>
                    </Grid> */}
                    <Grid container spacing={0}>
                        <Grid item >
                            <Avatar src={userContext?.pictureUrl} className={classes.small}></Avatar>
                        </Grid>
                        <Grid item >
                            <div className={classes.name}>{`${userContext?.firstName} ${userContext?.lastName}`}</div>
                        </Grid>
                    </Grid>

                    <Grid xs={6} item >
                        <Card className={classes.videoWrapper}>
                            {displayFile()}
                            <CardActions className={classes.cardContent}>
                                <IconButton
                                    color="inherit"
                                    component="label"
                                >
                                    <CreateIcon className={classes.editIcon} />
                                    <input
                                        hidden
                                        type="file"
                                        accept="video/*, image/*"
                                        onChange={onUpload}
                                    />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <form
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <Grid container>
                            <Grid item xs={10}>
                                <TextField
                                    id="title"
                                    label="Title"
                                    fullWidth
                                    required
                                    className={classes.form}
                                    onInput={e => updatePostRef("title", e.target.value)}
                                    inputProps={{ maxLength: 70 }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={10}>
                                <TextField
                                    id="description"
                                    label="Description"
                                    multiline
                                    rowsMax={10}
                                    fullWidth
                                    className={classes.form}
                                    inputProps={{ maxLength: 1000 }}
                                    onInput={e => updatePostRef("description", e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item >
                                <Button
                                    color="primary"
                                    variant="contained"
                                    className={classes.createPost}
                                    type="submit"
                                >
                                    Create Post
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Paper>
        )
    }

    const renderPost = () => {
        return (
            <div className={classes.root}>
                <Grid container spacing={2} justify="center" >
                    {renderPostCard()}
                </Grid>
            </div>
        );
    }

    return (renderPost());
}

export default post;