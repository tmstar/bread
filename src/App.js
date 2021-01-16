import "./App.css";
import React, { useState, useMemo } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";
import useTodo from "./hooks/useTodo";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function App() {
  const classes = useStyles();
  const { todos, toggleTodo, deleteTodo, addTodo } = useTodo();
  const [filter, setFilter] = useState("all");
  const handleFilter = (event) => {
    setFilter(event.target.value);
  };
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "inProgress":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "all":
      default:
        return todos;
    }
  }, [todos, filter]);
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h6" className={classes.title}>
          Todo List
        </Typography>
        <TodoFilter handleFilter={handleFilter} selectedFilter={filter} />
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      </header>
    </div>
  );
}

export default App;
