// import { set } from 'mongoose';
import React, {useState} from 'react'
import { v1 as uuid } from "uuid";
import Todo from '../components/ToDo'
// import ReactSession from 'react-client-session';
import {Button, TextField} from '@material-ui/core'
import './CreateRoom.css'

// ReactSession.setStoreType("sessionStorage");

const CreateRoom = (props) => {
    // const user_Name = props.match.params.name
    // window.name = user_Name

    const [room_id, setRoom_id] = useState('')

    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    const onChangeinput = (e) => {
        setRoom_id(e.target.value)
    }

    const join_room = () => {
        props.history.push(`/room/${room_id}`)
        setRoom_id('')

    }

    return (
        <div class= "main_container">
            <div class='column'>
            {/* <h1>{`hey, ${user_Name}`}</h1> */}
            <div>
                <TextField type="text" value={room_id} onChange={onChangeinput}  className="form-control" placeholder="Enter Room Id" />
        
                <Button variant="contained" color="secondary" onClick={join_room}> Join room</Button>
            </div>
            <div>
                <Button variant="contained" color="secondary" onClick={create}>Create room </Button>
            </div>
            </div>
            <div class='column' >
                <Todo/>
            </div>
        </div>
    )
}

export default CreateRoom
