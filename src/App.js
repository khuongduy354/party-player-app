import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
function App() {
  const [todos, setTodos] = useState();
  useEffect(() => {
    axios
      .get("/api/todos")
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>It worked</h1>
      <>{todos && todos.map((todo) => todo.id)}</>
    </div>
  );
}

export default App;
