import React, { Component } from "react";
// materialui
import {
  Typography,
  TextField,
  Grid,
  Button,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { Link } from "react-router-dom";

export default class CreateRoomPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: true,
      votesToSkip: 2,
    };

    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
  }

  handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: this.state.guestCanPause,
        votes_to_skip: this.state.votesToSkip,
      }),
    };
    fetch("/api/create", requestOptions)
      .then((res) => res.json())
      .then((data) => this.props.history.push("/room/" + data.code));
  }

  render() {
    return (
      // create room
      // guest pause true / false
      //number votes to change
      //submit
      //back

      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Create A Room
          </Typography>
        </Grid>

        {/* guest can pause toggle  */}
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>

            <RadioGroup
              row
              defaultValue="true"
              onChange={(e) => {
                this.setState({
                  guestCanPause: e.target.value === "true" ? true : false,
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
            {/* update votes to skip */}
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
        </Grid>

        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>

        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }
}
