import React, { useState, useEffect } from "react";
import Todo from "./components/Todo";
import Formtodo from "./components/Formtodo";
import Chart from "./components/Chart";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const urlToken = "https://app.ooti.co/api/v1/token-auth/";
  const urlOrgPk = "https://app.ooti.co/api/v1/organizations/membership/";
  const [toDoList, setToDoList] = useState([]);
  const [toDoData, setToDoData] = useState([]);
  const [task, setTask] = useState("");
  const [payload, setPayload] = useState({});

  const userLog = {
    username: "miguet.robin@gmail.com",
    password: "Vjywnzik04/07",
  };
  const bodyLog = JSON.stringify(userLog);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlToken, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyLog,
        });

        if (!response.ok) {
          throw new Error(
            "Failed to authenticate or the server is not responding."
          );
        }

        const data = await response.json();
        const token = data.token;
        localStorage.setItem("Token", token);

        const orgResponse = await fetch(urlOrgPk, {
          headers: { Authorization: `JWT ${token}` },
        });

        if (!orgResponse.ok) {
          throw new Error("Failed to fetch or the server is not responding.");
        }

        const orgData = await orgResponse.json();
        const orgPk = orgData.organizations[0].id;
        setToDoData(orgData.organizations[0]);
        const urlDataTodo = `https://app.ooti.co/api/v1/tasks/list/${orgPk}/`;
        setTask(urlDataTodo);

        const fetchTodoList = await fetch(urlDataTodo, {
          headers: {
            Authorization: `JWT ${token}`,
            Accept: "application/json",
          },
        });
        if (!fetchTodoList.ok) {
          throw new Error(
            "Failed to fetch the todo list or the server is not responding."
          );
        }
        const dataTodoRes = await fetchTodoList.json();
        setToDoList(dataTodoRes.results);
        setPayload({
          creator: orgData.organizations[0].orguser.pk,
          assigned_to: orgData.organizations[0].orguser.pk,
          project: dataTodoRes.project,
          team: orgData.organizations[0].teams[0].id,
          estimate: null,
          is_achived: false,
          is_logged: false,
          labels: [],
          title: dataTodoRes.title,
          code: null,
          due_date: null,
          completed_at: null,
          description: null,
          is_completed: dataTodoRes.is_completed,
          list: null,
          priority: 0,
          status: "not_started",
          is_private: false,
          phase: null,
          annex: null,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [bodyLog]);

  // ADD NEW TASK

  const addNewTask = async (newToDo) => {
    const token = localStorage.getItem("Token");
    const postNewTask = await fetch(task, {
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToDo),
    });
    if (!postNewTask.ok) {
      toast.error("Failed to to add new todo or the server is not responding", {
        className: "toast-error",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        theme: "colored",
      });
      throw new Error("Failed to add new todo.");
    } else {
      toast.success("New task added successfully ! ", {
        className: "toast-success",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        theme: "colored",
      });
    }

    const addedTodo = await postNewTask.json();

    setToDoList((prevList) => [addedTodo, ...prevList]);
  };

  // DELETE TASK

  const deleteTask = async (pk) => {
    const token = localStorage.getItem("Token");
    const urlDelete = `https://app.ooti.co/api/v1/tasks/${pk}/`;
    const deleteNewTask = await fetch(urlDelete, {
      method: "DELETE",
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    if (!deleteNewTask.ok) {
      toast.error("Failed to delete task or the server is not responding", {
        className: "toast-error",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        theme: "colored",
      });
      throw new Error("Failed to delete task.");
    } else {
      toast.success("Task deleted successfully !", {
        className: "toast-success",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    setToDoList((prevList) => prevList.filter((task) => task.pk !== pk));
  };
  // UPDATE TITLE

  const updateTask = async (pk, newTitle) => {
    const urlPatch = `https://app.ooti.co/api/v1/tasks/${pk}/`;
    const token = localStorage.getItem("Token");
    const updatedPayload = { ...payload, title: newTitle };
    const patchTitle = await fetch(urlPatch, {
      method: "PATCH",
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPayload),
    });
    if (!patchTitle.ok) {
      toast.error(
        "Failed to update task title or the server is not responding",
        {
          className: "toast-error",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          theme: "colored",
        }
      );
      throw new Error(
        "Failed to update task title or the server is not responding"
      );
    } else {
      toast.success("Title Updated !", {
        className: "toast-success",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }

    setToDoList((prevList) =>
      prevList.map((task) => {
        if (task.pk === pk) {
          return { ...task, title: newTitle };
        }
        return task;
      })
    );
  };

  // UPDATE is_completed
  const updateCompleted = async (pk, newCheck) => {
    const urlPatch = `https://app.ooti.co/api/v1/tasks/${pk}/`;
    const token = localStorage.getItem("Token");
    const updatedPayload = { ...payload, is_completed: newCheck };
    const patchCompleted = await fetch(urlPatch, {
      method: "PATCH",
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPayload),
    });
    if (!patchCompleted.ok) {
      throw new Error(
        "Failed to update task title or the server is not responding"
      );
    }
    setToDoList((prevList) =>
      prevList.map((task) => {
        if (task.pk === pk) {
          return { ...task, is_completed: newCheck };
        }
        return task;
      })
    );
  };
  const chartTotal = {
    labels: ["My Tasks"],
    datasets: [
      {
        label: "Total of Tasks",
        data: [toDoList.length],
        backgroundColor: "rgba(47, 35, 67, 0.7 )",
        borderColor: "rgba(19, 14, 27, 1)",
        borderWidth: 2,
        categoryPercentage: 0.7,
        barPercentage: 0.5,
        borderRadius: 10,
      },
      {
        label: "Tasks Done",
        data: [toDoList.filter((item) => item.is_completed === true).length],
        backgroundColor: "rgba(220, 107, 173,0.3)",
        borderColor: "rgba(237, 162, 242)",
        borderWidth: 2,
        borderRadius: 10,
        categoryPercentage: 0.7,
        barPercentage: 0.5,
      },
      {
        label: "Remaning Tasks",
        data: [toDoList.filter((item) => item.is_completed === false).length],
        backgroundColor: "rgba(161, 47, 173, 0.5)",
        borderColor: "rgba(89, 26, 96)",
        borderWidth: 2,
        borderRadius: 10,
        categoryPercentage: 0.7,
        barPercentage: 0.5,
      },
    ],
  };
  return (
    <section id="main">
      <header className="todo-title">
        <h1>Todo List</h1>
        <ToastContainer
          theme="colored"
          transition={Zoom}
          hideProgressBar={true}
        />
        <Formtodo
          dataOrg={toDoData}
          dataProject={toDoList}
          addNewTask={addNewTask}
        />
      </header>
      <div id="toDoComponent-container">
        <div id="chart">
          <Chart chartTotal={chartTotal} />
        </div>
        <ul id="toDoComponent-container__list">
          {toDoList.map((content) => (
            <Todo
              key={content.pk}
              id={content.pk}
              todo={content}
              deleteTask={deleteTask}
              updateTask={updateTask}
              updateCompleted={updateCompleted}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default App;
