import React from "react";

const Room = () => {
  return <div>RoomPage</div>;
};

export default Room;

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
