import React, { useState } from "react";

const Todo = ({ todo, deleteTask, updateTask, updateCompleted }) => {
  const [isCompleted, setIsCompleted] = useState(todo.is_completed);
  const [newTitle, setNewTitle] = useState("");

  const handleCheckboxCheck = (e) => {
    const updatedIsChanged = e.target.checked;
    setIsCompleted(updatedIsChanged);
    updateCompleted(todo.pk, updatedIsChanged);
  };
  const handleEdit = () => {
    const enterNewTitle = prompt("Write your new title", todo.title);

    if (enterNewTitle) {
      setNewTitle(enterNewTitle);
      updateTask(todo.pk, enterNewTitle);
    } else {
      alert("Please enter a valid title");
      prompt("Write your new title", todo.title);
    }
  };
  return (
    <li id={todo.pk} className="toDoComponent-container">
      <div className="toDoComponent-container__inputs-labels">
        <span>
          <input
            id={`todo/${todo.pk}`}
            className="toDoComponent-container__checkbox"
            type="checkbox"
            defaultChecked={isCompleted}
            onChange={handleCheckboxCheck}
            data-testid="checkbox"
          />
        </span>
        <label
          className="toDoComponent-container__label"
          htmlFor={`todo/${todo.pk}`}
        >
          <p>{newTitle || todo.title}</p>
        </label>
      </div>
      <div className="toDoComponent-container__icons-container">
        <i
          onClick={() => deleteTask(todo.pk)}
          className="fa-solid fa-trash-can delete"
        ></i>
        <i onClick={handleEdit} className="fa-solid fa-pen-clip modify"></i>
      </div>
    </li>
  );
};

export default Todo;
