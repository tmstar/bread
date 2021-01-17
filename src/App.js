import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useMemo, useState } from "react";
import "./App.css";
import TodoFilter from "./components/TodoFilter";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import useTodo from "./hooks/useTodo";

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
  const handleFilter = (event, newValue) => {
    if (newValue !== null) {
      setFilter(newValue);
    }
  };
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "inProgress":
        return todos.filter((todo) => !todo.completed);
      case "all":
      default:
        return todos;
    }
  }, [todos, filter]);
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h6" className={classes.title}>
          Shopping List
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
