import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
// import Chip from "@material-ui/core/Chip";
import CheckIcon from "@material-ui/icons/Check";
import PersonIcon from "@material-ui/icons/Person";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { forkJoin } from "rxjs";
import { API_URL } from "../../../../api-url";
import { APP_PAPER_ELEVATION } from "../../../../app-config";
import PostingCard from "../../../../components/Card/PostingCard";
import { Context } from "../../../../Context";
import reducePostings from "../../../../postingReducer";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Storage } from "aws-amplify";

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  paper: {
    marginTop: "30px",
    width: "100%",
    maxWidth: 700,
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
    },
  },
  bar: {
    border: "none",
    boxShadow: "none",
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
    marginTop: "15px",
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
    marginBottom: "20px",
  },
  usattLabel: {
    color: theme.palette.text.secondary,
    textAlign: "center",
    "font-size": "13px",
    marginTop: "10px",
  },
  followingButton: {
    marginTop: "10px",
  },
  label: {
    flexDirection: "column",
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: "auto",
  },
  name: {
    marginTop: "10px",
    marginBottom: "10px",
    fontSize: "18px",
    textAlign: "center",
  },
}));

const getPersonId = () => {
  const segments = window.location.pathname.split("/").filter(Boolean);
  return segments[segments.length - 1]; // returns just the <personId>
};

const personPage = () => {
  const history = useHistory();
  const [userContext, setUserContext] = useContext(Context);
  const [personState, setPersonState] = useState(undefined);
  const [linkedPersonsState, setLinkedPersonsState] = useState(undefined);
  const [linkedClubsState, setLinkedClubsState] = useState(undefined);
  const [postingState, setPostingState] = useState();
  const [value, setValue] = useState(0); //used by app bars
  const [followingStatus, setFollowingStatus] = useState();
  const [loadingPosts, setLoadingPosts] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFollow = () => {
    if (userContext.personId) {
      if (followingStatus) {
        unSubmitFollow();
      } else {
        submitFollow();
      }
    }
  };

  const submitFollow = () => {
    const follow = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: userContext.personId,
        followedId: personState.personId,
      }),
    };
    fetch(API_URL.follow, follow)
      .then((resp) => resp.json())
      .then((resp) => {
        // console.log(resp);
        setFollowingStatus(true);
      });
  };

  const unSubmitFollow = () => {
    const unFollow = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: userContext.personId,
        followedId: personState.personId,
      }),
    };
    fetch(API_URL.follow, unFollow)
      .then((resp) => resp.json())
      .then((resp) => {
        // console.log(resp);
        setFollowingStatus(false);
      });
  };

  const initialize = async (isMountedRef) => {
    // Main profile fetch
    const personResp = await fetch(
      API_URL.person +
        getPersonId() +
        "/?page=pp" +
        "&upid=" +
        (userContext?.personId || "")
    );
  
    let personData;
    if (personResp.ok) {
      personData = await personResp.json();
    } else {
      const text = await personResp.text();
      console.warn(
        "Failed to fetch person:",
        personResp.status,
        text.slice(0, 200)
      );
      return;
    }
  
    if (!isMountedRef.current) return;
    setPersonState(personData);
    setFollowingStatus(personData.isFollowed);
  
    // Postings
    setLoadingPosts(true);
    const postResp = await fetch(
      API_URL.post +
        "find/person/?ppid=" +
        getPersonId() +
        "&upid=" +
        (userContext?.personId || "")
    );
  
    if (postResp.ok) {
      const postings = await postResp.json();
  
      const resolvedPosts = await Promise.all(
        postings.map(async (post) => {
          if (post.fileUrl && !post.fileUrl.startsWith("http")) {
            try {
              if (userContext?.personId) {
                // Logged in → signed URL
                const signedUrl = await Storage.get(post.fileUrl, {
                  level: "public",
                });
                return { ...post, fileUrl: signedUrl };
              } else {
                // Guest → construct direct public URL
                const bucket = "outponged-post"; // TODO: replace with your bucket
                const region = "us-east-1"; // adjust if needed
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
  
      if (isMountedRef.current) {
        setPostingState(reducePostings(resolvedPosts));
        setLoadingPosts(false);
      }
    } else {
      const text = await postResp.text();
      console.warn(
        "Failed to fetch postings:",
        postResp.status,
        text.slice(0, 200)
      );
      setLoadingPosts(false);
    }
  };
  

  useEffect(() => {
    const isMountedRef = { current: true };

    initialize(isMountedRef);

    const unlisten = history.listen((location) => {
      if (
        isMountedRef.current &&
        location.pathname.includes("person-profile")
      ) {
        initialize(isMountedRef);
      }
    });

    return () => {
      isMountedRef.current = false;
      unlisten(); // cleanup history listener
    };
  }, []);

  const classes = useStyles();

  const renderProfileCard = () => {
    // console.log('[renderProfileCard] personState', personState);
    return (
      <Paper className={classes.paper} elevation={APP_PAPER_ELEVATION}>
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={4}>
            <Avatar
              src={
                personState.pictureUrl?.startsWith("http")
                  ? personState.pictureUrl
                  : undefined
              }
              className={classes.large}
            >
              {(!personState.pictureUrl ||
                !personState.pictureUrl.startsWith("http")) && <PersonIcon />}
            </Avatar>

            <div className={classes.name}>
              {personState.firstName && personState.lastName
                ? `${personState.firstName} ${personState.lastName}`
                : "Guest User"}
            </div>

            {userContext.personId != personState.personId && (
              <Grid container justifyContent="center">
                {/* <div className={classes.usattLabel}>USATT #{personState.usattNumber}</div> */}
                <Button
                  className={classes.followingButton}
                  variant="contained"
                  color={followingStatus ? "inherit" : "primary"}
                  size="small"
                  onClick={handleFollow}
                  startIcon={<PersonIcon />}
                >
                  {followingStatus ? <CheckIcon /> : "Follow"}
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid container sm={8} xs={12} item>
            <Grid xs={4} item>
              <div className={classes.stats}>{personState.rating || "-"}</div>
              <div className={classes.subtext}>Rating</div>
            </Grid>
            <Grid xs={4} item>
              <div className={classes.stats}>{personState.numFollowers}</div>
              <div className={classes.subtext}>Followers</div>
            </Grid>
            <Grid xs={4} item>
              <div className={classes.stats}>{personState.numFollowing}</div>
              <div className={classes.subtext}>Following</div>
            </Grid>
            <Grid xs={12} sm={10} item>
              <div className={classes.bio}>{personState.bio}</div>
            </Grid>

            {personState.personId === userContext.personId && (
              <Grid xs={11} container item justifyContent="flex-end">
                <Button
                  onClick={() => {
                    navigateToEditPerson(personState.personId);
                  }}
                >
                  Edit Profile
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderClubsAndCoaches = () => {
    const existsClubs = personState && filterLinkedClubs("member")?.length > 0;
    const existsCoaches =
      personState && filterLinkedPersons("coach")?.length > 0;

    if (existsClubs || existsCoaches) {
      return (
        <Paper className={classes.paper} elevation={APP_PAPER_ELEVATION}>
          {existsClubs && renderClubsBar("member")}
          {existsCoaches && renderPersonsBar("coach")}
        </Paper>
      );
    }
  };
  const navigateToLinkedPerson = (personId) => {
    history.push("/person-profile/" + personId);
    initialize();
  };
  const navigateToEditPerson = (personId) => {
    history.push("/edit-person-profile/" + personId);
  };

  const navigateToLinkedClub = (clubId) => {
    history.push("/club-profile/" + clubId);
  };

  const filterLinkedPersons = (r) => {
    const linkIds = personState?.links?.persons
      .filter((p) => p.role === r)
      .map((x) => x.personId);
    // console.log('linked person Ids', linkIds);
    return linkedPersonsState?.filter((lp) => linkIds.includes(lp.personId));
  };

  const filterLinkedClubs = (r) => {
    const linkIds = personState?.links?.clubs
      .filter((c) => c.role === r)
      .map((x) => x.clubId);
    // console.log('linked club Ids', linkIds);
    return linkedClubsState?.filter((lc) => linkIds.includes(lc.clubId));
  };

  const renderPersonList = (role) => {
    return (
      linkedPersonsState?.length > 0 &&
      filterLinkedPersons(role).map((linkedPerson, idx) => {
        const name = `${linkedPersonsState[idx].firstName} ${linkedPersonsState[idx].lastName}`;
        let reducedName = name;
        if (name.length > 6) reducedName = name.substring(0, 6) + "...";
        // console.log(reducedName);
        return (
          <Tab
            key={idx}
            {...a11yProps(idx)}
            component={React.forwardRef((props, ref) => (
              <div
                onClick={() => {
                  setValue(idx);
                  navigateToLinkedPerson(linkedPerson.personId);
                }}
                ref={ref}
                {...props}
              >
                <Button title={name}>
                  <Avatar src={linkedPersonsState[idx].pictureUrl} />
                </Button>
                <div className={classes.subtext}>{reducedName}</div>
              </div>
            ))}
          />
        );
      })
    );
  };

  const renderClubList = (role) => {
    // console.log('linkedClubsState', linkedClubsState);
    return (
      linkedClubsState?.length > 0 &&
      filterLinkedClubs(role).map((linkedClub, idx) => {
        const name = linkedClubsState[idx].name;
        let reducedName = name;
        if (name.length > 6) reducedName = name.substring(0, 6) + "...";
        return (
          <Tab
            key={idx}
            {...a11yProps(idx)}
            component={React.forwardRef((props, ref) => (
              <div
                {...props}
                ref={ref}
                onClick={() => {
                  setValue(idx);
                  navigateToLinkedClub(linkedClub.clubId);
                }}
              >
                <Button title={name}>
                  <Avatar src={linkedClubsState[idx].pictureUrl} />
                </Button>
                <div className={classes.subtext}>{reducedName}</div>
              </div>
            ))}
          />
        );
      })
    );
  };
  const renderPersonsBar = (role) => {
    // console.log('linkedPersonsState', linkedPersonsState);
    return (
      personState &&
      linkedPersonsState && (
        <Grid container>
          <Grid item xs={12} sm={4}>
            <div className={classes.heading}>Coaches</div>
          </Grid>
          <Grid container xs={8} item>
            <AppBar
              position="static"
              color="transparent"
              className={classes.bar}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                TabIndicatorProps={{
                  style: {
                    display: "none",
                  },
                }}
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                {renderPersonList(role)}
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      )
    );
  };

  const renderClubsBar = (role) => {
    return (
      personState &&
      linkedClubsState && (
        <Grid container>
          <Grid item xs={12} sm={4}>
            <div className={classes.heading}>Clubs</div>
          </Grid>

          <Grid container xs={8} item>
            <AppBar
              position="static"
              color="transparent"
              className={classes.bar}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                TabIndicatorProps={{
                  style: {
                    display: "none",
                  },
                }}
                textColor="primary"
              >
                {renderClubList(role)}
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      )
    );
  };

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

    return postingState.map((post, idx) => (
      <Grid key={idx} container justifyContent="center">
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

  const renderProfile = () => {
    return (
      <div className={classes.root}>
        <Grid container justifyContent="center">
          {renderProfileCard()}
          {renderClubsAndCoaches()}
          {renderPostings()}
        </Grid>
      </div>
    );
  };

  if (!personState) return false;
  else return renderProfile();
};

export default personPage;
