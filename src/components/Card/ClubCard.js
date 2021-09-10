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

const clubCard = (props) => {
  const classes = useStyles();


  return (
    <div className={classes.root} onClick={props.clicked}>
      <Paper className={classes.paper} elevation={APP_PAPER_ELEVATION}>
        <Grid container >
          <Grid item xs={2}>
            <Avatar src={props.pic} className={classes.medium} />
          </Grid>
          <Grid item xs={10} container>
            <Grid item xs={9}  className={classes.col} container direction="column" >
              <Grid item>
                <Typography gutterBottom variant="h6">
                  {props.name}
                </Typography>
                <Typography variant="body2" gutterBottom >
                  <a href={props.siteUrl} target="_blank">{props.siteUrl}</a>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Address: {props.address}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Phone Number: {props.phoneNumber}
                </Typography>
              </Grid>
            </Grid>
            <Grid item className={classes.col} xs={2}>
              <Typography variant="subtitle1">Club</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default clubCard;
