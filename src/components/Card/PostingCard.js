import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ThumbUpOutlined from '@material-ui/icons/ThumbUpOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/ChatBubbleOutline';
import IconButton from "@material-ui/core/IconButton";
import { InputAdornment } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { API_URL } from "../../api-url";
import { Context } from "../../Context";
import PostingCommentTree from "./PostingCommentTree";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    paddingLeft: "40px",
    paddingRight: "40px"
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  name: {
    fontSize: "14px",
    marginLeft: "10px",
    marginTop: "5px",
    fontWeight: "bold"
  },
  date: {
    marginTop: "5px",
    fontSize: "12px",
    marginLeft: "10px",
    color: theme.palette.text.secondary,
  },
  title: {
    marginTop: "10px",
    fontSize: "18px",
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
    width: "100%",
  },
  description: {
    // color: theme.palette.text.secondary,
    fontSize: "14px",
    marginTop: "10px",
  },
  iconContainer: {
    padding: "0px",
  },
  commentContainer: {
    padding: "0px",
    marginLeft: "20px"
  },
  icon: {
    fill: "black",
    width: theme.spacing(2.5),
    height: theme.spacing(2.5)
  },
  smallContainer: {
    marginTop: "10px",
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
    marginLeft: "10px"
  },
  font: {
    fontSize: "13px",
  }
}));

const postingCard = (props) => {
  const classes = useStyles();

  const [likeStatus, setLikeStatus] = useState(props.isLiked);
  const [numLikes, setNumLikes] = useState(props.numLikes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentState, setCommentState] = useState(props.comments);


  const handleClose = () => {
    setDialogOpen(false);
  };

  const [userContext, setUserContext] = useContext(Context);
  const displayFile = () => {
    if (props.fileType.includes("video")) {
      return (
        <CardMedia
          className={classes.videoPlayer}
          component="video"
          alt="Title"
          image={props.fileUrl}
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
          image={props.fileUrl}
        />
      )
    }
  }

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

  const handleComment = (newComment) => {
    if (userContext.personId) {
      //send comment
      submitComment(newComment);
    } else {
      setDialogOpen(true);
    }
  }

  const submitComment = (newComment) => {
    // console.log(props, newComment);
    setCommentOpen(false);

    const comment = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          'ultimateParentOwnerId': props.ownerId,
          'ultimateParentPostId': props.postId,
          'parentPostId': newComment.parentPostId,
          'ownerId': userContext.personId,
          'ownerType': 'person',
          'ownerName': `${userContext?.firstName} ${userContext?.lastName}`,
          'ownerProfilePic': userContext.pictureUrl,
          'visibility': {
            'level': 'public'
          },
          'description': newComment.description
        }
      )
    }
    fetch(API_URL.post + '?postType=comment', comment)
      .then(resp => resp.json())
      .then((resp) => {
        // console.log('[PostingCard.js]', resp);
        addComment(resp);
      });
  }

  const addComment = (comment) => {
    const copy = [...commentState, comment];
    console.log('newCommentState', copy);
    setCommentState(copy);
  }

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

  const handleOpenComment = () => {
    setCommentOpen(!commentOpen)
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
          'postId': props.postId
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
          'postId': props.postId
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
      <div className={classes.smallContainer} >
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
        {displayDialog()}
      </div>
    );
  }

  const displayComments = () => {
    // console.log(props.postId);
    return (
      <div key={props.postId}>
        <div key={commentState}>
          <PostingCommentTree
            comments={commentState}
            ultimateParentPostId={props.postId}
            postingCardHandleComment={handleComment}
            rootCommentOpen={commentOpen}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container className={classes.container} spacing={2}>
        <Grid container>
          <Grid item >
            <Avatar src={props.pictureUrl} className={classes.small} />
          </Grid>
          <Grid item>
            <div className={classes.name}>{props.name}</div>
            <div className={classes.date}>{props.date}</div>
          </Grid>
          {/* add role and follow button */}

        </Grid>
        <Grid container>
          <Grid item>
            <div className={classes.title}>{props.title}</div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={12} item>
            <Card className={classes.videoWrapper}>
              {displayFile()}
            </Card>
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={12} item>
            {displayInteractionBar()}
            <div className={classes.description}>{props.description}</div>
            {displayComments()}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default postingCard;