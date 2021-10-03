import React, { Component } from "react";
import Alert from "@material-ui/lab/Alert";
import MusicsPlayer from "./MusicsPlayer";
import {
  Grid,
  Button,
  Typography,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  FormControlLabel,
  Radio,
  TextField,
} from "@material-ui/core";
import { RadioGroup } from "@material-ui/core";
import MusicPlayer from "./MusicsPlayer";
import { LaptopWindows } from "@material-ui/icons";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSetting: false,

      erroMsg: "",
      successMsg: "",

      isSpotifyAuth: false,
      song: {},
    };
    this.getSpotifyAuth = this.getSpotifyAuth.bind(this);
    this.renderSettingButton = this.renderSettingButton.bind(this);
    this.renderSetting = this.renderSetting.bind(this);
    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.handleUpdateButton = this.handleUpdateButton.bind(this);
    this.renderRoom = this.renderRoom.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
  }

  componentDidMount() {
    this.getRoomDetails();

    this.interval = setInterval(this.getCurrentSong, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  getRoomDetails() {
    fetch("/api/get-room" + "?roomCode=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.isHost,
        });
        if (this.state.isHost) {
          this.getSpotifyAuth();
        }
      });
  }

  getCurrentSong() {
    fetch("/spotify/get-song")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ song: data });
      });
  }
  getSpotifyAuth() {
    fetch("/spotify/is-spotify-auth")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          this.setState({
            isSpotifyAuth: true,
          });
        } else {
          fetch("/spotify/get-auth-url")
            .then((res) => res.json())
            .then((data) => window.location.replace(data.url));
        }
      });
  }
  //2. leave room
  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((res) => {
      this.props.history.push("/");
    });
  }
  // 3.setting section include setting button, setting pop-up: update button,handle update,

  renderSettingButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.setState({ showSetting: true });
          }}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  renderSetting() {
    // update page
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse
            in={this.state.erroMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
              >
                {this.state.erroMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Update
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue={this.state.guestCanPause.toString()}
              onChange={(e) => {
                this.setState({
                  guestCanPause: e.target.value,
                });
              }}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={(e) => {
                this.setState({
                  votesToSkip: e.target.value,
                });
              }}
              defaultValue={this.state.votesToSkip}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Votes Required To Skip Song</div>
            </FormHelperText>
          </FormControl>
          {this.renderUpdateButtons()}
        </Grid>

        {/* close button */}

        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              this.setState({ showSetting: false });
              this.getRoomDetails();
            }}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  handleUpdateButton() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: this.state.guestCanPause,
        votes_to_skip: this.state.votesToSkip,
      }),
    };
    fetch("/api/create", requestOptions)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) =>
        data
          ? this.setState({
              votesToSkip: data.votes_to_skip,
              guestCanPause: data.guest_can_pause,
              successMsg: "Successfully Updated",
            })
          : this.setState({
              errorMsg: `Can't update room`,
            })
      );
  }
  renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleUpdateButton}
        >
          Update Room
        </Button>
      </Grid>
    );
  }

  // end of setting section

  //render default room
  renderRoom() {
    return (
      <Grid item xs={12} align="center">
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Grid container spacing={1}>
        <h1>{this.state.isSpotifyAuth.toString()}</h1>
        {this.state.showSetting || this.renderRoom()}
        {this.state.isHost &&
          !this.state.showSetting &&
          this.renderSettingButton()}
        {this.state.showSetting && this.renderSetting()}
        <Grid item xs={12} align="center">
          <MusicsPlayer song={this.state.song} />
        </Grid>
        {this.state.showSetting ||
          (() => {
            return (
              <Grid item xs={12} align="center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.leaveButtonPressed}
                >
                  Leave Room
                </Button>
              </Grid>
            );
          })()}
      </Grid>
    );
  }
}

// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import Alert from "@material-ui/lab/Alert";
// import MusicsPlayer from "./MusicsPlayer";
// import {
//   Grid,
//   Button,
//   Typography,
//   Collapse,
//   FormControl,
//   FormHelperText,
//   FormLabel,
//   FormControlLabel,
//   Radio,
//   TextField,
// } from "@material-ui/core";
// import { RadioGroup } from "@material-ui/core";
// // import MusicPlayer from "./MusicsPlayer";
// import { useState, useEffect } from "react/cjs/react.development";
// // const Room = () => {
// //   // states
// //   const [votesToSkip, setVotesToSkip] = useState(2);
// //   const [guestCanPause, setGuestCanPause] = useState(false);
// //   const [isHost, setIsHost] = useState(false);
// //   const [showSetting, setShowSetting] = useState(false);
// //   const [errorMsg, setErrorMsg] = useState("");
// //   const [successMsg, setSuccessMsg] = useState("");
// //   const [isSpotifyAuth, setIsSpotifyAuth] = useState(false);
// //   const [song, setSong] = useState({});

// //   //functions
// //   function renderSettingButton() {
// //     return (
// //       <Grid item xs={12} align="center">
// //         <Button
// //           variant="contained"
// //           color="primary"
// //           onClick={() => {
// //             setShowSetting(true);
// //           }}
// //         >
// //           Settings
// //         </Button>
// //       </Grid>
// //     );
// //   }
// //   function renderSetting() {
// //     // update page
// //     return (
// //       <Grid container spacing={1}>
// //         <Grid item xs={12} align="center">
// //           <Collapse in={erroMsg != "" || successMsg != ""}>
// //             {successMsg != "" ? (
// //               <Alert
// //                 severity="success"
// //                 onClose={() => {
// //                   setSuccessMsg("");
// //                 }}
// //               >
// //                 {successMsg}
// //               </Alert>
// //             ) : (
// //               <Alert
// //                 severity="error"
// //                 onClose={() => {
// //                   setErrorMsg("");
// //                 }}
// //               >
// //                 {erroMsg}
// //               </Alert>
// //             )}
// //           </Collapse>
// //         </Grid>
// //         <Grid item xs={12} align="center">
// //           <Typography component="h4" variant="h4">
// //             Update
// //           </Typography>
// //         </Grid>
// //         <Grid item xs={12} align="center">
// //           <FormControl component="fieldset">
// //             <FormHelperText>
// //               <div align="center">Guest Control of Playback State</div>
// //             </FormHelperText>
// //             <RadioGroup
// //               row
// //               defaultValue={guestCanPause.toString()}
// //               onChange={(e) => {
// //                 setGuestCanPause(e.target.value);
// //               }}
// //             >
// //               <FormControlLabel
// //                 value="true"
// //                 control={<Radio color="primary" />}
// //                 label="Play/Pause"
// //                 labelPlacement="bottom"
// //               />
// //               <FormControlLabel
// //                 value="false"
// //                 control={<Radio color="secondary" />}
// //                 label="No Control"
// //                 labelPlacement="bottom"
// //               />
// //             </RadioGroup>
// //           </FormControl>
// //         </Grid>
// //         <Grid item xs={12} align="center">
// //           <FormControl>
// //             <TextField
// //               required={true}
// //               type="number"
// //               onChange={(e) => {
// //                 setVotesToSkip(e.target.value);
// //               }}
// //               defaultValue={votesToSkip}
// //               inputProps={{
// //                 min: 1,
// //                 style: { textAlign: "center" },
// //               }}
// //             />
// //             <FormHelperText>
// //               <div align="center">Votes Required To Skip Song</div>
// //             </FormHelperText>
// //           </FormControl>
// //           {renderUpdateButtons()}
// //         </Grid>

// //         {/* close button */}

// //         <Grid item xs={12} align="center">
// //           <Button
// //             variant="contained"
// //             color="secondary"
// //             onClick={() => {
// //               setShowSetting(false);
// //               getRoomDetails();
// //             }}
// //           >
// //             Close
// //           </Button>
// //         </Grid>
// //       </Grid>
// //     );
// //   }

// //   function handleUpdateButton() {
// //     const requestOptions = {
// //       method: "POST",
// //       headers: { "Content-type": "application/json" },
// //       body: JSON.stringify({
// //         guest_can_pause: guestCanPause,
// //         votes_to_skip: votesToSkip,
// //       }),
// //     };
// //     fetch("/api/create", requestOptions)
// //       .then((res) => (res.ok ? res.json() : null))
// //       .then((data) => {
// //         if (data) {
// //           setVotesToSkip(data.votes_to_skip);
// //           setGuestCanPause(data.guest_can_pause);
// //           setSuccessMsg("Successfully Updated");
// //         } else {
// //           setErrorMsg("Cant Update Room");
// //         }
// //       });
// //   }
// //   function renderUpdateButtons() {
// //     return (
// //       <Grid item xs={12} align="center">
// //         <Button
// //           color="primary"
// //           variant="contained"
// //           onClick={handleUpdateButton}
// //         >
// //           Update Room
// //         </Button>
// //       </Grid>
// //     );
// //   }

// //   // end of setting section

// //   //render default room
// //   function renderRoom() {
// //     return (
// //       <Grid container xs={12} align="center">
// //         <Grid item xs={12} align="center">
// //           <Typography variant="h4" component="h4">
// //             Code: {roomCode}
// //           </Typography>
// //         </Grid>
// //         <Grid item xs={12} align="center">
// //           <Typography variant="h6" component="h6">
// //             Votes: {votesToSkip}
// //           </Typography>
// //         </Grid>
// //         <Grid item xs={12} align="center">
// //           <Typography variant="h6" component="h6">
// //             Guest Can Pause: {guestCanPause.toString()}
// //           </Typography>
// //         </Grid>
// //         <Grid item xs={12} align="center">
// //           <Typography variant="h6" component="h6">
// //             Host: {isHost.toString()}
// //           </Typography>
// //         </Grid>
// //       </Grid>
// //     );
// //   }

// //   return (
// //     <div>
// //       <Grid container spacing={1}>
// //         {showSetting || renderRoom()}
// //         {isHost && !showSetting && renderSettingButton()}
// //         {showSetting && renderSetting()}
// //         <Grid item xs={12} align="center">
// //           <MusicsPlayer song={song} />
// //         </Grid>
// //         {showSetting ||
// //           (() => {
// //             return (
// //               <Grid item xs={12} align="center">
// //                 <Button
// //                   variant="contained"
// //                   color="secondary"
// //                   onClick={leaveButtonPressed}
// //                 >
// //                   Leave Room
// //                 </Button>
// //               </Grid>
// //             );
// //           })()}
// //       </Grid>
// //     </div>
// //   );
// // };

// // export default Room;
