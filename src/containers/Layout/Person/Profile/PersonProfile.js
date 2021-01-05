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


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

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
  return location.substring(9, location.length);
};

const personPage = () => {

  const history = useHistory();

  const [personState, setPersonState] = useState(undefined);
  const [linkedPersonsState, setLinkedPersonsState] = useState(undefined);
  const [value, setValue] = React.useState(0); //used by app bars

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const initialize = () => {
    console.log('initializing');
    fetch("http://localhost:8080/person/" + getPersonId())
      .then(resp => resp.json())
      .then((personData) => {
        setPersonState(personData);
        const linkedPersonIds = personData.links.persons
          .map(p => p.personId)
          .filter(x => x !== undefined);
        const linkedPersonIdsUniq = [...new Set(linkedPersonIds)];

        console.log('linkedPersonIds', linkedPersonIds);
        const linkedPersonsFetches = linkedPersonIdsUniq.map(id => fetch("http://localhost:8080/person/" + id)
          .then(x => x.json()));

        forkJoin(linkedPersonsFetches)
          .subscribe((linkedPersonData) => {
            setLinkedPersonsState(linkedPersonData.filter(x => x !== null));
          });
      });
  }

  useEffect(() => {
    console.log('useEffect');
    initialize();
    // Register a listener to trap url changes
    return history.listen((location) => {
      if (location.pathname.includes('profile')) {
        initialize();
      }
    })
  }
    , []);

  const classes = useStyles();

  const renderProfileCard = () => {
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
          </Grid>
        </Grid>
      </Paper>
    );
  }

  const navigateToLinkedPerson = (personId) => {
    history.push('/profile/' + personId);
    initialize();

  }

  const filterLinkedPersons = (role) => {
    const linkIds = personState.links.persons
      .filter(p => p.role === role)
      .map(x => x.personId);
    return linkedPersonsState.filter(lp => linkIds.includes(lp.personId));
  }
  const renderPersonList = (role) => {
    console.log(linkedPersonsState);
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
      //           {/* <TabPanel value={value} index={0}>
      //             Item One
      // </TabPanel>
      //           <TabPanel value={value} index={1}>
      //             Item Two
      // </TabPanel>
      //           <TabPanel value={value} index={2}>
      //             Item Three
      // </TabPanel>
      //           <TabPanel value={value} index={3}>
      //             Item Four
      // </TabPanel>
      //           <TabPanel value={value} index={4}>
      //             Item Five
      // </TabPanel>
      //           <TabPanel value={value} index={5}>
      //             Item Six
      // </TabPanel>
      //           <TabPanel value={value} index={6}>
      //             Item Seven
      // </TabPanel> */}
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
                {renderPersonsBar("coach")}
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
