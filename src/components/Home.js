import TodoFilter from "./TodoFilter";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { makeStyles } from "@material-ui/core/styles";
import useTodo from "../hooks/useTodo";
import React, { useState, useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function Home() {
  const classes = useStyles();
  const { todos, toggleTodo, hideTodo, updateTodo, deleteTodo, addTodo } = useTodo();
  const [filter, setFilter] = useState("active");

  const handleFilter = (event, newValue) => {
    if (newValue !== null) {
      setFilter(newValue);
    }
  };
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => todo.is_active);
      case "inProgress":
        return todos.filter((todo) => todo.is_active && !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.is_active && todo.completed);
      case "all":
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div className={classes.paper}>
      <TodoFilter handleFilter={handleFilter} selectedFilter={filter} />
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos={filteredTodos}
        toggleTodo={toggleTodo}
        hideTodo={hideTodo}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
        hideSwitch={filter !== "all"}
      />
    </div>
  );
}

export default Home;
