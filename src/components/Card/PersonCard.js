import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { APP_PAPER_ELEVATION } from "../../app-config";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "padding-top": "1rem",
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 500,
  },
  medium: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: "auto"
  },
  col: {
    marginLeft: "15px"
  }
}));

const personCard = (props) => {
  const classes = useStyles();
  // console.log(props);

  const renderRole = () => {
    // console.log(props.role);
    if (props.role.player) {
      if (props.role.coach) {
        return (
          <div>
            <Typography variant="subtitle1">Player</Typography>
            <Typography variant="subtitle1">Coach</Typography>
          </div>
        );
      } else {
        return (
          <Typography variant="subtitle1">Player</Typography>
        );
      }
    } else {
      return (
        <Typography variant="subtitle1">Coach</Typography>
      );
    }
  }

  return (
    <div className={classes.root} onClick={props.clicked}>
      <Paper className={classes.paper} elevation={APP_PAPER_ELEVATION}>
        <Grid container xs={12}>
          <Grid item xs={2}>
            <Avatar src={props.pic} className={classes.medium} />
          </Grid>
          <Grid item xs={10} container>
            <Grid item xs={9} container className={classes.col} direction="column">
              <Grid item>
                <Typography gutterBottom variant="h6">
                  {props.fullName}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Rating: {props.rating}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  USATT Number: {props.usattNumber}
                </Typography>
              </Grid>
            </Grid>
            <Grid item className={classes.col} xs={2}>
              {renderRole()}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default personCard;
