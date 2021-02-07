import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={1}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        justify: "center",
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '50ch',
          },
    },
    paper: {
        marginTop: "30px",
        width: 800
    },
    bar: {
        border: "none",
        boxShadow: "none"
    },
    container: {
        marginTop: "20px",
        marginBottom: "20px",
    },
    photoButton: {
        color: theme.palette.info.main,
        justifyContent: "center",
        display: "flex",
        marginTop: "10px"
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
    usattLabel: {
        color: theme.palette.text.secondary,
        textAlign: "center",
        "font-size": "13px",
        marginTop: "30px",
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

const getPersonId = () => {
    // var location = window.location.pathname;
    // return location.substring(20, location.length);
    return "5094b946-8b3b-4a8c-bfd9-6de41373c8da";
};

const editProfile = () => {
    const history = useHistory();

    const [personState, setPersonState] = useState(undefined);

    const initialize = () => {
        console.log('initializing');
        fetch("http://localhost:8080/person/" + getPersonId())
            .then(resp => resp.json())
            .then((personData) => {
                setPersonState(personData);
                console.log('personState', personState);
            });
    }

    useEffect(() => {
        console.log('useEffect');
        initialize();
        // Register a listener to trap url changes
        return history.listen((location) => {
            if (location.pathname.includes('person-profile')) {
                initialize();
            }
        })
    }
        , []);

    const classes = useStyles();

    const renderProfileCard = () => {
        return (
            <Paper className={classes.paper}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} sm={4} >
                        <Avatar src={personState.pictureUrl} className={classes.large}> </Avatar>
                        <div className={classes.photoButton}>
                            <Button color="primary">Change Photo </Button>
                        </div>
                        <Grid xs={12} item >
                            <div className={classes.usattLabel}>USATT #{personState.usattNumber}</div>
                        </Grid>
                    </Grid>
                    <Grid container xs={8} item >
                        <form 
                        className={classes.root} 
                        noValidate autoComplete="off" >
                            <TextField 
                            id="standard-basic" 
                            label="First Name" 
                            defaultValue={personState.firstName}
                            fullWidth/>
                            <TextField 
                            id="standard-basic" 
                            label="Last Name" 
                            defaultValue={personState.lastName}
                            fullWidth/>
                            <TextField
                                id="filled-multiline-flexible"
                                label="Bio"
                                multiline
                                rowsMax={4}
                                fullWidth
                            />
                            <TextField
                                id="standard-basic"
                                label="Email"
                                fullWidth
                            />
                            <TextField
                                id="standard-basic"
                                label="Phone Number"
                                fullWidth
                            />

                        </form>
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    const renderProfile = () => {
        return (
            <div className={classes.root}>
                <Grid container >
                    {renderProfileCard()}
                </Grid>
            </div>
        );
    }


    if (!personState) return false
    else return renderProfile();

};

export default editProfile;
