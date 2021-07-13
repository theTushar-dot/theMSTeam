// importing libraries
const express = require('express') 
const app = require("express")();
const server = require("http").createServer(app); // creating the server
const mongoose = require("mongoose");     // MongoDB for login and signup
const bodyParser = require("body-parser");
const cors = require("cors");   

const userRoute = require('./auth/routes/db_routes')

const { v4: uuidV4 } = require('uuid')

app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );

app.use(bodyParser.json());

const io = require("socket.io")(server, {
    cors:{
        origin: '*',
        methods: ["GET", 'POST']
    }
})

app.use(cors())

const MongoClient = require('mongodb').MongoClient;
// const db = 'mongodb+srv://mytushar:Tushar@1290@cluster0.vi6xw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const db = process.env.MONGODB_URI || 'mongodb+srv://mytushar:Tushar@1290@cluster0.vi6xw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(db, { useNewUrlParser: true });
const users = {};
var uuser;
mongoose                        //connecting to database in mongoDB Atlas
  .connect(
    db,
    { useUnifiedTopology: true,
      useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const socketToRoom = {};

const PORT = 5000;

app.use('/users', userRoute)

app.get('/', (req, res) => {    // just for testing purpose
    res.send(users)
})



// Main person(like Virat for team india)
// using socket to communicate b/w frontend and backend basically using event handlers
io.on('connection', socket => {
    socket.on("join room", in_load => {    // when someone new joins the room  
        if(in_load.mode){               // just checking if the user join for video or chat mode
        if (users[in_load.roomID]) {

            users[in_load.roomID].push({ id:socket.id,               // just storing(for a single session only) the new user info
                                        name: in_load.enteredName,
                                        chatMode: in_load.chatMode,
                                        videoMode: in_load.videoMode})
        } else {
            users[in_load.roomID] = [{ id:socket.id,
                                    name: in_load.enteredName,
                                    chatMode: in_load.chatMode,
                                    videoMode: in_load.videoMode}];
        }

        socketToRoom[socket.id] = in_load.roomID
        uuser = users[in_load.roomID]
        const usersInThisRoom = users[in_load.roomID].filter(inr => inr.id !== socket.id);

        socket.emit("all users chat", usersInThisRoom);  // emitting it back to front end for new user to let him/her know who else are in the room
    }else{                                                                         
        const usersInThisRoom = users[in_load.roomID].filter(inr => inr.id !== socket.id);
        socket.emit("all users", usersInThisRoom);}
    });
    
    socket.on('changetoVMode', payload =>{          // just updating some booleans when user change it mode like video to chat 
        users[payload.roomId].forEach(ur_in =>{
            if(ur_in.id == payload.curr_id){
              ur_in.chatMode = payload.C_M
              ur_in.videoMode = payload.V_M
            }
          })

    })

    socket.emit('partis_inroom', {users})  
    
    socket.on('message', (message) => {     // getting it from front end when someone send the chat to the room 
        io.to(message.id).emit('createMessage chat', {messToSend : message.message, messFrom: message.from}) // for the receving parties
    }); 

    socket.on('imleaving', payload => {     // when user leaves the he/she emit this and then backend let to know other in room that he/she have leaved the meeting
        io.to(payload.idTo).emit('userLeaved', {userToleave: payload.name})   // sending to users who are in the room

    })

    // !!!this is the main socket connection here new user send this to other user,!!!
    // who are already in the room and let them know that some has joined

    socket.on("sending signal", payload => {  
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, callName: payload.name, num_parti: payload.parti_n});
    });

    // same thing as above but for chat mode only

    socket.on("sending signal chat", payload => {
        io.to(payload.userToSignal).emit('user joined chat', {callerID: payload.callerID, callName: payload.name, num_parti: payload.parti_n});
    });

    // this is the signal return by the users who are already in the room to the now user

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });  // to new user
    });

    // when someone disconnted from all rooms( video/ chat)
    socket.on('discnt', (in_detail) => {
        let room = users[in_detail.curr_roomId];
        if (room) {
            room = room.filter(inr => inr.id !== in_detail.id_to_kick);
            users[in_detail.curr_roomId] = room;
        }
    });

});


// for deployment on heroku but did not succeed, but i WILL!!


// app.use(express.static('client/build'))
// const path = require('path')
// app.get('*', (res, req) => {
//     res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
// })


// if((process.env.NODE_ENV || '').trim() !== 'production'){
//     console.log('it work')
//     app.use(express.static('client/build'))
//     const path = require('path')
//     app.get('*', (res, req) => {
//         res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
//     })
//     // just checking
// }


// just running server on the specified port 
server.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));