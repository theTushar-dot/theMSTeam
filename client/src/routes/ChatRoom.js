import React, {useEffect, useRef, useState} from "react";
import Room from './room'
import ChatNew from "../components/ChatNew";
import io from "socket.io-client";


const ChatRoom = (props) => {
    const [peers, setPeers] = useState([]);
    const [video_en, setVideo_en] = useState(false)
    const [partiName, setPartiName] = useState([])
    const socketRef = useRef();
    const peersRef = useRef([]);
    const [inChat, setInChat] = useState(true)
    const [chatM, setChatM] = useState(true)
    const [videoM, setVideoM] = useState(false)
    const [mount, setMount] = useState(0)
    var flag = false
    const roomID = props.match.params.roomID;
    var participants = 0;
    const [names, setNames] = useState('')
    const time = new Date().toLocaleTimeString();
    // var video_en = false

    useEffect(() => {
        console.log('C1')
        const enteredName = prompt('Please enter your name')

        // const enteredName = window.name
        // setNum(pre => pre = 1)
        setNames(enteredName)
        console.log('Its name', enteredName)
        socketRef.current = io('http://localhost:5000')

        socketRef.current.emit("join room", {mode: true, chatMode: chatM, videoMode: videoM ,roomID, enteredName});
        socketRef.current.on("all users chat", users => {
            console.log('all user from chat:', users)
            console.log('C2')
            const t_parti =  users.length
            // numRef.current =users.length 
            // setNum(users.length)
            const peers = [];
            users.forEach(inr_user => {
                if(inChat){
                parti_inRoom(inr_user.name)
                setPartiName(user => [...user, inr_user.name])}
                console.log('C3')                
                socketRef.current.emit("sending signal chat", { chatroom: true, userToSignal: inr_user.id, callerID: socketRef.current.id,name: enteredName, parti_n: t_parti})
                const peerName = inr_user.name
                peersRef.current.push({
                    peerID: inr_user.id,
                    name: peerName, 
                })
                peers.push({name: peerName});
                setPeers(users => [...users, { name: peerName, partis: t_parti}])
            })

        })

        socketRef.current.on("user joined chat", payload => {
            if(inChat){
            parti_inRoom(payload.callName)
            setPartiName(user => [...user, payload.callName])}
            console.log('C4')
            // const peer = addPeer(payload.signal, payload.callerID, stream);
            // socketRef.current.emit("returning signal", { chatroom: true, callerID: payload.callerID })
            const userName = payload.callName
            const particpate = payload.num_parti
            // const parti_num = payload.user_c.length
            // setNum(parti_num)
            peersRef.current.push({
                peerID: payload.callerID,
                name: userName, 
            })

            setPeers(users => [...users, {name: userName, partis: particpate}]);

        });

        // socketRef.current.on("receiving returned signal", payload => {
        //     // const item = peersRef.current.find(p => p.peerID === payload.id);
        //     // item.peer.signal(payload.signal);
        // });
        socketRef.current.on('createMessage chat', mess => {
            // console.log(mess)
            // document.getElementById("messShow").append(`User:${mess}`)
            document.getElementById("messShow").innerHTML += `<div class="message-received">
            <div class="sender-details">
                <span class="sender-name">${mess.messFrom}</span>
                <span class="timestamp">${time}</span>
            </div>
            <div class="actual-message">
                ${mess.messToSend}</div>
        </div>`


        })

    }, [])

    const just = (peersRef, mess) =>{
        peersRef.current.forEach(p =>{
            var idTo = p.peerID
            // console.log(idTo)

        socketRef.current.emit('message', { message: mess, id :idTo, from: names})}
        )

    }
    const juston = (mess) =>{
        just(peersRef, mess)
        

    }


    const parti_inRoom = (name) => {
        if(document.getElementById("partis") !== null ){
        document.getElementById("partis").innerHTML += `<div class="user-chat">
            <div class="usr-card">
                <div class="username">
                    <span class="name">${name}       ${time}</span>
                </div>
            </div>
        </div>`

    }}

    


    const sendmess = () => {
        const just_input = document.getElementById("sendMessage").value
        // document.getElementById("messShow").append(`Me:${just_input}`)
        document.getElementById("messShow").innerHTML += `<div class="message-sent">
        <div class="timestamp">${time}
        <div class="actual-message">
            ${just_input}</div>
    </div>`


        juston(just_input)

    }
    if(peers.slice(-1)[0] == undefined){
        participants = 1
        
    }else{
        participants =  peers.slice(-1)[0].partis + 1

    }

    const openVRoom = () => {
        // props.history.push(`/video/${roomID}`)
        // props.history.push(`/video/${roomID}`);
        setVideo_en(true)
        setChatM(false)
        setVideoM(true)
        setInChat(false)
        // setInChat(false)

        socketRef.current.emit('changetoVMode', {curr_id: socketRef.current.id, C_M: false, V_M: true, roomId: roomID})


    }

    const openCRoom = () => {
        // props.history.push(`/video/${roomID}`)
        // props.history.push(`/video/${roomID}`);
        setVideo_en(false)
        setChatM(true)
        setVideoM(false)
        setInChat(false)

        socketRef.current.emit('changetoVMode', {curr_id: socketRef.current.id, C_M: true, V_M:false, roomId: roomID})


    }

    // const interval = setInterval(() => {
    //     setMount(pre => pre +1)
    //   }, 1000);

    // if(mount == 5000){
    //     flag = true
      
    // }
    // useEffect(()=> {
    //     if(!inChat){
    //             console.log('names')
    //             socketRef.current.on('partis_inroom', users => {
    //                 console.log('it usessr', users)
    //             })
        
    //             partiName.forEach(p => {
    //                 parti_inRoom(p)
                    
        
    //             })}

    // }, [flag])
    // if(!inChat){
    //     console.log('names')
    //     socketRef.current.on('partis_inroom', users => {
    //         console.log('it usessr', users)
    //     })

    //     partiName.forEach(p => {
    //         parti_inRoom(p)
            

    //     })}

    // useEffect(() => {

  





    // })
    // var intervalId = setInterval(this.timer, 1000);/

    console.log('it peers from chat:', peers)
    console.log('it peerRef from chat:', peersRef)
    console.log('it partis:', partiName)
    
    return (
        // <div>
        
        <div>
        { !video_en ? (
        <ChatNew partis = {participants} sendmess = {sendmess} v_on= {openVRoom}  inChat = {inChat} parti_s = {partiName}/>
        ): (
            <Room socketRef = {socketRef} peersRef = {peersRef} peers = {peers} naam = {names} roomId = {roomID} changeToChat = {openCRoom}/>
        )}
        </div>

    )

}

export default ChatRoom