import React, { useState, useContext } from "react";
import { makeStyles } from "../../makeStyles";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { TextField } from "@mui/material";
import { Context } from "../../Context";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  smallContainer: {
    marginTop: "20px",
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  extraSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  border: {
    // borderLeft: "1px solid lightgray",
    marginLeft: "10px",
  },
  outerCol: {
    marginLeft: "20px",
  },
  textField: {
    padding: "0px",
  },
  font: {
    fontSize: "14px",
  },
  reducedPadding: {
    padding: "0px 0 7px",
  },
  fieldActions: {
    float: "right",
  },
  avatarContainer: {
    minWidth: "60px",
  },
}));

const commentField = ({
  handleComment,
  level,
  parentOwnerName,
  closeComment,
}) => {
  const classes = useStyles();
  const [userContext, setUserContext] = useContext(Context);
  const [commentState, setCommentState] = useState();
  const [disabled, setDisabled] = useState(true);

  const checkDisabled = (comment) => {
    setDisabled(comment?.trim() <= 0);
  };
  return (
    <form className={classes.root} autoComplete="off">
      <Grid container className={classes.smallContainer}>
        <Grid container className={level === 1 ? classes.border : undefined}>
          <Grid item className={classes.avatarContainer} sm={1}>
            <Avatar
              src={userContext.pictureUrl}
              className={level > 0 ? classes.extraSmall : classes.small}
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              multiline
              fullWidth
              placeholder="Write a comment..."
              defaultValue={level === 2 ? "@" + parentOwnerName + " " : ""}
              value={commentState}
              onInput={(e) => {
                checkDisabled(e.target.value);
                setCommentState(e.target.value);
              }}
              InputProps={{
                maxLength: 1000,
                classes: {
                  input: classes.font,
                },
              }}
            />
            <div className={classes.fieldActions}>
              <IconButton onClick={closeComment}>
                <CloseIcon />
              </IconButton>
              <IconButton
                onClick={() => handleComment(commentState.trim())}
                disabled={disabled}
              >
                <SendIcon color={disabled ? "disabled" : "primary"} />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default commentField;
