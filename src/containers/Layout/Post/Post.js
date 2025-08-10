import { CardContent, CardHeader, TextField } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PublishIcon from "@material-ui/icons/Publish";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../api-url";
import { APP_PAPER_ELEVATION } from "../../../app-config";
import { Context } from "../../../Context";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import { Storage } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justify: "center",
    overflowX: "hidden",
  },
  paper: {
    marginTop: theme.spacing(4),
    width: "100%",
    maxWidth: 800,
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  bar: {
    border: "none",
    boxShadow: "none",
  },
  container: {
    marginTop: "20px",
    marginBottom: "10px",
    marginLeft: "40px",
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  fileIcon: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  name: {
    marginTop: "10px",
    "font-size": "20px",
    // marginLeft: "10px",
  },
  media: {
    height: 0,
    paddingTop: "100%", // 16:9
  },
  tags: {
    width: "100%",
    marginTop: "10px",
  },
  tagLabel: {
    left: "10px",
  },
  createPost: {
    marginTop: "15px",
    whiteSpace: "nowrap",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const post = () => {
  const classes = useStyles();

  const history = useHistory();

  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  // the context modified in Home when user logs in
  const [userContext, setUserContext] = useContext(Context);
  // console.log(userContext);

  // const personId = user?.attributes?.sub;
  // console.log("personId", personId);
  const postRef = React.useRef();

  const updatePostRef = (key, value) => {
    const temp = { ...postRef.current };
    temp[key] = value;
    postRef.current = temp;
    // setPostState(temp);
    // console.log("postRef", postRef.current);
  };

  const onUpload = (e) => {
    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (e.currentTarget?.files[0]?.size > MAX_FILE_SIZE_BYTES) {
      alert(`File too big! Max size is ${MAX_FILE_SIZE_MB}MB`);
    } else {
      setFile(e.currentTarget.files[0]);
    }
  };

  const displayFile = () => {
    if (!file) {
      return (
        <CardContent>
          Step 1 <hr />
        </CardContent>
      );
    }
    if (file.type.includes("video")) {
      // console.log(URL.createObjectURL(file));
      return (
        // <ReactPlayer
        //     url={URL.createObjectURL(file)}
        //     className={classes.videoPlayer}
        //     controls="true"
        // />
        <CardMedia
          // className={classes.media}
          component="video"
          src={URL.createObjectURL(file)}
          controls={true}
        />
      );
    } else {
      return (
        <CardMedia
          className={classes.media}
          media="picture"
          alt="Title"
          image={URL.createObjectURL(file)}
        />
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fileKey = `${Date.now()}_${file.name}`;

      // Upload to Amplify Storage (adjust level if needed)
      await Storage.put(fileKey, file, {
        contentType: file.type,
        level: "public", // or 'protected'/'private' based on your security needs
      });

      // Instead of storing a signed URL, store the fileKey only
      const postData = {
        ownerId: userContext.personId,
        ownerType: "person",
        ownerName: `${userContext?.firstName} ${userContext?.lastName}`,
        ownerProfilePic: userContext.pictureUrl,
        visibility: { level: "public" },
        fileUrl: fileKey, // <-- Store the key
        fileType: file.type,
        title: postRef.current.title,
        description: postRef.current.description,
      };

      const resp = await fetch(API_URL.post + "?postType=post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const json = await resp.json();
      // console.log(json);

      setLoading(false);
      navigateToPersonProfile(userContext.personId);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Try again.");
      setLoading(false);
    }
  };

  const navigateToPersonProfile = (personId) => {
    history.push("/person-profile/" + personId);
  };

  const renderTags = () => {};

  const renderPostCard = () => {
    const date = new Date();
    const [tagName, setTagName] = React.useState([]);

    const handleTagsChange = (event) => {
      const {
        target: { value },
      } = event;
      setTagName(
        // On autofill we get a the stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    };

    const tags = ["Training", "News", "Tournament"];
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };
    function getStyles(name, tagName, theme) {
      return {
        fontWeight:
          tagName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
      };
    }
    const theme = useTheme();

    return (
      <Card className={classes.paper} elevation={APP_PAPER_ELEVATION}>
        <CardHeader
          avatar={
            <Avatar src={userContext?.pictureUrl} className={classes.small} />
          }
          title={`${userContext?.firstName} ${userContext?.lastName}`}
          subheader={date.toLocaleDateString()}
        />

        {displayFile()}
        <CardActions>
          <input
            hidden
            type="file"
            id="contained-button-file"
            accept="video/*, image/*"
            onChange={onUpload}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="default"
              component="span"
              startIcon={<PublishIcon />}
            >
              Upload photo or video
            </Button>
          </label>
        </CardActions>
        <CardContent>
          Step 2 <hr />
          <form autoComplete="off" onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={10}>
                <TextField
                  id="title"
                  label="Title"
                  fullWidth
                  required
                  onInput={(e) => updatePostRef("title", e.target.value)}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={10}>
                <TextField
                  id="description"
                  label="Description"
                  multiline
                  maxRows={10}
                  fullWidth
                  inputProps={{ maxLength: 1000 }}
                  onInput={(e) => updatePostRef("description", e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={10}>
                <FormControl className={classes.tags}>
                  <InputLabel
                    className={classes.tagLabel}
                    id="demo-multiple-chip-label"
                  >
                    Tags (Optional)
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={tagName}
                    onChange={handleTagsChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {tags.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, tagName, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.createPost}
                  type="submit"
                >
                  Post
                </Button>
                <Backdrop className={classes.backdrop} open={loading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderPost = () => {
    return (
      <div className={classes.root}>
        <Grid container spacing={2} justifyContent="center">
          {renderPostCard()}
        </Grid>
      </div>
    );
  };

  return renderPost();
};

export default post;
