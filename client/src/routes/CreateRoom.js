import React, {useState} from 'react'
import { v1 as uuid } from "uuid";
import Todo from '../components/ToDo'
import {Button, TextField} from '@material-ui/core'
import './CreateRoom.css'
import himg from '../components/image/createroomimg.jpg'

// home for this app where you get the todo list also 

const CreateRoom = (props) => {
    const user_Name = props.match.params.name // getting the logged in user name 
    window.name = user_Name  // set it globally

    const [room_id, setRoom_id] = useState('')

    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    const onChangeinput = (e) => {
        setRoom_id(e.target.value)
    }

    const join_room = () => {     // when user wants to create a new chat room 
        props.history.push(`/room/${room_id}`)
        setRoom_id('')

    }

    const sign_out = () => {
        props.history.push('/')

    }
    return (
        <div class= "main_container">
            <div class='column_left1'>
                <div class= 'hey_name'>
            <h1>{`hey,${user_Name}`}</h1>
            <Button variant="contained" onClick={sign_out}>logout</Button>
            </div>
            <div class='name_img'>
            <img src={himg}/>
            </div>
            <div class='inside_left'>
                <TextField type="text" value={room_id} onChange={onChangeinput}  className="form-control" placeholder="Enter Room Id" />
        
                <Button variant="contained" color="primary" onClick={join_room}> Join room</Button>
            </div>
            <div class='inside_right'>
                <div class='or_s'>
                <h1>Or</h1>
                </div>
                <div class='create_in'>
                <Button variant="contained" color="secondary" onClick={create}>Create room </Button>
                </div>
            </div>
            </div>
            <div class='column_right1' >
                <Todo/>
            </div>
        </div>
    )
}

export default CreateRoom
