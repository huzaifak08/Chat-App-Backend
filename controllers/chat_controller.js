const Chat = require('../db/models/chat');

const createChat = async (req,res)=>{
    const body = req.body;

    const newChat = await Chat.create({
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

const getChat = async(req,res)=>{
    try{

        const chats = await Chat.findAll(req.body);

        if(!chats){
            res.json({
                status:'fail',
                message:'Some Error without exception'
            });
        }

        res.status(200).send(chats);

    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}

module.exports = {createChat,getChat}