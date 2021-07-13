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
    const [m_clk, setM_clk] = useState(0)
    const chatlist_str = []
    var flag = false
    const [chatlist, setChatlist] = useState([])
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
            
            setChatlist(chats => [...chats, {rec_name: mess.messFrom, rec_mess: mess.messToSend}])
            
            // chatlist.push({rec_name: mess.messFrom, rec_mess: mess.messToSend})
            // console.log('chatlist', chatlist)


        })

    }, [])

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
                <div class="timestamp">${time}
                <div class="actual-message">
                    ${chat.sender_mess}</div>
            </div>`
            }else{
                document.getElementById("messShow").innerHTML += `<div class="message-received">
                <div class="sender-details">
                    <span class="sender-name">${chat.rec_name}</span>
                    <span class="timestamp">${time}</span>
                </div>
                <div class="actual-message">
                    ${chat.rec_mess}</div>
            </div>`
                

            }
          
        })
    }
        
    }, [m_clk])

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

    
    const sendmess = () => {
        const just_input = document.getElementById("sendMessage").value
        // document.getElementById("messShow").append(`Me:${just_input}`)
        document.getElementById("messShow").innerHTML += `<div class="message-sent">
        <div class="timestamp">${time}
        <div class="actual-message">
            ${just_input}</div>
    </div>`
        juston(just_input)

        setChatlist(chats => [...chats, {rec_name: 'Me', sender_mess: just_input}])

        // chatlist.push({sender:just_input})
        // console.log('chatlist', chatlist)

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
        setM_clk(pre => pre+1)

        socketRef.current.emit('changetoVMode', {curr_id: socketRef.current.id, C_M: true, V_M:false, roomId: roomID})


    }

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

    const leaveRoom = () => {

        peers.forEach(p =>{
            p.peer.destroy()
            console.log('It Finished!!!')})
        socketRef.current.emit('discnt', {id_to_kick: socketRef.current.id, curr_roomId: roomID})    
        props.history.push('/')  
    }

    // console.log('chatstr', chatlist_str)

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

    console.log('list', chatlist)
    console.log('partisname', partiName)


    
    return (
        // <div>
        
        <div>
        { !video_en ? (
        <ChatNew partis = {participants} sendmess = {sendmess} v_on= {openVRoom}  inChat = {inChat} parti_s = {partiName} leaveroom = {leaveRoom}/>
        ): (
            <Room socketRef = {socketRef} peersRef = {peersRef} peers = {peers} naam = {names} roomId = {roomID} changeToChat = {openCRoom} pre_chats= {chatlist} leaveroom = {leaveRoom}/>
        )}
        </div>

    )

}

export default ChatRoom