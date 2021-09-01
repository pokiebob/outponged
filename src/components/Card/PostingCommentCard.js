import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";


const useStyles = makeStyles((theme) => ({
    margin: {
        marginTop: "10px"
    },
    root: {
        flexGrow: 1,
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5)
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
    description: {
        marginLeft: "10px",
        color: theme.palette.text.secondary,
        "font-size": "15px",
        marginTop: "10px"
    },


}));

const postingCommentCard = (props) => {

    const classes = useStyles();

    const displayComments = () => {
        const comments = props.comments;
        console.log(props.ultimateParentPostId, comments);

        const immediateChildren = (parentPostId) => {
            return comments.filter(x => x.parentPostId === parentPostId);
        }

        const sortByDate = (c) => {
            return c.sort((a, b) => -a.date.localeCompare(b.date))
        }

        //rank top 2 comments
        const top2 = () => {
            return sortByDate(
                immediateChildren(props.ultimateParentPostId)
            ).slice(0, 2);
        }

        return (
            top2().map((comment, idx) => {
                console.log(idx, comment)
                const date = new Date(comment.date);
                return (
                    <Grid container className={classes.margin}>
                        <Grid item >
                            <Avatar src={comment.ownerProfilePic} className={classes.small} />
                        </Grid>
                        <Grid item>
                            <div className={classes.name}>{comment.ownerName}</div>
                            <div className={classes.date}>{date.toLocaleDateString()}</div>
                        </Grid>
                        <Grid item>
                            <div className={classes.description}>{comment.description}</div>
                        </Grid>

                    </Grid>
                );
            })
        );
    }
    return (
        <div>
            {displayComments()}
        </div>
    );
}

export default postingCommentCard;