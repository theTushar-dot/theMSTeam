import React,  { useEffect, useRef, useState } from 'react'
import { Grid, Typography, Paper } from '@material-ui/core'
import Input from '@material-ui/core/Input'
import SendIcon from '@material-ui/icons/Send';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import styled from "styled-components";
import'../routes/styles.css'

const RoomFront = ({video_en, changemode, peersRef, num ,name ,Container, StyledVideo, userVideo, Video,  peers, muteUnmute, playStop, leaveMeet, sendmess}) => {

    const [mess, setMess] = useState('')

    const messhandler = (e) => {
        setMess(e.target.value)
    }
    const inter_send = () => {
        sendmess()
        setMess('')
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
                                <i class="fas fa-microphone"></i>
                                <span>Mute</span>
                            </button>
                            <button onClick={playStop} class="main__controls__button main__video_button" >
                                {/* <i class="fas fa-video"></i> */}
                                <span>Stop Video</span>
                            </button>
                        </div>
                        <div class="main__controls__block">
                            <div class="main__controls__button">
                               <button onClick={changemode}>
                                <span>chatMode</span>
                                </button>
                            </div>
                            <div class="main__controls__button">
                                <i class="fas fa-user-friends"></i>
                                <span>Participants</span>
                            </div>
                            <div class="main__controls__button">
                                <i class="fas fa-comment-alt"></i>
                                <span>Chat</span>
                            </div>
                        </div>
                        <div class="main__controls__block">
                            <button onClick={leaveMeet} class="main__controls__button">
                                <span class="leave_meeting">Leave Meeting</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="main__right">
                    <div class="main_counter">
                        <h2>Total Participants {num} </h2>
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
