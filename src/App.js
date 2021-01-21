import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import React, { useMemo, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import AuthRoute from "./components/AuthRoute";
import Login from "./components/Login";
import Logout from "./components/Logout";
import TodoFilter from "./components/TodoFilter";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import useTodo from "./hooks/useTodo";
import { AuthProvider } from "./services/authProvider";

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
  paper: {
    margin: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function App() {
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
    <div className="App">
      <CssBaseline />
      <header>
        <AuthProvider>
          <BrowserRouter>
            <Switch>
              <Redirect exact path="/" to="/login" />
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              <AuthRoute exact path="/home">
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
              </AuthRoute>
            </Switch>
          </BrowserRouter>
        </AuthProvider>
      </header>
    </div>
  );
}

export default App;
