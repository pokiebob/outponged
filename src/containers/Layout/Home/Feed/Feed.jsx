import { MenuItem } from "@mui/material";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "../../../../makeStyles";
import RestoreIcon from "@mui/icons-material/Restore";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../../../api-url";
import { APP_PAPER_ELEVATION } from "../../../../app-config";
import PostingCard from "../../../../components/Card/PostingCard";
import { Context } from "../../../../Context";
import reducePostings from "../../../../postingReducer";
import { getUrl } from "aws-amplify/storage";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    overflowX: "hidden",
  },
  paper: {
    marginTop: "30px",
    width: "100%",
    maxWidth: 700,
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%", // allow full shrink
    },
  },
  filter: {
    marginLeft: "16px",
  },
}));

const feed = () => {
  const classes = useStyles();
  const [postingState, setPostingState] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false); // ✅ loading state
  const [userContext] = useContext(Context);
  const [filterState, setFilterState] = useState("recent");
  const [filterIconState, setFilterIconState] = useState(<RestoreIcon />);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const initialize = async (filter) => {
    setFilterState(filter);
    setFilterIconState(
      filter === "likes" ? <ThumbUpAltOutlinedIcon /> : <RestoreIcon />
    );
    setAnchorEl(false);
    setLoadingPosts(true);
  
    try {
      const resp = await fetch(
        `${API_URL.post}find/home?upid=${userContext?.personId || ""}&filter=${filter}`
      );
      const postings = await resp.json();
  
      const resolvedPosts = await Promise.all(
        postings.map(async (post) => {
          if (post.fileUrl && !post.fileUrl.startsWith("http")) {
            try {
              if (userContext?.personId) {
                const { url } = await getUrl({
                  path: `public/${post.fileUrl}`,
                });
                return { ...post, fileUrl: url.toString() };
              } else {
                // Guest → construct direct public S3 URL
                const bucket = "outponged-post";
                const region = "us-east-1";
                const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/public/${post.fileUrl}`;
                return { ...post, fileUrl: publicUrl };
              }
            } catch (err) {
              console.error("Error fetching file from S3:", err);
              return post;
            }
          }
          return post;
        })
      );
  
      setPostingState(reducePostings(resolvedPosts));
    } catch (err) {
      console.error("Error loading feed:", err);
    } finally {
      setLoadingPosts(false);
    }
  };
  

  useEffect(() => {
    initialize("recent");
  }, [userContext]);

  const renderPostings = () => {
    if (loadingPosts) {
      return (
        <Grid container justifyContent="center">
          <Card className={classes.paper} elevation={APP_PAPER_ELEVATION}>
            <div style={{ padding: "20px", textAlign: "center" }}>
              <CircularProgress />
              <div>Loading posts...</div>
            </div>
          </Card>
        </Grid>
      );
    }

    if (!postingState || postingState.length === 0) {
      return (
        <Grid container justifyContent="center">
          <Card className={classes.paper} elevation={APP_PAPER_ELEVATION}>
            <div style={{ padding: "20px", textAlign: "center" }}>
              No posts yet.
            </div>
          </Card>
        </Grid>
      );
    }

    return postingState.map((post) => (
      <Grid container key={post.postId} justifyContent="center">
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
    ));
  };

  const renderFilters = () => (
    <Menu
      id="customized-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <MenuItem onClick={() => initialize("recent")}>Recent</MenuItem>
      <MenuItem onClick={() => initialize("likes")}>Likes</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid container justifyContent="center">
          <Grid item className={classes.paper}>
            <Chip
              className={classes.filter}
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
};

export default feed;
