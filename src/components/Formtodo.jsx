import React, { useState } from "react";

const Formtodo = ({ dataOrg, addNewTask }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTodo = {
      creator: dataOrg.orguser.pk,
      assigned_to: dataOrg.orguser.pk,
      project: null,
      team: dataOrg.teams[0].id,
      estimate: null,
      is_achived: false,
      is_logged: false,
      labels: [],
      title: title,
      code: null,
      due_date: null,
      completed_at: null,
      description: null,
      is_completed: false,
      list: null,
      priority: 0,
      status: "not_started",
      is_private: false,
      phase: null,
      annex: null,
    };
    setTitle("");
    addNewTask(newTodo);
  };
  return (
    <form id="formNewTask" onSubmit={handleSubmit}>
      <input
        type="text"
        id="formNewTask-input"
        placeholder="Add New Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input id="add-task" type="submit" value="Add" />
    </form>
  );
};

export default Formtodo;
