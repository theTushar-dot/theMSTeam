import React,{useState} from 'react'
import ReactDOM from 'react-dom'
import './chatroomcss.css'
import VideoCallIcon from '@material-ui/icons/VideoCall';
import SendIcon from '@material-ui/icons/Send';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const ChatNew = ({leaveroom ,parti_s, partis, sendmess, v_on, inChat}) => {
    const time = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();
    const [mess, setMess] = useState('')

    const messhandler = (e) => {
        setMess(e.target.value)
    }
    const inter_send = () => {
        sendmess()
        setMess('')
    }
    // document.getElementById("sendMessage")
    // .addEventListener("keyup", function(event) {
    // event.preventDefault();
    // if (event.keyCode === 13) {
    //     document.getElementById("sendbtn").click();
    // }
    //  });

    // document.getElementById("sendMessage")
    // .addEventListener("keyup", function(event) {
    // event.preventDefault();
    // if (event.keyCode === 13) {
    //     document.getElementById("sendbtn").click();
    // }
    //  });

    // const parti_inRoom = (name) => { 
    //     ReactDOM.render(
    //     document.getElementById("partis").innerHTML += `<div class="user-chat">
    //         <div class="usr-card">
    //             <div class="username">
    //                 <span class="name">${name}       ${time}</span>
    //             </div>
    //         </div>
    //     </div>`
    //     )
    // }
    // if(!inChat){
    //     console.log('names')
    //     // socketRef.current.on('partis_inroom', users => {
    //     //     console.log('it usessr', users)
    //     // })
    //     parti_s.forEach(p => {
    //         parti_inRoom(p)
            

    //     })}

    return(
        <div>
            <div class="navbar">
                <img src="https://www.freepnglogos.com/uploads/microsoft-windows-logo-png-images-30.png"></img>
                {/* <div>
                <p>{time}</p>
                <p>{date}</p>
                </div> */}
            </div>
            <div class='main_container'>
                <div class="column_left">
                    <div class="menu-top-section">
                        <span>Participants You and {partis-1} others</span>
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
                        {/* <VideoCallIcon class="material-icons" title="Video call" onClick={v_on} /> */}
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