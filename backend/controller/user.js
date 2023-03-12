import User from '../models/user.js'
import generateToken from '../Utils/generateToken'
import generateUniqueId from 'generate-unique-id';




const registerUser =async(req,res)=>{
    const {full_name,email,phone_number,password} = req.body
   
    const paymentId = generateUniqueId({ length: 7, useLetters: true });
  
    const user = new User({
      full_name,
      email,
      phone_number,
      password,
      payment_id: [paymentId],
    });
  
    try {
      await user.save();
      res.json({ success: true, paymentId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save user' });
}}
const loginUser = async(req,res)=>{
    const {email,password} = req.body
    try{
        const user = await User.findOne({email:email})
  console.log(user)
        if(!user){
            throw new Error("User does not exist,please register")
        }
        if(user && (await user.passwordMatched(password))){
            console.log(user._id)
            res.status(200).json({
                status:"success",
                user:{
                    id:user._id,
                    fullName:user.fullName,
                    email:user.email,
                    role:user.role,
                    author:user.fullName,
                    token:await generateToken(user._id)
                }
            })
        }else{
            res.status(402)
            throw new Error("Incorrect password")
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            status:"failed",
            error:err.message,
        })
    }

}


const generatePaymentIdByUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id);
        if (!user) {
          res.status(404).json({ error: 'User not found' });
        } else if (user.payment_id.length >= 5) {
          res.status(400).json({ error: 'User already has 5 payment IDs' });
        } else {
          const paymentId = generateUniqueId({ length: 7, useLetters: true });
          user.payment_id.push(paymentId);
          await user.save();
          res.json({ success: true, paymentId });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add payment ID' });
      }
  };
  
const getAllUsers = async (req, res) => {
    try {
      const user = await User.find({})
      res.status(200).json({
        status: "success",
        user,
      });
    } catch (err) {
      res.json({
        status: "failed",
        error: err.message,
      });
    }
  };
  const getUserByPaymentID =async (req, res) => {
    const {  paymentId } = req.params;
  
    try {
        const user = await User.findOne({ payment_id: paymentId }).select('-password');
        if (!user) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.json(user);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get user' });
      }
  }
  const deletePaymentID =async (req, res) => {
    try {
        const { userId, paymentId } = req.params;
        const user = await User.findById(userId);
    
        if (!user.payment_id.includes(paymentId)) {
          res.status(404).json({ message: 'Payment ID not found' });
          return;
        }
    
        user.payment_id = user.payment_id.filter((id) => id !== paymentId);
        await user.save();
    
        res.status(200).json({
          message:"paymentId deleted successfully"
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    
    const deleteAllUsers = async (req, res) => {
        try {
          const user = await User.deleteMany({})
          res.status(200).json({
            status: "success",
            user,
          });
        } catch (err) {
          res.json({
            status: "failed",
            error: err.message,
          });
        }
      };
    
    

    
    
    
    
    
  
export {
    registerUser,
    getAllUsers,
    generatePaymentIdByUser,
    deletePaymentID,
    getUserByPaymentID,
    deleteAllUsers,
    loginUser
}
