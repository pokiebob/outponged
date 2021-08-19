import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';
import { aws } from '../../../../keys';
import { API_URL } from '../../../../api-url';

// import ReactS3 from 'react-s3';
import S3 from 'aws-s3';

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

/**
 * Form to edit a user's profile
 */
const editProfile = () => {
    const history = useHistory();

    const [origPersonState, setOrigPersonState] = useState(undefined);
    const [newPersonState, setNewPersonState] = useState();
    const classes = useStyles();
    const initialize = () => {
        console.log('initializing');
        fetch(API_URL.person + getPersonId())
            .then(resp => resp.json())
            .then((personData) => {
                setOrigPersonState(personData);
                setNewPersonState({ ...personData });
            });
    }

    const ATTRIB = {
        FIRST_NAME: {
            propName: 'firstName',
            isValid: newPersonState?.firstName?.trim().length > 0,
            validate: (firstName) => firstName.trim().length > 0
        },
        LAST_NAME: {
            propName: 'lastName',
            isValid: newPersonState?.lastName?.trim().length > 0,
            validate: (lastName) => lastName.trim().length > 0
        },
        BIO: {
            propName: 'bio',
            isValid: true,
            validate: (bio) => bio.length < 200
    
        },
        EMAIL: {
            propName: 'email',
            isValid: true,
            validate: (email) => {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email?.toLowerCase());
            }
        },
        PHONE_NUMBER: {
            propName: 'phoneNumber',
            isValid: true,
            validate: (phoneNumber) => phoneNumber.trim().length === 14
        },
        PICTURE_URL: {
            propName: 'pictureUrl',
            isValid: true,
            validate: (url) => url.length > 0
        }
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const difKeys = Object.keys(newPersonState).filter(key => newPersonState[key] !== origPersonState[key]);

        const diff = {}
        difKeys.forEach(x => diff[x] = newPersonState[x]);
        console.log('diff', diff);

        const patch = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(diff)
        }

        fetch(API_URL.person + getPersonId(), patch)
            .then(resp => resp.json())
            .then(() => {
                // console.log(resp);
                setOrigPersonState({ ...newPersonState });
            })
            .then(() => {
                navigateToPersonProfile(getPersonId())
            });

    }

    useEffect(() => {
        console.log('useEffect');
        initialize();
        // Register a listener to trap url changes
    }
        , []);

    const navigateToPersonProfile = (personId) => {
        history.push("/person-profile" + personId);
    }

    /**
     * True if deep compare shows a diff
     */
    const isSubmitEnabled = () => {
        return JSON.stringify(newPersonState) !== JSON.stringify(origPersonState) &&
            Object.values(ATTRIB).every(x => x.isValid);
    }

    // const s3config = {
    //     bucketName: 'outponged-profile-pic',
    //     region:'us-east-1',
    //     accessKeyId: aws.AWSAccessKeyId,
    //     secretAccessKey: aws.AWSSecretAccessKey
    // }

    const config = {
        bucketName: 'outponged-profile-pic',
        region: 'us-east-1',
        accessKeyId: aws.AWSAccessKeyId,
        secretAccessKey: aws.AWSSecretKey,
        s3Url: 'https://outponged-profile-pic.s3.amazonaws.com/'
    }

    const S3Client = new S3(config);
    /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */


    const onPhotoUpload = (e) => {
        const file = e.currentTarget.files[0];
        if (file !== undefined) {
            //ReactS3.uploadFile(file, s3config)
            S3Client
                .uploadFile(file)
                .then((data) => {
                    const url = data.location.replace('.com//', '.com/');
                    updateNewPersonState(ATTRIB.PICTURE_URL, url);
                    const patch = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 'pictureUrl': url })
                    }

                    fetch(API_URL.person + getPersonId(), patch)
                        .then(resp => resp.json())
                        .then((resp) => {
                            // console.log(resp);
                            setOrigPersonState({ ...newPersonState });
                        });
                })
                .catch((err) => {
                    alert(err);
                })
        }
    }


    const updateNewPersonState = (attrib, value) => {
        // console.log(attrib, value);
        const temp = { ...newPersonState };
        temp[attrib.propName] = value;
        if (attrib?.validate) {
            // console.log('validated');
            attrib.isValid = attrib.validate(value);
        }
        // console.log(attrib, value);
        setNewPersonState(temp);
    }

    const renderProfileCard = () => {
        // console.log('[renderProfileCard] origPersonState', origPersonState);
        // console.log('[renderProfileCard] newPersonState', newPersonState);

        return (
            <Paper className={classes.paper}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} sm={4} >
                        <Avatar src={newPersonState?.pictureUrl} className={classes.large}> </Avatar>
                        <input
                            type="file"
                            accept="image/*"
                            id="contained-button-file"
                            style={{ display: 'none' }}
                            onChange={onPhotoUpload}
                        />
                        <label htmlFor="contained-button-file">
                            <Button color="primary" component="span" className={classes.photoButton}>
                                Change Photo
                                </Button>
                        </label>


                        {/* </div> */}
                        <Grid xs={12} item >
                            <div className={classes.usattLabel}>USATT #{origPersonState.externalId?.usattNumber}</div>
                        </Grid>
                    </Grid>
                    <Grid container xs={8} item >
                        <form
                            className={classes.root}
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}>
                            <TextField
                                id="first-name"
                                label="First Name"
                                defaultValue={origPersonState.firstName}
                                value={newPersonState?.firstName}
                                error={!ATTRIB.FIRST_NAME.isValid}
                                onInput={e => updateNewPersonState(ATTRIB.FIRST_NAME, e.target.value)}
                                fullWidth
                            />
                            <TextField
                                id="last-name"
                                label="Last Name"
                                defaultValue={origPersonState.lastName}
                                value={newPersonState?.lastName}
                                error={!ATTRIB.LAST_NAME.isValid}
                                onInput={e => updateNewPersonState(ATTRIB.LAST_NAME, e.target.value)}
                                fullWidth
                            />
                            <TextField
                                id="bio"
                                label="Bio"
                                multiline
                                rowsMax={4}
                                defaultValue={origPersonState.bio}
                                value={newPersonState?.bio}
                                error={!ATTRIB.BIO.isValid}
                                onInput={e => updateNewPersonState(ATTRIB.BIO, e.target.value)}
                                fullWidth
                            />

                            <TextField
                                id="email"
                                label="Email"
                                defaultValue={origPersonState.email}
                                value={newPersonState?.email}
                                error={!ATTRIB.EMAIL.isValid}
                                onInput={e => updateNewPersonState(ATTRIB.EMAIL, e.target.value)}
                                fullWidth
                            />

                            <TextField
                                id="phone-number"
                                label="Phone Number"
                                defaultValue={origPersonState.phoneNumber}
                                value={newPersonState?.phoneNumber}
                                onInput={e => updateNewPersonState(ATTRIB.PHONE_NUMBER, e.target.value.trim().substring(0, 14))}
                                name="Phone Number"
                                error={!ATTRIB.PHONE_NUMBER.isValid} // 
                                InputProps={{
                                    inputComponent: TextMaskCustom
                                }}
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
