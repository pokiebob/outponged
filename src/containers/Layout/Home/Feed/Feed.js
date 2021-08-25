import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { APP_PAPER_ELEVATION } from "../../../../app-config";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PostingCard from "../../../../components/Card/PostingCard";
import { Context } from "../../../../Context";
import { API_URL } from "../../../../api-url";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  paper: {
    marginTop: "30px",
    width: "100%",
    "min-width": "400px",
    "max-width": "700px"
  },
  bar: {
    border: "none",
    boxShadow: "none"
  },
  container: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  stats: {
    color: theme.palette.text.primary,
    textAlign: "center",
    "font-size": "30px",
  },
  heading: {
    color: theme.palette.text.primary,
    textAlign: "center",
    "font-size": "30px",
    marginTop: "15px"
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
  bio: {
    color: theme.palette.text.secondary,
    textAlign: "center",
    "font-size": "15px",
    marginTop: "20px",
    marginBottom: "20px"
  },
  usattLabel: {
    color: theme.palette.text.secondary,
    textAlign: "center",
    "font-size": "13px",
    marginTop: "10px",
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: "auto"
  },
  name: {
    "margin-top": "20px",
    "font-size": "18px",
    textAlign: "center",
  }
}));

const feed = () => {
  const classes = useStyles();

  const [postingState, setPostingState] = useState();
  const [userContext, setUserContext] = useContext(Context);

  const initialize = () => {
    fetch(API_URL.post + "find/?page=pp&ppid=" + userContext?.personId + "&upid=" + userContext?.personId)
      .then(resp => resp.json())
      .then((postings) => {
        // console.log('postings', postings);
        setPostingState(postings.reverse());
      });
  }

  useEffect(() => {
    // console.log('Context',userContext);
    initialize();
  },[userContext]);

  /** API CALL 
   *  send user ID
   *  backend filters posts based on likes and user prefernces
   *  and returns array of posts in response
  */


  const renderPostings = () => {
    return (
      postingState?.map((post, idx) => {
        const date = new Date(post.date);
        return (
          <Paper className={classes.paper} elevation={APP_PAPER_ELEVATION}>
            <Grid container className={classes.container}>
              <PostingCard
                pictureUrl={post.ownerProfilePic}
                name={post.ownerName}
                title={post.title}
                fileUrl={post.fileUrl}
                fileType={post.fileType}
                description={post.description}
                date={date.toLocaleDateString()}
                postId={post.postId}
                isLiked={post.isLiked}
                numLikes={post.numLikes}
              />
            </Grid>
          </Paper>
        );
      }
      )
    );
  }


  return (
    <div className={classes.root}>
      <Grid container justify="center" >
        {renderPostings()}
      </Grid>
    </div>
  );
}

export default feed;