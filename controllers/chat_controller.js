const chat = require('../db/models/chat');

const createChat = async (req,res)=>{
    const body = req.body;

    const newChat = await chat.create({
        id:body.id,
        name:body.name,
        icon:body.icon,
        isGroup:body.isGroup,
        time:body.time,
        currentMsg:body.currentMsg
    });

    const result = newChat.toJSON();
    

    return res.status(201).json({
        status:'success',
        data:result,
    });
};

module.exports = {createChat}