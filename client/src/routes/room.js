import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
// import {Redirect, BrowserRouter, Link} from 'react-router-dom';
import RoomFront from "../components/RoomFront";
import { Grid, Typography, Paper } from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import styled from "styled-components";
import'./styles.css'

// const RoomContext = createContext();

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


// const videoConstraints = {
//     height: window.innerHeight / 2,
//     width: window.innerWidth / 2
// };

const Room = (props) => {

    
    // console.log('it peers from room:', props.peers)
    // console.log('it peerRef from room:', props.peersRef)
    // console.log('it socketref from room:', props.socketRef)

    const [peers, setPeers] = useState([]);
    const [strm, setStrm] = useState()
    const [name, setName] = useState('')
    const [num, setNum] = useState(0)
    const [allUser, setAllUser] = useState()
    // const [video_en, setVideo_en] = useState(false)
    // var users_in = []
    // const socketRef = useRef();
    const socketRef = props.socketRef
    const userVideo = useRef();
    const peersRef = useRef([]);
    const numRef = useRef()
    // const roomID = props.match.params.roomID;
    const roomID = props.roomId
    var participants = 0;
    // var parti_num = 0
    

    useEffect(() => {
        // const enteredName = prompt('Please enter your name')
        const enteredName = props.naam
        // // setNum(pre => pre = 1)
        setName(enteredName)
        // const enteredName = props.naam
        console.log('Its name', enteredName)
        // socketRef.current = io('http://localhost:5000')
        // if(!video_en){
        //     var a = false
        
        // }
        console.log('just checking peers 1', peers)
        
        // id_t = socketRef.current.id
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            // if(video_en){
            userVideo.current.srcObject = stream
            // ;}
            // else{
                // userVideo.current.srcObject = 'hello'

            // }

            setStrm(stream)
            socketRef.current.emit("join room", { mode: false ,roomID, enteredName});
            // setNum(pre_num => pre_num+1)
            socketRef.current.on("all users", users => {
                console.log('just checking peersREf 1', peersRef)
                // console.log('all user from room:', users)
                setAllUser(users)
                const t_parti =  users.length
                // numRef.current =users.length 
                // setNum(users.length)
                const peers = [];
                users.forEach(inr_user => {
                    // console.log()

                    console.log('-1')
                    if (inr_user.videoMode){
                        console.log('1')
                    const peer = createPeer(inr_user.id, socketRef.current.id, stream, enteredName, t_parti);
                    const peerName = inr_user.name
                    peersRef.current.push({
                        peerID: inr_user.id,
                        name: peerName, 
                        peer,
                    })
                    peers.push({peer: peer, name: peerName});
                    setPeers(users => [...users, {peerID: inr_user.id, peer: peer, name: peerName, videoM: true, partis: t_parti}])
                }})
                // setPeers(peers);
                // setPeers(users => [...users, {peer: peer, name: peerName}])
            })
            console.log('just checking peers 2', peers)
            console.log('just checking peersREf 2', peersRef)

            socketRef.current.on("user joined", payload => {
                console.log('just checking peersREf 3', peersRef)
                
                console.log('2')
                const peer = addPeer(payload.signal, payload.callerID, stream);
                const userName = payload.callName
                const particpate = payload.num_parti
                // const parti_num = payload.user_c.length
                // setNum(parti_num)
                peersRef.current.push({
                    peerID: payload.callerID,
                    name: userName, 
                    peer,
                })

                setPeers(users => [...users, {peerID: payload.callerID,peer: peer, name: userName, videoM: true, partis: particpate}]);
            });
            console.log('just checking peers', peers)

            socketRef.current.on("receiving returned signal", payload => {
                console.log('just checking peersREf 4', peersRef)
                // receivereturn(payload)
                
                // console.log('4')
                // console.log('peerrefff:', peersRef)
                // console.log('peeeeer:', peers)
                // const item = peersRef.current.find(p => p.peerID === payload.id);
                const item = peersRef.current.find(p => p.peerID === payload.id);
                // console.log('it is item:',item)
                item.peer.signal(payload.signal);

            });
            
            socketRef.current.on('createMessage', mess => {
                console.log(mess)
                document.getElementById("messShow").append(`User:${mess}`)

            })
            console.log('just checking peersREf 5', peersRef)
            console.log('just checking peers 3', peers)

            socketRef.current.on('userLeaved', in_load => {
                console.log('ref in leave',peersRef.current )
                
                console.log('pers', peers)
                setPeers(peersRef.current)
                console.log('pers 1', peers)

                console.log('user leaved,', in_load.userToleave)

                setPeers(peers.filter(users => users.name != in_load.userToleave))
                console.log('ref in leave', peersRef)
                peersRef.current.forEach(user => {
                    if(user.name == in_load.userToleave){
                        user.peer.destroy()
                    }
                })
                const new_lis = peersRef.current.filter(users => users.name !== in_load.userToleave)
                console.log('list if new,', new_lis)

                peersRef.current = new_lis
                console.log('last ref', peersRef.current)
            })
            console.log('just checking peers 4', peers)
            // console.log('num_in', num)

        })
        console.log('just checking peers 5', peers)
        console.log('just checking peersREf 6', peersRef)

        return () => {
            setPeers([]); // This worked for me
            // peersRef.current.destroy()
            userVideo.current = null
            peersRef.current = []


          };

       
       
 
    }, []);

    function createPeer(userToSignal, callerID, stream, name, parti_n) {
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

    function addPeer(incomingSignal, callerID, stream) {
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
    const just = (peersRef, mess) =>{
        // peersRef.current.forEach(p =>{
        //     var idTo = p.peerID
        //     // console.log(idTo)
        // console.log('mess room')
        // socketRef.current.emit('message', { message: mess,id :idTo})}
        // )
        allUser.forEach(user => {
            var idTo = user.id

            socketRef.current.emit('message', { message: mess,id :idTo, from: name})

        })

    }
    const juston = (mess) =>{
        just(peersRef, mess)
        

    }

    const sendmess = () => {
        const just_input = document.getElementById("chat_message").value
        document.getElementById("messShow").innerHTML += `<h4>Me</h4>&nbsp${just_input}`
        juston(just_input)

    }

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

    const leaveMeet = () => {

        peers.forEach(p =>{
            p.peer.destroy()
            console.log('It Finished!!!')})
        socketRef.current.emit('discnt', {id_to_kick: socketRef.current.id, curr_roomId: roomID})    
        props.history.push('/exits/')  
    }
    // console.log('This is peerRef', peersRef.current)
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

    const changeMode = () => {
        // peersRef.current.forEach(p =>{
        //     p.peer.destroy()
        //     // p.videoM = false
        //     console.log('It Finished!!!')})
        // peersRef.current.destroy()
        // userVideo.current.destroy()
        strm.getTracks().forEach((track) => {
            track.stop();
        })

        // socketRef.current.emit('discnt', {id_to_kick: socketRef.current.id, curr_roomId: roomID}) 
        // console.log('peers in levae', peers)
        // console.log('refpeers in leave', peersRef)
        peers.forEach(p =>{
            var idTo = p.peerID
            // p.peer.destroy()
            console.log(idTo)

        socketRef.current.emit('imleaving', { name, idTo})}
        )
        console.log('peers in levae after', peers)
        console.log('refpeers in leave after', peersRef)

        console.log('bye')
        // socketRef.current.emit("join room", { mode: false ,roomID, enteredName}) 
        props.changeToChat()

        
    }
    // console.log('peers_outs', peers.slice(-1)[0].partis)
    // console.log('namee', name)
    // console.log('my', roomID)
    // console.log('num_out', parti_num)
    // console.log('num_ot', num)
    // console.log('num', num)
    // console.log('num_in', num)
    // console.log('peerref', peersRef)
    // console.log('my ref', socketRef.current)
    console.log('it peers from room:', peers)
    console.log('it peerRef from room:', peersRef)
    console.log('it socketref from room:', socketRef)
    console.log('fucking!!!!', allUser)
    // changemode = {changeMode}


    return (
        <RoomFront video_en ={true} changemode = {changeMode} peersRef = {peersRef} num = {participants} name={name} Container={Container} Video={Video} StyledVideo={StyledVideo}
        userVideo={userVideo} peers={peers} muteUnmute={muteUnmute} playStop={playStop} 
        leaveMeet={leaveMeet} sendmess={sendmess} />
        )


};

export default Room