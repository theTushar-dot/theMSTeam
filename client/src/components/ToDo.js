import React, { useState, useEffect } from "react";
// import ReactSession from 'react-client-session';
import "./todo.css";
import {mail_id} from './LogIn'
import axios from 'axios'

// const user = require('../../../auth/model_db/db_schema');

const Todo = () => {
  const [task, setTask] = useState("");
  const [tasklist, setTaskList] = useState([]);
  const tasklistDB = []

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
      // user.findOneAndUpdate({'name': window.name}, {password: 'ha'}, (error, data) =>{
      //   if(error){
      //     console.log(error)

      //   }else{
      //     console.log(data)
      //   }
      // } )
      // const thing_toUp = {
      //   name:"Tushar Prakash",
      //   email:"tusharprakash582@gmail.com",
      //   password: "ha"

      // }
      // axios.put('http://localhost:5000/update/60e8686c31d819328c8fe83a', thing_toUp)
      //   .then((res) => {
      //       console.log(res.data)
      //   }).catch((error) => {
      //       console.log(error)
      //   });

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

  // const task_string = JSON.stringify(tasklist[0])
  const final_dbtask = tasklistDB.toString()

  console.log('it str', final_dbtask)
  console.log('just checking', JSON.parse("[" + final_dbtask + "]"))

  useEffect(() => {
    window.sessionStorage.setItem("tasks", final_dbtask);
    console.log('updated')
    
  }, [final_dbtask])




  return (
    <div className="todo">
      {/* <div>{window.name}</div> */}
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