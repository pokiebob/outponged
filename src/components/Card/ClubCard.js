import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

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

const clubCard = (props) => {
  const classes = useStyles();
  console.log(props);


  return (
    <div className={classes.root} 
    onClick={props.clicked}
    >
      <Paper className={classes.paper} >
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={props.pic} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
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
            <Grid item>
              <Typography variant="subtitle1">Club</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default clubCard;
