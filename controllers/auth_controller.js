const User = require("../db/models/user");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");

const generateToken = (payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const signup = async (req,res)=>{
    const {name,email,password,confirmPassword} = req.body;

    // if(!['1','2'].includes(body.userType)){
    //     return res.status(400).json({
    //         status:"fail",
    //         message:'Invalid user type',
    //     })
    // }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(401).json({ 
        status:"fail",
        message: "User Already Exists"
    });
    }

    if( !name || !email || !password || !confirmPassword){
        return  res.status(400).json({
            status:'fail',
            message:'All fields are compulsory'
        });
    }

    const emailRegex = /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid email format",
    });
  }

    const hashedPass = await bcryptjs.hash(password, 8);

    const newUser = await User.create({
        name:name,
        email:email,
        password:hashedPass,
        confirmPassword:confirmPassword,
    });

    if (password.length < 6) {
        return res.status(400).json({
          status: "fail",
          message: "Password must be at least 6 characters long",
        });
      }

    if (password !== confirmPassword) {
        return res.status(401).json({
          status: "fail",
          message: "Password and Confirm do not match",
        });
      }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id:result.id,
    })

    if(!result){
        return res.status(401).json({
            status: "fail",
            message: "Failed to create user" });
    }

    return res.status(201).json({
        status:'success',
        message:'Welcome to ChitChat',
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

    const emailRegex = /^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email format",
      });
    }

    const result =await User.findOne({where: {email }});

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
        message:'Welcome to Chit Chat',
        token:token
    });

}

module.exports ={signup,login}