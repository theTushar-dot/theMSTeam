import React,{useState} from 'react'
import SendIcon from '@material-ui/icons/Send';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import './chatroomcss.css'


// UI for ChatRoom.js 

const ChatNew = ({roomId, leaveroom , partis, sendmess, v_on, inChat}) => {
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
            roomId
          );
    }


    return(
        <div>
            <div class="navbar">
                <img src="https://www.freepnglogos.com/uploads/microsoft-windows-logo-png-images-30.png"></img>
            </div>
            <div class='main_container'>
                <div class="column_left">
                    <div class="menu-top-section">
                        <span>Participants: You and {partis-1} others<br></br></span>
                        <PersonAddIcon onClick={invite} />
                        

                        <div class="chat-body">
                                <ul  id='partis'>    
                                </ul>
                        </div>
                    </div>


                </div>
                <div class="column_right">
                    <div class="user-detail-section">
                        {inChat?(
                        <div class="main_icons">   
                            <div class='video_icon'>
                            <VideoCallIcon class="material-icons" title="Video call" onClick={v_on} />
                            </div>
                            <div class="exit_icon">
                                <ExitToAppIcon onClick = {leaveroom}/>
                            </div>
                        </div>):
                        (<div class='exit_icon1'>
                        <ExitToAppIcon onClick = {leaveroom}/>
                        </div>)}
                    </div>
                    <div class="user-chat-section">
                        <div class="message-container">
                            <ul id = 'messShow'>


                            </ul>
                        </div>
                    </div>

                    <div class="message-compose-section">
                        <input type="text" value= {mess} onChange={messhandler}  name="sendMessage" id="sendMessage" placeholder="Type a new message"
                        autocomplete="off" />
                        <div class = 'send_button'>
                        <SendIcon id='sendbtn' color="white" onClick={inter_send} />
                        </div>

                    </div>
                </div>

            </div>














        </div>



    )


}

export default ChatNew