import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

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
      {todos &&
        todos.map((todo) => {
          return <h1>{todo.id}</h1>;
        })}
    </div>
  );
}

export default App;
