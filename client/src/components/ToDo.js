import React, { useState, useEffect } from "react";
import "./todo.css";

// ToDo list feature 

const Todo = () => {
  const [task, setTask] = useState("");
  const [tasklist, setTaskList] = useState([]);
  const tasklistDB = []

  // smart logic(jugaad**) for storing the tasks of the users
  useEffect(() => {
    
    const task_str = window.sessionStorage.getItem("tasks")
    if(task_str !== null){
    const task_obj = JSON.parse("[" + task_str + "]")

    task_obj.forEach(task => {
      setTaskList([...tasklist, task])    
    })
  }
}, [])

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const AddTask = () => {
    if (task !== "") {
      const taskDetails = {
        id: Math.floor(Math.random() * 1000),
        value: task,
        isCompleted: false,
      };


      setTaskList([...tasklist, taskDetails]);
      setTask("")

    }
  };

  const deletetask = (e, id) => {
    e.preventDefault();
    setTaskList(tasklist.filter((t) => t.id != id));
  };

  const taskCompleted = (e, id) => {
    e.preventDefault();
    //let's find index of element
    const element = tasklist.findIndex((elem) => elem.id == id);

    //copy array into new variable
    const newTaskList = [...tasklist];

    //edit our element
    newTaskList[element] = {
      ...newTaskList[element],
      isCompleted: true,
    };

    setTaskList(newTaskList);
  };

  tasklist.forEach(task => {
    const task_string = JSON.stringify(task)
    tasklistDB.push(task_string)

  })

  console.log('tasklist is', tasklist)
  const final_dbtask = tasklistDB.toString()

  useEffect(() => {
    window.sessionStorage.setItem("tasks", final_dbtask);
    console.log('updated')
    
  }, [final_dbtask])




  return (
    <div className="todo">
      <input
        type="text"
        name="text"
        id="text"
        value= {task}
        onChange={(e) => handleChange(e)}
        placeholder="Add task here..."
      />
      <button className="add-btn" onClick={AddTask}>
        Add
      </button>
      <br />
      {tasklist !== [] ? (
        <ul>
          {tasklist.map((t) => (
            <li className={t.isCompleted ? "crossText" : "listitem"}>
              {t.value}
              <button
                className="completed"
                onClick={(e) => taskCompleted(e, t.id)}
              >
                Completed
              </button>

              <button className="delete" onClick={(e) => deletetask(e, t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default Todo;