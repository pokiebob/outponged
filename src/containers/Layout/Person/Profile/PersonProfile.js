import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { forkJoin } from 'rxjs';
import { API_URL } from '../../../../api-url';
import { APP_PAPER_ELEVATION } from "../../../../app-config";
import { Context } from "../../../../Context";
import PostingCard from '../../../../components/Card/PostingCard';


function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  };
}

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

const getPersonId = () => {
  var location = window.location.pathname;
  return location.substring(16, location.length);
};

const personPage = () => {
  const history = useHistory();
  const [userContext, setUserContext] = useContext(Context);
  const [personState, setPersonState] = useState(undefined);
  const [linkedPersonsState, setLinkedPersonsState] = useState(undefined);
  const [linkedClubsState, setLinkedClubsState] = useState(undefined);
  const [postingState, setPostingState] = useState();
  const [value, setValue] = React.useState(0); //used by app bars

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const initialize = () => {
    // console.log('initializing');
    fetch(API_URL.person + getPersonId())
      .then(resp => resp.json())
      .then((personData) => {
        // console.log('personData', personData);
        setPersonState(personData);
        const linkedPersonIds = personData.links.persons
          .map(p => p.personId)
          .filter(x => x !== undefined);
        const linkedPersonIdsUniq = [...new Set(linkedPersonIds)];

        // console.log('linkedPersonIds', linkedPersonIds);
        // console.log('linkedPersonIdsUniq', linkedPersonIdsUniq);
        const linkedPersonsFetches = linkedPersonIdsUniq.map(id => fetch(API_URL.person + id)
          .then(x => x.json()));

        forkJoin(linkedPersonsFetches)
          .subscribe((linkedPersonData) => {
            setLinkedPersonsState(linkedPersonData.filter(x => x !== null));
          });

        const linkedClubIds = personData.links.clubs
          .map(p => p.clubId)
          .filter(x => x !== undefined);
        const linkedClubIdsUniq = [...new Set(linkedClubIds)];

        // console.log('linkedClubIds', linkedClubIds);
        const linkedClubsFetches = linkedClubIdsUniq.map(id => fetch(API_URL.club + id)
          .then(x => x.json()));

        forkJoin(linkedClubsFetches)
          .subscribe((linkedClubData) => {
            setLinkedClubsState(linkedClubData.filter(x => x !== null));
          });
      });

    //pp = person profile
    //ppid = person id of profile page owner
    //upid = person id of logged in user
    fetch(API_URL.post + "find/?page=pp&ppid=" + getPersonId() + "&upid=" + userContext?.personId)
      .then(resp => resp.json())
      .then((postings) => {
        console.log('postings', postings);
        setPostingState(postings.reverse());
      });
  }

  useEffect(() => {
    // console.log('useEffect');
    initialize();
    // Register a listener to trap url changes
    return history.listen((location) => {
      if (location.pathname.includes('person-profile')) {
        initialize();
      }
    })
  }
    , []);

  const classes = useStyles();

  const renderProfileCard = () => {
    // console.log('[renderProfileCard] personState', personState);
    return (
      <Paper className={classes.paper} elevation={APP_PAPER_ELEVATION}>
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={4} >
            <Avatar src={personState.pictureUrl} className={classes.large} />
            <div className={classes.name}> {`${personState.firstName} ${personState.lastName}`} </div>
            <Grid xs={12} item >
              <div className={classes.usattLabel}>USATT #{personState.usattNumber}</div>
            </Grid>
          </Grid>
          <Grid container sm={8} xs={12} item >
            <Grid xs={4} item >
              <div className={classes.stats}>{personState.rating || "-"}</div>
              <div className={classes.subtext}>Rating</div>
            </Grid>
            <Grid xs={4} item >
              <div className={classes.stats}>-</div>
              <div className={classes.subtext}>Followers</div>
            </Grid>
            <Grid xs={4} item >
              <div className={classes.stats}>-</div>
              <div className={classes.subtext}>Following</div>
            </Grid>
            <Grid xs={12} sm={10} item>
              <div className={classes.bio}>
                {personState.bio}
              </div>
            </Grid>

            <Grid xs={11} container justify="flex-end">
              <Button onClick={() => {
                navigateToEditPerson(personState.personId);
              }}>
                Edit Profile
              </Button>

            </Grid>

          </Grid>
        </Grid>
      </Paper>
    );
  }

  const renderClubsAndCoaches = () => {
    const existsClubs = personState && filterLinkedClubs("member")?.length > 0;
    const existsCoaches = personState && filterLinkedPersons("coach")?.length > 0;

    if (existsClubs || existsCoaches) {
      return (
        <Paper className={classes.paper} elevation={APP_PAPER_ELEVATION}>
          {existsClubs && renderClubsBar("member")}
          {existsCoaches && renderPersonsBar("coach")}
        </Paper>
      );
    }
  }
  const navigateToLinkedPerson = (personId) => {
    history.push('/person-profile/' + personId);
    initialize();

  }
  const navigateToEditPerson = (personId) => {
    history.push('/edit-person-profile/' + personId);

  }

  const navigateToLinkedClub = (clubId) => {
    history.push('/club-profile/' + clubId);
  }

  const filterLinkedPersons = (r) => {
    const linkIds = personState?.links.persons
      .filter(p => p.role === r)
      .map(x => x.personId);
    // console.log('linked person Ids', linkIds);
    return linkedPersonsState?.filter(lp => linkIds.includes(lp.personId));
  }

  const filterLinkedClubs = (r) => {
    const linkIds = personState?.links.clubs
      .filter(c => c.role === r)
      .map(x => x.clubId);
    // console.log('linked club Ids', linkIds);
    return linkedClubsState?.filter(lc => linkIds.includes(lc.clubId));
  }

  const renderPersonList = (role) => {
    return (linkedPersonsState?.length > 0 &&
      filterLinkedPersons(role)
        .map((linkedPerson, idx) => {
          const name = `${linkedPersonsState[idx].firstName} ${linkedPersonsState[idx].lastName}`;
          let reducedName = name;
          if (name.length > 6) reducedName = name.substring(0, 6) + "...";
          console.log(reducedName);
          return (
            <Tab
              {...a11yProps(idx)}
              component={() => (
                <div onClick={() => {
                  setValue(idx);
                  navigateToLinkedPerson(linkedPerson.personId);
                }
                }>
                  <Button title={name} >
                    <Avatar src={linkedPersonsState[idx].pictureUrl} />
                  </Button>
                  <div className={classes.subtext}>{reducedName}</div>
                </div>
              )}
            />
          )
        }
        )
    );
  }

  const renderClubList = (role) => {
    // console.log('linkedClubsState', linkedClubsState);
    return (linkedClubsState?.length > 0 &&
      filterLinkedClubs(role)
        .map((linkedClub, idx) => {
          const name = linkedClubsState[idx].name;
          let reducedName = name;
          if (name.length > 6) reducedName = name.substring(0, 6) + "...";
          return (
            <Tab
              {...a11yProps(idx)}
              component={() => (
                <div onClick={() => {
                  setValue(idx);
                  navigateToLinkedClub(linkedClub.clubId);
                }
                }>
                  <Button title={name} >
                    <Avatar src={linkedClubsState[idx].pictureUrl} />
                  </Button>
                  <div className={classes.subtext}>{reducedName}</div>
                </div>
              )}
            />
          )
        }
        )
    );
  }
  const renderPersonsBar = (role) => {
    // console.log('linkedPersonsState', linkedPersonsState);
    return (personState && linkedPersonsState &&
      <Grid container>
        <Grid item xs={12} sm={4} >
          <div className={classes.heading} >Coaches</div>
        </Grid>
        <Grid container xs={8} item >
          <AppBar position="static" color="white" className={classes.bar}>
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
    );
  }

  const renderClubsBar = (role) => {
    return (personState && linkedClubsState &&
      <Grid container>
        <Grid item xs={12} sm={4} >
          <div className={classes.heading} >Clubs</div>
        </Grid>

        <Grid container xs={8} item >
          <AppBar position="static" color="white" className={classes.bar}>
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
    );
  }

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

  const renderProfile = () => {
    return (
      <div className={classes.root}>
        <Grid container justify="center" >
          {renderProfileCard()}
          {renderClubsAndCoaches()}
          {renderPostings()}

        </Grid>


      </div>
    );
  }


  if (!personState) return false
  else return renderProfile();

};

export default personPage;
