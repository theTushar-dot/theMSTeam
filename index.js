const express = require('express')
const app = require("express")();
const server = require("http").createServer(app);
const mongoose = require("mongoose");
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

// const MongoClient = require('mongodb').MongoClient;
// const db = 'mongodb+srv://mytushar:Tushar@1290@cluster0.vi6xw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// const client = new MongoClient(db, { useNewUrlParser: true });
const users = {};
var uuser;
// var roomid;
// mongoose
//   .connect(
//     db,
//     { useUnifiedTopology: true,
//       useNewUrlParser: true }
//   )
//   .then(() => console.log("MongoDB successfully connected"))
//   .catch(err => console.log(err));

const socketToRoom = {};

const PORT = process.env.PORT || 5000;

app.use('/users', userRoute)


app.get('/', (req, res) => {
    // res.send(users)
    res.send(users)
})

app.get('/on', (req, res) => {
    // res.send(users)
    res.send(socketToRoom)
})

// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`)
//   })

// app.get('/:room', (req, res) => {
//     // res.render('room', { roomId: req.params.room })
    

// })
// console.log('users',users)


io.on('connection', socket => {
    socket.on("join room", in_load => {
        // console.log(in_load)
        
        if(in_load.mode){
        if (users[in_load.roomID]) {
            const length = users[in_load.roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[in_load.roomID].push({ id:socket.id,
                                        name: in_load.enteredName,
                                        chatMode: in_load.chatMode,
                                        videoMode: in_load.videoMode})
        } else {
            users[in_load.roomID] = [{ id:socket.id,
                                    name: in_load.enteredName,
                                    chatMode: in_load.chatMode,
                                    videoMode: in_load.videoMode}];
        }
        // roomid = in_local.roomID
        socketToRoom[socket.id] = in_load.roomID
        uuser = users[in_load.roomID]
        const usersInThisRoom = users[in_load.roomID].filter(inr => inr.id !== socket.id);
        //uuser = usersInThisRoom
        
        socket.emit("all users chat", usersInThisRoom); 
    }else{
        // console.log('users::::',users)
        // console.log(uuser)
        const usersInThisRoom = users[in_load.roomID].filter(inr => inr.id !== socket.id);
        //uuser = usersInThisRoom
        
        socket.emit("all users", usersInThisRoom);}
    });
    
    socket.on('changetoVMode', payload =>{
        users[payload.roomId].forEach(ur_in =>{
            if(ur_in.id == payload.curr_id){
                // console.log('it is ide:',ur_in.id)
              ur_in.chatMode = payload.C_M
              ur_in.videoMode = payload.V_M
            }
          })

    })

    socket.emit('partis_inroom', {users})
    
    socket.on('message', (message) => {
        //send message to the same room
        io.to(message.id).emit('createMessage chat', {messToSend : message.message, messFrom: message.from})
        // console.log(id)
        // console.log(message.id)
    }); 

    socket.on('imleaving', payload => {
        io.to(payload.idTo).emit('userLeaved', {userToleave: payload.name})

    })

    socket.on("sending signal", payload => {

        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, callName: payload.name, num_parti: payload.parti_n});
    });

    socket.on("sending signal chat", payload => {
        io.to(payload.userToSignal).emit('user joined chat', {callerID: payload.callerID, callName: payload.name, num_parti: payload.parti_n});
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id }); 
    });

    socket.on('discnt', (in_detail) => {
        // console.log(id_out)
        // const roomID = socketToRoom[socket.id];

        let room = users[in_detail.curr_roomId];
        if (room) {
            room = room.filter(inr => inr.id !== in_detail.id_to_kick);
            users[in_detail.curr_roomId] = room;
        }
    });

});

if((process.env.NODE_ENV || '').trim() !== 'production'){
    console.log('it work')
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (res, req) => {
        res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
    })
    // just checking
}


server.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));