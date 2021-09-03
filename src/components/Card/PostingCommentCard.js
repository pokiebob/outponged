import React, { useState, useContext } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ThumbUpOutlined from '@material-ui/icons/ThumbUpOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/ChatBubbleOutline';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { InputAdornment } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import { TextField } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { API_URL } from "../../api-url";
import { Context } from "../../Context";

const useStyles = makeStyles((theme) => ({
    smallContainer: {
        marginTop: "10px"
    },
    root: {
        flexGrow: 1,
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5)
    },
    extraSmall: {
        width: theme.spacing(3),
        height: theme.spacing(3)
    },
    name: {
        "font-size": "16px",
        // marginTop: "5px"
    },
    date: {
        // marginTop: "5px",
        "font-size": "12px",
        marginLeft: "10px",
        color: theme.palette.text.secondary,
    },
    description: {
        color: theme.palette.text.secondary,
        "font-size": "14px",
        marginTop: "5px"
    },
    iconContainer: {
        padding: "0px",
    },
    commentContainer: {
        padding: "0px",
        marginLeft: "15px"
    },
    icon: {
        fill: "black",
        width: theme.spacing(2),
        height: theme.spacing(2)
    },
    likesContainer: {
        marginTop: "5px",
    },
    likesNum: {
        marginLeft: "5px",
        fontWeight: "bold",
        verticalAlign: "middle",
        fontSize: "14px"
    },
    likesText: {
        color: theme.palette.text.secondary,
        verticalAlign: "middle",
        fontSize: "14px"
    },
    outerCol: {
        marginLeft: "10px"
    },
    textField: {
        padding: "0px"
    },
    font: {
        fontSize: "14px",
    },
    reducedPadding: {
        padding: "0px 0 7px"
    }
}));

const postingCommentCard = (props) => {

    const classes = useStyles();

    const [dialogOpen, setDialogOpen] = useState(false);
    const handleClose = () => {
        setDialogOpen(false);
    };

    const displayDialog = () => {
        return (
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Please Log In"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You must log in to OutPonged in order to continue. Log in or make an account by clicking the button on the top right of your screen.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const [userContext, setUserContext] = useContext(Context);

    const displayComments = () => {
        const comments = props.comments;
        // console.log(props.ultimateParentPostId, comments);

        const immediateChildren = (parentPostId) => {
            return comments?.filter(x => x.parentPostId === parentPostId);
        }

        const sortByDate = (c) => {
            return c?.sort((a, b) => -a.date.localeCompare(b.date))
        }

        //rank top 2 comments
        const top2 = () => {
            return sortByDate(
                immediateChildren(props.ultimateParentPostId)
            )?.slice(0, 2);
        }

        const renderComment = (comment) => {

            const [likeStatus, setLikeStatus] = useState(comment.isLiked);
            const [numLikes, setNumLikes] = useState(comment.numLikes);
            const [commentOpen, setCommentOpen] = useState(false);
            const [commentState, setCommentState] = useState();

            const handleLike = () => {
                if (userContext.personId) {
                    if (likeStatus) {
                        unSubmitLike();
                    } else {
                        submitLike();
                    }
                } else {
                    //dialog
                    setDialogOpen(true);
                }
            }

            const handleComment = () => {
                if (userContext.personId) {
                    //send comment
                    submitComment();
                } else {
                    setDialogOpen(true);
                }
            }

            const submitComment = () => {
                console.log(commentState);
                setCommentOpen(false);
                setCommentState("");

                const newComment = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            'ultimateParentOwnerId': comment.ultimateParentOwnerId,
                            'ultimateParentPostId': comment.ultimateParentPostId,
                            'parentPostId': comment.postId,
                            'ownerId': userContext.personId,
                            'ownerType': 'person',
                            'ownerName': `${userContext?.firstName} ${userContext?.lastName}`,
                            'ownerProfilePic': userContext.pictureUrl,
                            'visibility': {
                                'level': 'public'
                            },
                            'description': commentState
                        }
                    )
                }
                fetch(API_URL.post + '?postType=comment', newComment)
                    .then(resp => resp.json())
                    .then((resp) => {
                        console.log(resp);
                    })
            }

            const displayCommentField = () => {
                return (commentOpen &&
                    <form className={classes.root} autoComplete="off">
                        <Grid container className={classes.smallContainer}>
                            <Grid item>
                                <Avatar src={userContext.pictureUrl} className={classes.extraSmall} />
                            </Grid>
                            <Grid item xs={10} className={classes.outerCol}>
                                <TextField
                                    multiline
                                    fullWidth
                                    placeholder="Write a comment..."
                                    value={commentState}
                                    onInput={e => setCommentState(e.target.value)}
                                    InputProps={{
                                        maxLength: 1000,
                                        classes: {
                                            input: classes.font,
                                        },
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleComment}
                                                >
                                                    <SendIcon color="primary" />
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </form>
                );
            }

            const submitLike = () => {
                const like = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            'personId': userContext.personId,
                            'postId': comment.postId
                        }
                    )
                }
                fetch(API_URL.postingLike, like)
                    .then(resp => resp.json())
                    .then((resp) => {
                        console.log(resp);
                        setLikeStatus(true);
                        setNumLikes(numLikes + 1);
                    })
            }

            const unSubmitLike = () => {
                const unLike = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            'personId': userContext.personId,
                            'postId': comment.postId
                        }
                    )
                }
                fetch(API_URL.postingLike, unLike)
                    .then(resp => resp.json())
                    .then((resp) => {
                        console.log(resp);
                        setLikeStatus(false);
                        setNumLikes(numLikes - 1);
                    })
            }

            const displayInteractionBar = () => {
                var likeIcon;
                if (likeStatus) {
                    likeIcon = <ThumbUpIcon className={classes.icon} />
                } else {
                    likeIcon = <ThumbUpOutlined className={classes.icon} />
                }
                return (
                    <div className={classes.likesContainer} >
                        <IconButton
                            className={classes.iconContainer}
                            onClick={handleLike}>
                            {likeIcon}
                        </IconButton>
                        <span className={classes.likesNum} >{numLikes} </span>
                        <span className={classes.likesText}>Like{numLikes === 1 ? '' : 's'}</span>
                        <IconButton
                            className={classes.commentContainer}
                            title="Comment"
                            onClick={() => { setCommentOpen(!commentOpen) }}>
                            <CommentIcon className={classes.icon} />
                        </IconButton>
                        {displayDialog()}
                    </div>
                );
            }

            const date = new Date(comment.date);
            return (
                <Grid container className={classes.smallContainer} >
                    <Grid container>
                        <Grid item >
                            <Avatar src={comment.ownerProfilePic} className={classes.small} />
                        </Grid>
                        <Grid item xs={10} className={classes.outerCol}>
                            <div>
                                <span className={classes.name}>{comment.ownerName}</span>
                                <span className={classes.date}>{date.toLocaleDateString()}</span>
                            </div>
                            <div className={classes.description}>{comment.description}</div>
                            {displayInteractionBar()}
                            {displayCommentField()}
                        </Grid>
                    </Grid>

                </Grid>
            );
        }

        return (
            top2()?.map((comment, idx) => {
                // console.log(idx, comment)
                return (
                    <div>{renderComment(comment)}</div>
                );
            })
        );
    }
    return (
        <div className={classes.root}>
            {displayComments()}
        </div>
    );
}

export default postingCommentCard;