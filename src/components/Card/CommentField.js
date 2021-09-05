import React, { useState, useContext } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import { IconButton } from '@material-ui/core';
import { InputAdornment } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import { TextField } from "@material-ui/core";
import { Context } from "../../Context";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    smallContainer: {
        marginTop: "20px"
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5)
    },
    extraSmall: {
        width: theme.spacing(3),
        height: theme.spacing(3)
    },
    border: {
        // borderLeft: "1px solid lightgray",
        marginLeft: "10px"
    },
    outerCol: {
        marginLeft: "20px"
    },
    textField: {
        padding: "0px"
    },
    font: {
        fontSize: "14px",
    },
    reducedPadding: {
        padding: "0px 0 7px"
    },
    fieldActions: {
        float: 'right'
    },
    avatarContainer: {
        minWidth: "60px"
    }
}));

const commentField = ({ handleComment, level, parentOwnerName, closeComment }) => {
    const classes = useStyles();
    const [userContext, setUserContext] = useContext(Context);
    const [commentState, setCommentState] = useState();

    return (
        <form className={classes.root} autoComplete="off">
            <Grid container className={classes.smallContainer}>
                <Grid container className={level === 1 ? classes.border : {}} >
                    <Grid item className={classes.avatarContainer} sm={1}>
                        <Avatar src={userContext.pictureUrl} className={level > 0 ? classes.extraSmall : classes.small} />
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        <TextField
                            multiline
                            fullWidth
                            placeholder="Write a comment..."
                            defaultValue={level === 2 ? "@" + parentOwnerName + " " : ""}
                            value={commentState}
                            onInput={e => setCommentState(e.target.value)}
                            InputProps={{
                                maxLength: 1000,
                                classes: {
                                    input: classes.font,
                                },
                            }}
                        />
                        <div className={classes.fieldActions}>
                            <IconButton
                                onClick={closeComment}
                            >
                                <CloseIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleComment(commentState)}
                            >
                                <SendIcon color="primary" />
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
}

export default commentField;