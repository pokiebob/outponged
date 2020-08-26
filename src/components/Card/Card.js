import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

import "./Card.css";

const card2 = (props) => (
  <article className="Card" onClick={props.clicked}>
    <h1>{props.title}</h1>
    <div className="Info">
      <img src={props.pic} />
      <div className="Author">{props.author}</div>
    </div>
  </article>
);

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
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

const card = (props) => {
  const classes = useStyles();
  console.log(props);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={props.pic} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  {props.fullName}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Rating: {props.rating}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  USATT Number: {props.usattNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Home Club: {props.homeClub}
                </Typography>
              </Grid>
              <Grid item onClick={props.clicked}>
                <Typography variant="body2" style={{ cursor: "pointer" }}>
                  View Page
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">Player</Typography>
              <Typography variant="subtitle1">Coach</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default card;
