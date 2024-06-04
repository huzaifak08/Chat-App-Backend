const user = require("../db/models/user");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

const generateToken = (payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const signup = async (req,res,next)=>{
    const body = req.body;

    if(!['1','2'].includes(body.userType)){
        return res.status(400).json({
            status:"fail",
            message:'Invalid user type',
        })
    }

    const hashedPass = await bcryptjs.hash(body.password, 8);

    const newUser = await user.create({
        userType : body.userType,
        firstName:body.firstName,
        lastName:body.lastName,
        email:body.email,
        password:hashedPass,
        confirmPassword:hashedPass,
    })

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id:result.id,
    })

    if(!result){
        return res.status(400).json({
            status:'fail',
            message:'Failed to create user'
        });
    }

    return res.status(201).json({
        status:'success',
        data:result,
    });
};

const login = async (req,res,next)=>{

    const {email,password} = req.body;

    if(!email || !password){
        return  res.status(400).json({
            status:'fail',
            message:'Please enter Email and Password'
        });
    }

    const result =await user.findOne({where: {email }});

    if(!result){
        return res.status(400).json({
            status:'fail',
            message:'Incorrect email or password',
        });
    }

    const isPasswordMatched = await bcryptjs.compare(password,result.password);

    if(!isPasswordMatched){
        return res.status(400).json({
            status:'fail',
            message:'Incorrect Password',
        });
    }

    const token =await generateToken({
        id:result.id,
    });

    return res.status(200).json({
        status:'success',
        token:token
    });

}

module.exports ={signup,login}