import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../../../api-url";
import { APP_PAPER_ELEVATION } from "../../../../app-config";
import PostingCard from "../../../../components/Card/PostingCard";
import reducePostings from "../../../../postingReducer";
import { Context } from "../../../../Context";

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
    fetch(API_URL.post + "find/home?upid=" + userContext?.personId)
      .then(resp => resp.json())
      .then((postings) => {
        setPostingState(reducePostings(postings));
      });
  }

  useEffect(() => {
    // console.log('Context',userContext);
    initialize();
  }, [userContext]);

  /** API CALL 
   *  send user ID
   *  backend filters posts based on likes and user prefernces
   *  and returns array of posts in response
  */

  const renderPostings = () => {
    return (
      postingState?.map((post) => {
        return (
          <Grid container justify="center">
            <Card className={classes.paper} elevation={APP_PAPER_ELEVATION}>
              <PostingCard
                ownerId={post.ownerId}
                pictureUrl={post.ownerProfilePic}
                name={post.ownerName}
                title={post.title}
                fileUrl={post.fileUrl}
                fileType={post.fileType}
                description={post.description}
                date={post.date}
                postId={post.postId}
                isLiked={post.isLiked}
                numLikes={post.numLikes}
                comments={post.comments}
              />
            </Card>
          </Grid>
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