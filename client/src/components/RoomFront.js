import React,  {useState } from 'react'
import { Button } from '@material-ui/core'
import Input from '@material-ui/core/Input'
import SendIcon from '@material-ui/icons/Send';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';

import { PhoneDisabled} from '@material-ui/icons'
import'../routes/styles.css'

// UI for room.js(Video mode) file in routes

const RoomFront = ({roomid, changemode,  num ,userVideo, Video,  peers, muteUnmute, playStop, leaveMeet, sendmess}) => {

    const [mess, setMess] = useState('')

    const messhandler = (e) => {
        setMess(e.target.value)
    }
    const inter_send = () => {
        sendmess()
        setMess('')
    }

    const invite = () => {
        prompt(
            "Copy this room ID and send it to people you want to meet with",
            roomid
            
          );

    }
    


    return (
        <div>
            <div class="main">
                <div class="main__left">
                    <div class="main__videos">
                        <div>
                            {/* <Grid item xs = {12} md ={6}> */}
                                {/* <Typography variant="h5"  gutterBottom>{name}</Typography> */}
                                <video muted ref={userVideo} autoPlay playsInline />
                                {peers.map((peer, index) => {
                                    console.log('roomfron from', peer)
                                return (
                                    <>
                                    
                                    {peer.videoM? (<Video key={index} peer={peer} />
                                    ): (<h1>hey</h1>)}
                                    {/* <Video key={index} peer={peer} /> */}
                                    </>
                                    );

                                })}
                            {/* </Grid> */}
                        </div>
                    </div>
                    <div class="main__controls">
                        <div class="main__controls__block">
                            <button onClick={muteUnmute} class="main__controls__button main__mute_button">
                                {/* <Icon className="fas fa-microphone"/> */}
                                <span>Mute</span>
                            </button>
                            <button onClick={playStop} class="main__controls__button main__video_button" >
                                {/* <i class="fas fa-video"></i> */}
                                <span>Stop Video</span>
                            </button>
                        </div>
                        <div class="main__controls__block">
                            <div class="main__controls__button">
                               <QuestionAnswerIcon onClick={changemode} class="main__controls__button_chat" style={{ color: 'white'}}>
                                <span>ChatRoom</span>
                                </QuestionAnswerIcon>
                            </div>
                            <div class="main__controls__button">
                                <PersonAddIcon onClick={invite} class="main__controls__button main__video_button">
                                <span>Invite</span>
                                </PersonAddIcon>
                            </div>
                            {/* <div class="main__controls__button">
                                <ListAltIcon onClick={openToDo} >
                                <span>ToDo</span>
                                </ListAltIcon>
                            </div> */}
                        </div>
                        <div class="main__controls__block">
                        <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large"/>} fullWidth onClick={leaveMeet}>
                                    Hang Up
                                </Button>
                            {/* <button onClick={leaveMeet} color="red" >
                            <span class="leave_meeting">Leave Meeting</span>
                            </button> */}
                        
                        </div>
                    </div>
                </div>
                <div class="main__right">
                    <div class="main_counter">
                        <h2>Total Participants: {num} </h2>
                    </div>
                    <div class="main__header">
                        <h2>Message</h2>
                    </div>
                    <div class="main__chat_window">
                        <ul class="messages" id='messShow'>
                
                        </ul>
                        {/* <button onClick={juston}>Hello</button> */}

                    </div>
                    <div class="main__message_container">
                        <Input value={mess} onChange={messhandler}  id="chat_message" fullWidth background-color='white' type="text" placeholder="Type message here..."/>
                        <SendIcon id='sendbtn' color="white" onClick={inter_send} />
                    </div>
                </div>  
            </div>
        </div>
    )
}

export default RoomFront
