import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import axios from "axios";
import CreateRoomPage from "./components/CreateRoomPage";
import Homepage from "./components/Homepage";
import Room from "./components/Room";
import RoomJoinPage from "./components/RoomJoinPage";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
function App() {
  const [todos, setTodos] = useState([]);
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    fetch("/api/get-room" + "?roomCode=JRVTNI")
      .then((res) => res.json())
      .then((data) => console.log(data.host));
  }, []);
  //  componentDidMount() {
  //     fetch("/api/user-in-room")
  //       .then((res) => res.json())
  //       .then((data) =>
  //         data.roomCode
  //           ? this.setState({
  //               roomCode: data.roomCode,
  //             })
  //           : this.setState({
  //               roomCode: null,
  //             })
  //       );
  //   }

  // useEffect(() => {
  //   axios
  //     .get("/api/todos")
  //     .then((res) => {
  //       setTodos([res.data]);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => {
            return roomCode ? (
              <Redirect to={`/room/${roomCode}`} />
            ) : (
              <Homepage />
            );
          }}
        />
        <Route path="/join" component={RoomJoinPage} />
        <Route path="/create" component={CreateRoomPage} />
        <Route
          path="/room/:roomCode"
          render={(props) => {
            return <Room {...props} />;
          }}
        />
      </Switch>
    </Router>
  );
}

export default App;
