import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { forkJoin } from 'rxjs';
import { API_URL } from '../../../../api-url';


function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    marginBottom: "20px",
  },
  heading: {
    color: theme.palette.text.primary,
    textAlign: "center",
    "font-size": "30px",
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
  usattLabel: {
    color: theme.palette.text.secondary,
    textAlign: "center",
    "font-size": "13px",
    marginTop: "30px",
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

  const [personState, setPersonState] = useState(undefined);
  const [linkedPersonsState, setLinkedPersonsState] = useState(undefined);
  const [linkedClubsState, setLinkedClubsState] = useState(undefined);
  const [value, setValue] = React.useState(0); //used by app bars

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const initialize = () => {
    console.log('initializing');
    fetch(API_URL.person + getPersonId())
      .then(resp => resp.json())
      .then((personData) => {
        console.log('personData', personData);
        setPersonState(personData);
        const linkedPersonIds = personData.links.persons
          .map(p => p.personId)
          .filter(x => x !== undefined);
        const linkedPersonIdsUniq = [...new Set(linkedPersonIds)];

        console.log('linkedPersonIds', linkedPersonIds);
        console.log('linkedPersonIdsUniq', linkedPersonIdsUniq);
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

        console.log('linkedClubIds', linkedClubIds);
        const linkedClubsFetches = linkedClubIdsUniq.map(id => fetch(API_URL.club + id)
          .then(x => x.json()));

        forkJoin(linkedClubsFetches)
          .subscribe((linkedClubData) => {
            setLinkedClubsState(linkedClubData.filter(x => x !== null));
          });
      });
  }

  useEffect(() => {
    console.log('useEffect');
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
    console.log('[renderProfileCard] personState', personState);
    return (
      <Paper className={classes.paper}>
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={4} >
            <Avatar src={personState.pictureUrl} className={classes.large} />
            <div className={classes.name}> {`${personState.firstName} ${personState.lastName}`} </div>
            <Grid xs={12} item >
              <div className={classes.usattLabel}>USATT #{personState.usattNumber}</div>
            </Grid>
          </Grid>
          <Grid container xs={8} item >
            <Grid xs={4} item >
              <div className={classes.heading}>{personState.rating}</div>
              <div className={classes.subtext}>Rating</div>
            </Grid>
            <Grid xs={4} item >
              <div className={classes.heading}>234</div>
              <div className={classes.subtext}>Followers</div>
            </Grid>
            <Grid xs={4} item >
              <div className={classes.heading}>400</div>
              <div className={classes.subtext}>Following</div>
            </Grid>
            <Grid xs={12} item>
              <div className={classes.subtext}>
                {personState.bio}
              </div>

              <Grid xs={4} item>
                <Button onClick={() => {
                  navigateToEditPerson(personState.personId);
                }}>
                  Edit Profile
              </Button>

              </Grid>

            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
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

  const filterLinkedPersons = (role) => {
    const linkIds = personState.links.persons
      .filter(p => p.role === role)
      .map(x => x.personId);
    return linkedPersonsState.filter(lp => linkIds.includes(lp.personId));
  }

  const filterLinkedClubs = (role) => {
    const linkIds = personState.links.clubs
      .filter(c => c.role === role)
      .map(x => x.clubId);
    return linkedClubsState.filter(lc => linkIds.includes(lc.clubId));
  }

  const renderPersonList = (role) => {
    console.log('linkedPersonsState', linkedPersonsState);
    return (linkedPersonsState?.length > 0 &&
      filterLinkedPersons(role)
        .map((linkedPerson, idx) => {
          const fullName = `${linkedPersonsState[idx].firstName} ${linkedPersonsState[idx].lastName}`
          return (
            <Tab
              {...a11yProps(idx)}
              component={() => (
                <div onClick={() => {
                  setValue(idx);
                  navigateToLinkedPerson(linkedPerson.personId);
                }
                }>
                  <Button title={fullName} >
                    <Avatar src={linkedPersonsState[idx].pictureUrl} />
                  </Button>
                  <div className={classes.subtext}>{fullName}</div>
                </div>
              )}
            />
          )
        }
        )
    );
  }

  const renderClubList = (role) => {
    console.log('linkedClubsState', linkedClubsState);
    return (linkedClubsState?.length > 0 &&
      filterLinkedClubs(role)
        .map((linkedClub, idx) => {
          const name = linkedClubsState[idx].name;
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
                  <div className={classes.subtext}>{name}</div>
                </div>
              )}
            />
          )
        }
        )
    );
  }
  const renderPersonsBar = (role) => {
    return (personState && linkedPersonsState &&
      <AppBar position="static" color="white" className={classes.bar}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          {renderPersonList(role)}
        </Tabs>
      </AppBar>
    );
  }

  const renderClubsBar = (role) => {
    return (personState && linkedClubsState &&
      <AppBar position="static" color="white" className={classes.bar}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          {renderClubList(role)}
        </Tabs>
      </AppBar>
    );
  }

  const renderProfile = () => {
    return (
      <div className={classes.root}>
        <Grid container justify="center" >
          {renderProfileCard()}

          <Paper className={classes.paper}>
            <Grid container className={classes.container}>
              <Grid item xs={12} sm={4} >
                <div className={classes.heading} >Clubs</div>
              </Grid>

              <Grid container xs={8} item >
                {renderClubsBar("member")}
              </Grid>
            </Grid>

            <Grid container className={classes.container}>
              <Grid item xs={12} sm={4} >
                <div className={classes.heading} >Coaches</div>
              </Grid>
              <Grid container xs={8} item >
                {renderPersonsBar("coach")}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </div>
    );
  }


  if (!personState) return false
  else return renderProfile();

};

export default personPage;
