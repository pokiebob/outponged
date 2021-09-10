import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../../../api-url";
import { APP_PAPER_ELEVATION } from "../../../../app-config";
import PostingCard from "../../../../components/Card/PostingCard";
import { Context } from "../../../../Context";
import reducePostings from "../../../../postingReducer";
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import Menu from "@material-ui/core/Menu";
import RestoreIcon from '@material-ui/icons/Restore';
import { MenuItem } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";

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
}));

const feed = () => {
  const classes = useStyles();

  const [postingState, setPostingState] = useState();
  const [userContext, setUserContext] = useContext(Context);
  const [filterState, setFilterState] = useState();
  const [filterIconState, setFilterIconState] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const initialize = (filter) => {
    setFilterState(filter);
    if (filter === "recent") {
      setFilterIconState(<RestoreIcon />);
    }
    else if (filter === "likes") {
      setFilterIconState(<ThumbUpAltOutlinedIcon />);
    }
    setAnchorEl(false);
    fetch(API_URL.post + "find/home?upid=" + userContext?.personId + "&filter=" + filter)
      .then(resp => resp.json())
      .then((postings) => {
        console.log(postings);
        setPostingState(reducePostings(postings));
      });
  }

  useEffect(() => {
    // console.log('Context',userContext);
    initialize("recent");
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

  const renderFilters = () => {
    return (
      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MenuItem
          onClick={() => initialize("recent")}>
          Recent
        </MenuItem>
        <MenuItem
          onClick={() => initialize("likes")}
        >
          Likes
        </MenuItem>
      </Menu>
    )
  }

  return (
    <div className={classes.root} key={postingState} >
      <Grid container  >
        <Grid container justify="center">
          <Grid item className={classes.paper}>
            <Chip
              icon={filterIconState}
              onClick={handleClick}
              color="primary"
              variant="outlined"
              label={filterState?.toUpperCase()}
            />
            {renderFilters()}
            <hr />
          </Grid>
        </Grid>
        {renderPostings()}
      </Grid>
    </div>
  );
}

export default feed;