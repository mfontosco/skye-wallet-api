import dotenv from 'dotenv'
dotenv.config()
import JWT from 'jsonwebtoken'


const generateToken= async(id)=>{
    return await JWT.sign({id},process.env.JWTSECRET,{expiresIn:"12hrs"})
}

export default generateToken;