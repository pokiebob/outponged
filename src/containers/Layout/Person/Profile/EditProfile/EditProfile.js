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
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MaskedInput from 'react-text-mask';
import FormControl from '@material-ui/core/FormControl';

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
    var location = window.location.pathname;
    return location.substring(20, location.length);
    // return "5094b946-8b3b-4a8c-bfd9-6de41373c8da";
};

const ATTRIB = {
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    BIO: 'bio',
    EMAIL: 'email',
    PHONE_NUMBER: 'phoneNumber'
}

const editProfile = () => {
    const history = useHistory();

    const [origPersonState, setOrigPersonState] = useState(undefined);
    const [newPersonState, setNewPersonState] = useState();

    const initialize = () => {
        console.log('initializing');
        fetch("http://localhost:8080/person/" + getPersonId())
            .then(resp => resp.json())
            .then((personData) => {
                setOrigPersonState(personData);
                setNewPersonState({ ...personData });
            });
    }


    function TextMaskCustom(props) {
        const { inputRef, ...other } = props;

        return (
            <MaskedInput
                {...other}
                ref={(ref) => {
                    inputRef(ref ? ref.inputElement : null);
                }}
                mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                placeholderChar={'\u2000'}
                showMask
            />
        );
    }

    TextMaskCustom.propTypes = {
        inputRef: PropTypes.func.isRequired,
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const difKeys = Object.keys(newPersonState).filter(key => newPersonState[key] !== origPersonState[key]);

        const diff = {}
        difKeys.forEach(x => diff[x] = newPersonState[x]);

        const patch = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify(diff)
        }

        fetch("http://localhost:8080/person/" + getPersonId(), patch)
            .then(resp => resp.json())
            .then((resp) => {
                // console.log(resp);
                setOrigPersonState({ ...newPersonState });
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

    /**
     * True if deep compare shows a diff
     */
    const isSubmitEnabled = () => JSON.stringify(newPersonState) !== JSON.stringify(origPersonState);

    const updateNewPersonState = (key, value) => {
        // console.log('updateNewProp', key, value);
        const temp = { ...newPersonState };
        temp[key] = value;
        setNewPersonState(temp);
    }

    const renderProfileCard = () => {
        console.log('[renderProfileCard] origPersonState', origPersonState);
        console.log('[renderProfileCard] newPersonState', newPersonState);



        return (
            <Paper className={classes.paper}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} sm={4} >
                        <Avatar src={origPersonState.pictureUrl} className={classes.large}> </Avatar>
                        <div className={classes.photoButton}>
                            <Button color="primary">Change Photo</Button>
                        </div>
                        <Grid xs={12} item >
                            <div className={classes.usattLabel}>USATT #{origPersonState.usattNumber}</div>
                        </Grid>
                    </Grid>
                    <Grid container xs={8} item >
                        <form
                            className={classes.root}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}>
                            <TextField
                                id="standard-full-width"
                                label="First Name"
                                defaultValue={origPersonState.firstName}
                                value={newPersonState?.firstName}
                                onInput={e => updateNewPersonState(ATTRIB.FIRST_NAME, e.target.value)}
                                fullWidth
                            />
                            <TextField
                                id="standard-basic"
                                label="Last Name"
                                defaultValue={origPersonState.lastName}
                                value={newPersonState?.lastName}
                                onInput={e => updateNewPersonState(ATTRIB.LAST_NAME, e.target.value)}
                                fullWidth
                            />
                            <TextField
                                id="filled-multiline-flexible"
                                label="Bio"
                                multiline
                                rowsMax={4}
                                defaultValue={origPersonState.bio}
                                value={newPersonState?.bio}
                                onInput={e => updateNewPersonState(ATTRIB.BIO, e.target.value)}
                                fullWidth
                            />

                            <TextField
                                id="standard-basic"
                                label="Email"
                                defaultValue={origPersonState.email}
                                value={newPersonState?.email}
                                onInput={e => updateNewPersonState(ATTRIB.EMAIL, e.target.value)}
                                fullWidth
                            />

                            {/* <TextField
                                label="Phone Number"
                                defaultValue={origPersonState.phoneNumber}
                                value={newPersonState?.phoneNumber }
                                onInput={e => updateNewPersonState(ATTRIB.PHONE_NUMBER, e.target.value)}
                                name="Phone Number"
                                id="formatted-text-mask-input"
                                InputProps={{
                                    inputComponent: TextMaskCustom
                                }}
                                fullWidth
                            /> */}

                            <TextField
                                id="standard-basic"
                                label="Phone Number"
                                defaultValue={origPersonState.phoneNumber}
                                value={newPersonState?.phoneNumber}
                                onInput={e => updateNewPersonState(ATTRIB.PHONE_NUMBER, e.target.value)}
                                fullWidth
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isSubmitEnabled()}
                            >
                                Save
                            </Button>

                        </form>
                    </Grid>
                </Grid>
            </Paper>
        );
    }

    const renderProfile = () => {
        return (
            <div className={classes.root}>
                <Grid container justify="center" >
                    {renderProfileCard()}
                </Grid>
            </div>
        );
    }


    if (!origPersonState) return false
    else return renderProfile();

};

export default editProfile;
