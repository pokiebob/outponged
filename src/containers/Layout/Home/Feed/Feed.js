import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { APP_PAPER_ELEVATION } from "../../../../app-config";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper"

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

const feed = () => {
    const classes = useStyles();

    /** API CALL 
     *  send user ID
     *  backend filters posts based on likes and user prefernces
     *  and returns array of posts in response
    */
    

    const renderPostings = () => {
        <Paper className={classes.paper} elevation={APP_PAPER_ELEVATION}>
            <Grid container className={classes.container} >
               uh 
            </Grid>
        </Paper>
    }


    return(
        <div className={classes.root}>
            <Grid container justify="center" >
                {renderPostings()}
            </Grid>
        </div>
    );
}

export default feed;