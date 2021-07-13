import React, {useEffect, useRef, useState} from "react";
import Peer from "simple-peer";
import RoomFront from "../components/RoomFront";
import styled from "styled-components";
import'./styles.css'


// some styling for videos of the users
const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 75vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 50%;
    width: 50%;
`;

// use to show the peers video in the UI
const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <div>
        {/* <Typography variant="h5" gutterBottom>{props.peer.name}</Typography>  */}
        <video playsInline autoPlay ref={ref} />
        </div>
    );
}


const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const [strm, setStrm] = useState()
    const [name, setName] = useState('')
    const [allUser, setAllUser] = useState()
    const socketRef = props.socketRef
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.roomId
    var participants = 0;
    
    
    // when room.js mounts the it runs

    useEffect(() => {
        const enteredName = props.naam
        setName(enteredName)

        console.log('Its name', enteredName)
        
        // getting the users video stream 
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {

            userVideo.current.srcObject = stream

            setStrm(stream)
            socketRef.current.emit("join room", { mode: false ,roomID, enteredName}); // letting other know that new user joined
            socketRef.current.on("all users", users => {
        
                setAllUser(users)
                const t_parti =  users.length
    
                const peers = [];
                users.forEach(inr_user => {
    
                    if (inr_user.videoMode){
                    const peer = createPeer(inr_user.id, socketRef.current.id, stream, enteredName, t_parti);// new user makes the peers connects with all othe users in the room
                    const peerName = inr_user.name
                    peersRef.current.push({
                        peerID: inr_user.id,
                        name: peerName, 
                        peer,
                    })
                    peers.push({peer: peer, name: peerName});
                    setPeers(users => [...users, {peerID: inr_user.id, peer: peer, name: peerName, videoM: true, partis: t_parti}])  
                }})
            })

            socketRef.current.on("user joined", payload => {  // now the peers who are already in the room gonna response
                
                const peer = addPeer(payload.signal, payload.callerID, stream);  // existing users make peer connection with new user
                const userName = payload.callName
                const particpate = payload.num_parti
        
                peersRef.current.push({
                    peerID: payload.callerID,
                    name: userName, 
                    peer,
                })

                setPeers(users => [...users, {peerID: payload.callerID,peer: peer, name: userName, videoM: true, partis: particpate}]); 
            });

            socketRef.current.on("receiving returned signal", payload => {;
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);  // finally peer connection made by new user

            });
            
            socketRef.current.on('createMessage', mess => {  
                console.log(mess)
                document.getElementById("messShow").append(`User:${mess}`)

            })

            socketRef.current.on('userLeaved', in_load => {
        
                setPeers(peersRef.current)
                setPeers(peers.filter(users => users.name != in_load.userToleave))
        
                peersRef.current.forEach(user => {
                    if(user.name == in_load.userToleave){
                        user.peer.destroy()
                    }
                })
                const new_lis = peersRef.current.filter(users => users.name !== in_load.userToleave)
    
                peersRef.current = new_lis
            })


        })

        console.log('pre_chats', props.pre_chats)

        props.pre_chats.forEach(chat => {
            if(chat.rec_name === 'Me'){ document.getElementById("messShow").innerHTML += `<h4>Me</h4>&nbsp${chat.sender_mess}`
            }else{
                document.getElementById("messShow").innerHTML += `<div class="message-received">
                <div class="sender-details">
                    <span class="sender-name">${chat.rec_name}</span>
                </div>
                <div class="actual-message">
                    ${chat.rec_mess}</div>
            </div>`
                

            }
          
        })

        return () => {
            setPeers([]); // clearing the data after user unmounts
            userVideo.current = null
            peersRef.current = []


          };
   
 
    }, []);

    function createPeer(userToSignal, callerID, stream, name, parti_n) {  // new user initiate the peer connect
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });  

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { chatroom: false, userToSignal, callerID, signal, name, parti_n })  
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) { // existing peer adding the new user
        console.log('3')
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { chatroom: false,signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    const messSent = (mess) =>{
        allUser.forEach(user => {
            var idTo = user.id

            socketRef.current.emit('message', { message: mess,id :idTo, from: name})

        })

    }

    const sendmess = () => {
        const message_input = document.getElementById("chat_message").value
        document.getElementById("messShow").innerHTML += `<h4>Me</h4>&nbsp${message_input}`
        messSent(message_input)

    }

    // changing the video audio and stream
    // like mute and play video or stop video

    const playStop = () => {
        console.log('yeah.it pressed')
        console.log(strm.getVideoTracks()[0].enabled)
        let enabled = strm.getVideoTracks()[0].enabled;
        if (enabled) {
            strm.getVideoTracks()[0].enabled = false;
            setPlayVideo()
        } else {
            setStopVideo()
            strm.getVideoTracks()[0].enabled = true;
        }
      }

    const setStopVideo = () => {
        const html = `
          <i class="fas fa-video"></i>
          <span>Stop Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
    }
      
    const setPlayVideo = () => {
        const html = `
        <i class="stop fas fa-video-slash"></i>
          <span>Play Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
    }

    const muteUnmute = () => {
        const enabled = strm.getAudioTracks()[0].enabled;
        if (enabled) {
            strm.getAudioTracks()[0].enabled = false;
            setUnmuteButton();
        } else {
            setMuteButton();
            strm.getAudioTracks()[0].enabled = true;
        }
    }

    const setMuteButton = () => {
        const html = `
          <i class="fas fa-microphone"></i>
          <span>Mute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
    }
      
    const setUnmuteButton = () => {
        const html = `
          <i class="unmute fas fa-microphone-slash"></i>
          <span>Unmute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
    }


    if(peers.slice(-1)[0] == undefined){
        participants = 1
        
    }else{
        participants =  peers.slice(-1)[0].partis + 1

    }

    const receivereturn = (payload) => {
        console.log('peeeeer:', peers)
        const item = peers.find(p => p.peerID === payload.id);
        item.peer.signal(payload.signal);


    }

    // when user left for chat mode

    const changeMode = () => {

        strm.getTracks().forEach((track) => {
            track.stop();
        })
        peers.forEach(p =>{
            var idTo = p.peerID
            console.log(idTo)

        socketRef.current.emit('imleaving', { name, idTo})}
        )

        console.log('bye')
        props.changeToChat()

        
    }


    return (
        <RoomFront roomid = {roomID} video_en ={true} changemode = {changeMode} peersRef = {peersRef} num = {participants} name={name} Container={Container} Video={Video} StyledVideo={StyledVideo}
        userVideo={userVideo} peers={peers} muteUnmute={muteUnmute} playStop={playStop} 
        leaveMeet={props.leaveroom} sendmess={sendmess} />
        )


};

export default Room