import React, {useEffect, useRef, useState} from "react";
import Room from './room'
import ChatNew from "../components/ChatNew";
import io from "socket.io-client";

// this is the chat room here users can chat and then also do the video call

const ChatRoom = (props) => {
    // defining some no not some, many state components
    const [peers, setPeers] = useState([]);             
    const [video_en, setVideo_en] = useState(false)
    const [partiName, setPartiName] = useState([])
    const socketRef = useRef();
    const peersRef = useRef([]);
    const [inChat, setInChat] = useState(true)
    const [chatM, setChatM] = useState(true)
    const [videoM, setVideoM] = useState(false)
    const [m_clk, setM_clk] = useState(0)
    const chatlist_str = []
    var flag = false
    const [chatlist, setChatlist] = useState([])
    const roomID = props.match.params.roomID;
    var participants = 0;
    const [names, setNames] = useState('')
    const time = new Date().toLocaleTimeString();

    // useEffect to use the following code when app mounted

    useEffect(() => {
        console.log('C1')
        const enteredName = window.name // getting user name 
        setNames(enteredName)
        console.log('Its name', enteredName)
        socketRef.current = io('http://localhost:5000')  //connecting to the backend

        socketRef.current.emit("join room", {mode: true, chatMode: chatM, videoMode: videoM ,roomID, enteredName});
        socketRef.current.on("all users chat", users => {
            const t_parti =  users.length
            const peers = [];
            users.forEach(inr_user => {    //making peer connections to already present peer(users) in the room
                if(inChat){             // using some smart logic(jugaad**) 
                parti_inRoom(inr_user.name)
                setPartiName(user => [...user, inr_user.name])}            
                socketRef.current.emit("sending signal chat", { chatroom: true, userToSignal: inr_user.id, callerID: socketRef.current.id,name: enteredName, parti_n: t_parti})
                const peerName = inr_user.name
                peersRef.current.push({
                    peerID: inr_user.id,
                    name: peerName, 
                })
                peers.push({name: peerName});
                setPeers(users => [...users, { name: peerName, partis: t_parti}])  // storing the users info for chatting and all
            })

        })

        socketRef.current.on("user joined chat", payload => {  // when someone new joins and sends u peer connection
            if(inChat){
            parti_inRoom(payload.callName)
            setPartiName(user => [...user, payload.callName])}
            const userName = payload.callName
            const particpate = payload.num_parti
            peersRef.current.push({
                peerID: payload.callerID,
                name: userName, 
            })

            setPeers(users => [...users, {name: userName, partis: particpate}]);

        });

        socketRef.current.on('createMessage chat', mess => {  // whensome sends message the how u response
            document.getElementById("messShow").innerHTML += `<div class="message-received"> 
            <div class="sender-details">
                <span class="sender-name">${mess.messFrom}</span>
            </div>
            <div class="actual-message">
                ${mess.messToSend}</div>
        </div>`

            // using this for session storage to store chat of users for a single session
            setChatlist(chats => [...chats, {rec_name: mess.messFrom, rec_mess: mess.messToSend}]) 
        
        })

    }, [])

    const parti_inRoom = (name) => {    // just updating the participants in the ui
        if(document.getElementById("partis") !== null ){
        document.getElementById("partis").innerHTML += `<div class="user-chat">
            <div class="usr-card">
                <div class="username">
                    <span class="name">${name}       ${time}</span>
                </div>
            </div>
        </div>`

    }}

    // again some smart logic(jugaad**) to store the chats correctly

    useEffect(() => {

        partiName.forEach( name =>{
            parti_inRoom(name)
        })


        const chat_str = window.sessionStorage.getItem("chatroom")
        console.log('it works', chat_str)
        if(chat_str !== null){
        const chat_obj = JSON.parse("[" + chat_str + "]")

        chat_obj.forEach(chat => {
            if(chat.rec_name === 'Me'){
                document.getElementById("messShow").innerHTML += `<div class="message-sent">

                <div class="actual-message">
                    ${chat.sender_mess}</div>
            </div>`
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
    }
        
    }, [m_clk])


    const mess_sent = (peersRef, mess) =>{  // send the message to every peer
        peersRef.current.forEach(p =>{
            var idTo = p.peerID

        socketRef.current.emit('message', { message: mess, id :idTo, from: names})}
        )

    }
    
    const sendmess = () => {   // geting mess to send to all users from text input 
        const messagetosend = document.getElementById("sendMessage").value
        // document.getElementById("messShow").append(`Me:${just_input}`)
        document.getElementById("messShow").innerHTML += `<div class="message-sent">
        <h4>You</h4>
       
        <div class="actual-message">
            ${messagetosend}</div>
    </div>`
        mess_sent(peersRef, messagetosend )

        setChatlist(chats => [...chats, {rec_name: 'Me', sender_mess: just_input}])

    }
    if(peers.slice(-1)[0] == undefined){
        participants = 1
        
    }else{
        participants =  peers.slice(-1)[0].partis + 1

    }


    // when user opens the video mode the some updates to let others know the user is going to the video chat
    const openVRoom = () => {
        setVideo_en(true)
        setChatM(false)
        setVideoM(true)
        setInChat(false)

        socketRef.current.emit('changetoVMode', {curr_id: socketRef.current.id, C_M: false, V_M: true, roomId: roomID})


    }

    // when user opens the chat mode again the the some updates to let others know the user is going to the video chat

    const openCRoom = () => {

        setVideo_en(false)
        setChatM(true)
        setVideoM(false)
        setInChat(false)
        setM_clk(pre => pre+1)

        socketRef.current.emit('changetoVMode', {curr_id: socketRef.current.id, C_M: true, V_M:false, roomId: roomID})


    }

    //use this to set message on the front end when user come from the video mode 

    useEffect(()=>{
        chatlist.forEach(chat => {
            const chat_string = JSON.stringify(chat)
            chatlist_str.push(chat_string)

          })

        const final_chats = chatlist_str.toString()

        window.sessionStorage.setItem("chatroom", final_chats);
        console.log('updated')
        console.log('chatstr', chatlist_str)
        console.log('just checking', JSON.parse("[" + final_chats + "]"))

    }, [chatlist])

    // when user leaves the chat mode and then direct them to the home

    const leaveRoom = () => {   
        props.history.push(`/createroom/${window.name}`)  
    }

    
    return (
         // ChatNew is the html type code for chat room things and,
         // Room is when user switch to video mode 
        <div>
        { !video_en ? (
        <ChatNew roomId = {roomID} partis = {participants} sendmess = {sendmess} v_on= {openVRoom}  inChat = {inChat} parti_s = {partiName} leaveroom = {leaveRoom}/>
        ): (
            <Room socketRef = {socketRef} peersRef = {peersRef} peers = {peers} naam = {names} roomId = {roomID} changeToChat = {openCRoom} pre_chats= {chatlist} leaveroom = {leaveRoom}/>
        )}
        </div>

    )

}

export default ChatRoom