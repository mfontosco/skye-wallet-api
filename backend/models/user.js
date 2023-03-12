import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = mongoose.Schema({
    full_name:{type:String,required:[true,"name is required"]},
    email:{type:String,required:[true,"email is required"]},
    phone_number:{type:String,required:[true,"phone number is required"]},
    payment_id: [{ type: String, unique: true }],
    balance: { type: Number, default: 5000 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    password:{type:String,required:[true,"password is required"]}
},
{timestamps:true}
)
// function arrayLimit(val) {
//     return val.length <= 10;
//   }

UserSchema.methods.passwordMatched = async function(passwordToBeVerified){
    console.log(passwordToBeVerified)
    return await bcrypt.compare(passwordToBeVerified,this.password)
}


UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }

    const salt =  await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(this.password,salt)
    console.log("hashed",hashed)
     this.password = hashed
})



const User = mongoose.model("User",UserSchema)

export default User;