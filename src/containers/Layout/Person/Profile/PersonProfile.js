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

import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import HelpIcon from "@material-ui/icons/Help";
import ShoppingBasket from "@material-ui/icons/ShoppingBasket";
import ThumbDown from "@material-ui/icons/ThumbDown";
import ThumbUp from "@material-ui/icons/ThumbUp";



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

const getPlayerId = () => {
  var location = window.location.pathname;
  return location.substring(9, location.length);
};

const playerPage = () => {

  const [playerState, setPlayerState] = useState(undefined);

  useEffect(() => {
    fetch("http://localhost:8080/person/" + getPlayerId())
      .then(resp => resp.json())
      .then((x) => {
        console.log('within then x:', x);
        setPlayerState(x);
      })
  }, [])

  console.log(playerState);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();

  const renderProfile = () => {
    return (
      <div className={classes.root}>
        <Grid container justify="center" >
          <Paper className={classes.paper}>
            <Grid container className={classes.container}>
              <Grid item xs={12} sm={4} >
                <Avatar src={playerState.pictureUrl} className={classes.large} />
                <div className={classes.name}> {`${playerState.firstName} ${playerState.lastName}`} </div>
                <Grid xs={12} item >
                  <div className={classes.usattLabel}>USATT #{playerState.usattNumber}</div>
                </Grid>
              </Grid>
              <Grid container xs={8} item >
                <Grid xs={4} item >
                  <div className={classes.heading}>{playerState.rating}</div>
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

          <Paper className={classes.paper}>
            <Grid container className={classes.container}>
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
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab
   label="Item One"
   {...a11yProps(0)}
   value={value}
   component={() => (
      <Button onClick={() => setValue(0)}> 
         <Avatar src="<an image>" />
      </Button>
   )}
/>
          <Tab label="Item Two" icon={<FavoriteIcon />} {...a11yProps(1)} />
          <Tab label="Item Three" icon={<PersonPinIcon />} {...a11yProps(2)} />
          <Tab label="Item Four" icon={<HelpIcon />} {...a11yProps(3)} />
          <Tab label="Item Five" icon={<ShoppingBasket />} {...a11yProps(4)} />
          <Tab label="Item Six" icon={<ThumbDown />} {...a11yProps(5)} />
          <Tab label="Item Seven" icon={<ThumbUp />} {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
                {/* <Grid xs={3} item >
                  <div className={classes.heading}>Image</div>
                  <div className={classes.subtext}>Club 1</div>
                </Grid>
                <Grid xs={3} item >
                  <div className={classes.heading}>Image</div>
                  <div className={classes.subtext}>Club 2</div>
                </Grid>
                <Grid xs={3} item >
                  <div className={classes.heading}>Image</div>
                  <div className={classes.subtext}>Club 3</div>
                </Grid>
                <Grid xs={3} item >
                  <div className={classes.heading}>Image</div>
                  <div className={classes.subtext}>Club 4</div>
                </Grid> */}
              </Grid>
            </Grid>

            <Grid container className={classes.container}>
              <Grid item xs={12} sm={4} >
                <div className={classes.heading} >Coaches</div>
              </Grid>
              <Grid container xs={8} item >
                <Grid xs={3} item >
                  <div className={classes.heading}>Image</div>
                  <div className={classes.subtext}>Coach 1</div>
                </Grid>
                <Grid xs={3} item >
                  <div className={classes.heading}>Image</div>
                  <div className={classes.subtext}>Coach 2</div>
                </Grid>
                <Grid xs={3} item >
                  <div className={classes.heading}>Image</div>
                  <div className={classes.subtext}>Coach 3</div>
                </Grid>
                <Grid xs={3} item >
                  <div className={classes.heading}>Image</div>
                  <div className={classes.subtext}>Coach 4</div>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </div>
    );
  }


  if (!playerState) return false
  else return renderProfile();

};

export default playerPage;
