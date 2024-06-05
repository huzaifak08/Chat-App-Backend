require('dotenv').config({path:`${process.cwd()}/.env`});
const express = require('express');
const cors = require('cors');
var http = require('http');
const app = express();


const authRoute = require('./routes/auth_route');
const chatRoute = require('./routes/chat_route');

var server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.json());
app.use(cors());

var clients = {};

io.on('connection',(socket)=>{
    console.log(`Client Connected: ${socket.id}`);
    socket.on('signin',(id)=>{
        console.log(id);
        clients[id] = socket;
        console.log(clients);
    });
    socket.on('message',(msg)=>{
        console.log(msg);
        let targetId = msg.targetId;
        if(clients[targetId]) clients[targetId].emit('message',msg);
    })
});

app.get('/',(req,res)=>{
    res.status(200).json({
        status:'success',
        message:'Rest API Working',

    })
})

// All Routes here:
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/chat',chatRoute);

app.use('*',(req,res,next)=>{
    res.status(400).send({
        status:"fail",
        message:"Route not found"
    });
})

const PORT = process.env.APP_PORT || 3000;

server.listen(PORT,"0.0.0.0",()=>{
    console.log('Socket Server Started',PORT);
});

// app.listen(PORT,()=>{
//     console.log("Server running successfully",PORT);
// })