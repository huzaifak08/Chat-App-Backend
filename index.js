require('dotenv').config({path:`${process.cwd()}/.env`});
const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth_route');
var http = require('http');
const app = express();

var server = http.createServer(app);
var io = require("socket.io")(server,{
    cors:{
        origin:'*',
    }
})

app.use(express.json());
app.use(cors());

io.on('connection',(socket)=>{
    console.log('Connected to Socket.IO');
    console.log(socket.id,'has Joined');
    socket.on('/test',(msg)=>{
        console.log(msg);
    });
});

app.get('/',(req,res)=>{
    res.status(200).json({
        status:'success',
        message:'Rest API Working',

    })
})

// All Routes here:
app.use('/api/v1/auth',authRoute);

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