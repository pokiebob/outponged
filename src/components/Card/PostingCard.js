import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import BallOutline from '@material-ui/icons/FiberManualRecordOutlined';
import BallFilled from '@material-ui/icons/FiberManualRecord';
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    marginLeft: "40px"
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  name: {
    "font-size": "16px",
    marginLeft: "10px",
    marginTop: "5px"
  },
  date: {
    marginTop: "5px",
    "font-size": "12px",
    marginLeft: "10px",
    color: theme.palette.text.secondary,
  },
  title: {
    marginTop: "10px",
    "font-size": "20px",
    "font-weight": "bold"
  },
  videoWrapper: {
    position: "relative",
    paddingTop: "56.25%",
    marginTop: "10px",
  },
  videoPlayer: {
    position: "absolute",
    top: "0",
    height: "100%",
    width: "100%",
  },
  description: {
    color: theme.palette.text.secondary,
    "font-size": "15px",
    marginTop: "10px"
  },
  ballContainer: {
    padding: "0px",
  },
  ball: {
    fill: "black"
  },
  likesContainer: {
    marginTop: "10px",
  },
  likesNum: {
    fontWeight: "bold",
    verticalAlign: "middle"
  },
  likesText: {
    color: theme.palette.text.secondary,
    verticalAlign: "middle"
  }
}));

const postingCard = (props) => {
  const classes = useStyles();

  const [likeStatus, setLikeStatus] = React.useState(false);

  const displayFile = () => {
    if (props.fileType.includes("video")) {
      return (
        // <ReactPlayer
        //     url={URL.createObjectURL(file)}
        //     className={classes.videoPlayer}
        //     controls="true"
        // />
        <CardMedia
          className={classes.videoPlayer}
          component="video"
          alt="Title"
          image={props.fileUrl}
          controls="true"
        />
      );
    }
    else {
      return (
        <CardMedia
          className={classes.videoPlayer}
          media="picture"
          alt="Title"
          image={props.fileUrl}
        />
      )
    }
  }

  const displayBall = () => {
    var ball;
    if (likeStatus) {
      ball = <BallFilled className={classes.ball}/>
    } else {
      ball = <BallOutline className={classes.ball}/>
    }
    return (
      <div className={classes.likesContainer} >
        <IconButton className={classes.ballContainer}>
          {ball}
        </IconButton>
        <span className={classes.likesNum} >13 </span>
        <span className={classes.likesText}>Likes</span>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container className={classes.container} spacing={2}>
        <Grid container>
          <Grid item >
            <Avatar src={props.pictureUrl} className={classes.small} />
          </Grid>
          <Grid item>
            <div className={classes.name}>{props.name}</div>
            <div className={classes.date}>{props.date}</div>
          </Grid>
          {/* add role and follow button */}

        </Grid>
        <Grid container>
          <Grid item>
            <div className={classes.title}>{props.title}</div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={10} item>
            <Card className={classes.videoWrapper}>
              {displayFile()}
            </Card>
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={10} item>
            {displayBall()}
            <div className={classes.description}>{props.description}</div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default postingCard;