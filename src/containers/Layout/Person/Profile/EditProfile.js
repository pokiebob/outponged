import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MaskedInput from "react-text-mask";
import { API_URL } from "../../../../api-url";
import { Context } from "../../../../Context";
import { Storage, Auth } from "aws-amplify";
import AWS from "aws-sdk";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justify: "center",
    "& .MuiTextField-root": {
      margin: theme.spacing(1, 0),
      width: "90%",
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    width: "100%",
    maxWidth: 800,
    padding: theme.spacing(2),
  },
  bar: {
    border: "none",
    boxShadow: "none",
  },
  container: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  photoButton: {
    color: theme.palette.info.main,
    justifyContent: "center",
    display: "flex",
    marginTop: "10px",
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
    margin: "auto",
  },
  name: {
    "margin-top": "20px",
    "font-size": "18px",
    textAlign: "center",
  },
}));

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={"\u2000"}
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

  const [userContext, setUserContext] = useContext(Context);
  const [origPersonState, setOrigPersonState] = useState(undefined);
  const [newPersonState, setNewPersonState] = useState();
  const classes = useStyles();

  const initialize = async (isMounted) => {
    //   console.log(userContext);
    //   console.log("initializing");

    try {
      const resp = await fetch(
        API_URL.person + userContext.personId + "/?page=home"
      );

      if (!resp.ok) {
        const text = await resp.text(); // possibly an HTML error page
        console.warn(
          `Failed to fetch profile (status: ${resp.status}):`,
          text.slice(0, 200) // print first 200 chars for debugging
        );
        return;
      }

      const personData = await resp.json();

      if (isMounted) {
        setOrigPersonState(personData);
        setNewPersonState({ ...personData });
      }
    } catch (err) {
      console.error("Error during profile initialization:", err);
    }
  };

  const ATTRIB = {
    FIRST_NAME: {
      propName: "firstName",
      isValid: newPersonState?.firstName?.trim().length > 0,
      validate: (firstName) => firstName.trim().length > 0,
    },
    LAST_NAME: {
      propName: "lastName",
      isValid: newPersonState?.lastName?.trim().length > 0,
      validate: (lastName) => lastName.trim().length > 0,
    },
    BIO: {
      propName: "bio",
      isValid: true,
      validate: (bio) => bio.length < 200,
    },
    EMAIL: {
      propName: "email",
      isValid: true,
      validate: (email) => {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email?.toLowerCase());
      },
    },
    PHONE_NUMBER: {
      propName: "phoneNumber",
      isValid: true,
      validate: (phoneNumber) => phoneNumber.trim().length === 14,
    },
    PICTURE_URL: {
      propName: "pictureUrl",
      isValid: true,
      validate: (url) => url.length > 0,
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const difKeys = Object.keys(newPersonState).filter(
      (key) => newPersonState[key] !== origPersonState[key]
    );

    const diff = {};
    difKeys.forEach((x) => (diff[x] = newPersonState[x]));
    // console.log("diff", diff);

    const patch = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(diff),
    };

    fetch(API_URL.person + userContext.personId, patch)
      .then((resp) => resp.json())
      .then((resp) => {
        // console.log(resp);
        setUserContext(resp);
        // console.log(resp);
        setOrigPersonState({ ...newPersonState });
      })
      .then(() => {
        navigateToPersonProfile(userContext.personId);
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (userContext?.personId) {
      initialize(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [userContext]);

  const navigateToPersonProfile = (personId) => {
    history.push("/person-profile/" + personId);
  };

  /**
   * True if deep compare shows a diff
   */
  const isSubmitEnabled = () => {
    return (
      JSON.stringify(newPersonState) !== JSON.stringify(origPersonState) &&
      Object.values(ATTRIB).every((x) => x.isValid)
    );
  };

  const onPhotoUpload = async (e) => {
    const file = e.currentTarget?.files?.[0];
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`File too big! Max size is ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    const filename = `profile-pics/${userContext.personId}_${Date.now()}_${
      file.name
    }`;

    try {
      // Get current credentials from Amplify Auth
      const credentials = await Auth.currentCredentials();

      const s3 = new AWS.S3({
        credentials: Auth.essentialCredentials(credentials),
        region: "us-east-1",
      });

      const params = {
        Bucket: "outponged-profile-pic",
        Key: filename,
        Body: file,
        ContentType: file.type,
        ACL: "public-read", // allows public access to image
      };

      // Upload to S3
      await s3.putObject(params).promise();

      // Construct the public URL
      const url = `https://${params.Bucket}.s3.${s3.config.region}.amazonaws.com/${filename}`;
      updateNewPersonState(ATTRIB.PICTURE_URL, url);

      // Save to backend
      const patch = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pictureUrl: url }),
      };

      fetch(API_URL.person + userContext.personId, patch)
        .then((resp) => resp.json())
        .then((resp) => {
          setUserContext(resp);
          setOrigPersonState({ ...newPersonState });
        });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed: " + err.message);
    }
  };

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
  };

  const renderProfileCard = () => {
    // console.log('[renderProfileCard] origPersonState', origPersonState);
    // console.log('[renderProfileCard] newPersonState', newPersonState);

    return (
      <Paper className={classes.paper}>
        <Grid container className={classes.container}>
          <Grid item xs={12} sm={4}>
            <Avatar src={newPersonState?.pictureUrl} className={classes.large}>
              {" "}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              id="contained-button-file"
              style={{ display: "none" }}
              onChange={onPhotoUpload}
            />
            <label htmlFor="contained-button-file">
              <Button
                color="primary"
                component="span"
                className={classes.photoButton}
              >
                Change Photo
              </Button>
            </label>

            {/* </div> */}
            <Grid xs={12} item>
              <div className={classes.usattLabel}>
                USATT #{origPersonState.externalId?.usattNumber}
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <form
              className={classes.root}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                id="first-name"
                label="First Name"
                // defaultValue={origPersonState.firstName ?? ""}
                value={newPersonState?.firstName ?? ""}
                error={!ATTRIB.FIRST_NAME.isValid}
                onInput={(e) =>
                  updateNewPersonState(ATTRIB.FIRST_NAME, e.target.value)
                }
                fullWidth
              />
              <TextField
                id="last-name"
                label="Last Name"
                // defaultValue={origPersonState.lastName}
                value={newPersonState?.lastName ?? ""}
                error={!ATTRIB.LAST_NAME.isValid}
                onInput={(e) =>
                  updateNewPersonState(ATTRIB.LAST_NAME, e.target.value)
                }
                fullWidth
              />
              <TextField
                id="bio"
                label="Bio"
                multiline
                maxRows={4}
                // defaultValue={origPersonState.bio}
                value={newPersonState?.bio ?? ""}
                error={!ATTRIB.BIO.isValid}
                onInput={(e) =>
                  updateNewPersonState(ATTRIB.BIO, e.target.value)
                }
                fullWidth
              />

              <TextField
                id="email"
                label="Email"
                disabled
                // defaultValue={origPersonState.email}
                value={newPersonState?.email ?? ""}
                error={!ATTRIB.EMAIL.isValid}
                onInput={(e) =>
                  updateNewPersonState(ATTRIB.EMAIL, e.target.value)
                }
                fullWidth
              />

              <TextField
                id="phone-number"
                label="Phone Number"
                // defaultValue={origPersonState.phoneNumber}
                value={newPersonState?.phoneNumber ?? ""}
                onInput={(e) =>
                  updateNewPersonState(
                    ATTRIB.PHONE_NUMBER,
                    e.target.value.trim().substring(0, 14)
                  )
                }
                name="Phone Number"
                error={!ATTRIB.PHONE_NUMBER.isValid} //
                InputProps={{
                  inputComponent: TextMaskCustom,
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
  };

  const renderProfile = () => {
    return (
      <div className={classes.root}>
        <Grid container justifyContent="center">
          {renderProfileCard()}
        </Grid>
      </div>
    );
  };

  if (!origPersonState) return false;
  else return renderProfile();
};

export default editProfile;
