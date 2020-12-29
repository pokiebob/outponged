import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(10),
    width: 650
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
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: "auto"
  },
  name: {
    "margin-top": "20px",
    "font-size": "20px",
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

  const classes = useStyles();

  const imgSource = `https://randomuser.me/api/portraits/men/${getPlayerId()}.jpg`;


  const renderProfile = () => {
    return (
      <div className={classes.root}>
        <Grid container justify="center" >
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={4} sm={3} >
                <Avatar src={imgSource} className={classes.large} />
                <div className={classes.name}> {`${playerState.firstName} ${playerState.lastName}`} </div>
              </Grid>
              <Grid container xs={9} item >
                <Grid xs={4} item >
                  <div className={classes.heading}>1782</div>
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
                <Grid xs={12} item >
                  <div className={classes.subheading}>USATT Number: {playerState.usattNumber}</div>
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
