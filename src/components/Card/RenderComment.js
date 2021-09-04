import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import CommentIcon from '@material-ui/icons/ChatBubbleOutline';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlined from '@material-ui/icons/ThumbUpOutlined';
import React, { useContext, useState } from 'react';
import { API_URL } from "../../api-url";
import { Context } from "../../Context";
import CommentField from './CommentField';

const useStyles = makeStyles((theme) => ({
    smallContainer: {
        marginTop: "20px"
    },
    root: {
        flexGrow: 1,
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5)
    },
    extraSmall: {
        marginLeft: "10px",
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    border: {
        borderLeft: "1px solid lightgray",
    },
    name: {
        "font-size": "13px",
        fontWeight: "bold"
        // marginTop: "5px"
    },
    date: {
        // marginTop: "5px",
        "font-size": "12px",
        marginLeft: "10px",
        color: theme.palette.text.secondary,
    },
    description: {
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
        fontSize: "13px"
    },
    likesText: {
        color: theme.palette.text.secondary,
        verticalAlign: "middle",
        fontSize: "13px"
    },
    outerCol: {
        marginLeft: "20px"
    },
    textField: {
        padding: "0px"
    },
    font: {
        fontSize: "13px",
    },
    reducedPadding: {
        padding: "0px 0 7px"
    },
    rootCommentField: {
        marginLeft: "60px"
    }
}));


const renderComment = ({ comment, level, treeHandleComment, rootCommentOpen }) => {

    // console.log(comment);
    const classes = useStyles();
    const [likeStatus, setLikeStatus] = useState(comment.isLiked);
    const [numLikes, setNumLikes] = useState(comment.numLikes);
    const [commentOpen, setCommentOpen] = useState(comment.isRoot && rootCommentOpen ? true : false);
    const [userContext, setUserContext] = useContext(Context);

    const handleLike = () => {
        if (userContext.personId) {
            if (likeStatus) {
                unSubmitLike();
            } else {
                submitLike();
            }
        } else {
            //dialog
            // setDialogOpen(true);
        }
    }

    const handleComment = (newComment) => {
        // console.log('[RenderComment.js]', newComment);
        setCommentOpen(false);
        treeHandleComment(newComment);
    }


    const displayCommentField = () => {
        return (commentOpen &&
            <CommentField
                handleComment={handleComment}
                level={level}
                parentOwnerName={comment.ownerName}
                closeComment={handleOpenComment} />
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

    const handleOpenComment = () => {
        setCommentOpen(!commentOpen);
        console.log("root comment open set to true");
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
                    onClick={handleOpenComment}>
                    <CommentIcon className={classes.icon} />
                </IconButton>
                {/* {displayDialog()} */}
            </div>
        );
    }

    const date = new Date(comment.date);
    return (
        level === 0 ?
            <Grid container >
                <Grid item xs={10} className={classes.rootCommentField}>
                    {displayCommentField()}
                </Grid>
            </Grid>
            :
            <Grid container className=
                //not first comment
                {level === 2 && !comment.isFirstChild ? classes.border : {}}
            >
                <Grid container className={classes.smallContainer}>
                    <Grid container className={
                        //first comment
                        level === 2 && comment.isFirstChild ? classes.border : {}
                    }>
                        <Grid item >
                            <Avatar src={comment.ownerProfilePic} className={level < 2 ? classes.small : classes.extraSmall} />
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
            </Grid>
    );
}

export default renderComment;