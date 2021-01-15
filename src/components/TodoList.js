import React from "react";

function TodoList({ todos }) {
  const todoList = todos.map(todo => {
    const label = todo.completed ? "作業中にする" : "完了にする";
    return (
      <li key={todo.id}>
        {todo.title}
        <button>{label}</button>
        <button>削除</button>
      </li>
    );
  });

  return <ul>{todoList}</ul>;
}

export default TodoList;
