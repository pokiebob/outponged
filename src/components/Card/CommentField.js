import React, { useState, useContext } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import { IconButton } from '@material-ui/core';
import { InputAdornment } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import { TextField } from "@material-ui/core";
import { Context } from "../../Context";

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
    }
}));

const commentField = ({handleComment}) => {
    const classes = useStyles();
    const [userContext, setUserContext] = useContext(Context);
    const [commentState, setCommentState] = useState();

    return (
        <form className={classes.root} autoComplete="off">
            <Grid container className={classes.smallContainer}>
                <Grid item>
                    <Avatar src={userContext.pictureUrl} className={classes.extraSmall} />
                </Grid>
                <Grid item xs={10} className={classes.outerCol}>
                    <TextField
                        multiline
                        fullWidth
                        placeholder="Write a comment..."
                        value={commentState}
                        onInput={e => setCommentState(e.target.value)}
                        InputProps={{
                            maxLength: 1000,
                            classes: {
                                input: classes.font,
                            },
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleComment(commentState)}
                                    >
                                        <SendIcon color="primary" />
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default commentField;