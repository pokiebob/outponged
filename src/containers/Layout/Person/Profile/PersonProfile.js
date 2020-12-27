import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(5),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

const getPlayerId = () => {
  var location = window.location.pathname;
  return location.substring(9, location.length);
};

const playerPage = () => {
  const classes = useStyles();

  const imgSource = `https://randomuser.me/api/portraits/men/${getPlayerId()}.jpg`;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={3}>
            <Avatar src={imgSource} className={classes.large} />
          </Grid>
          <Grid item xs={6} sm={3}>
            col 1
          </Grid>
          <Grid item xs={6} sm={3}>
            col 2
          </Grid>
          <Grid item xs={6} sm={3}>
            col 3
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default playerPage;
