require('dotenv').config({path:`${process.cwd()}/.env`});
const express = require('express');
const authRoute = require('./routes/auth_route');

const app = express();

app.use(express.json());

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

app.listen(PORT,()=>{
    console.log("Server running successfully",PORT);
})