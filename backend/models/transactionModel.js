import mongoose from 'mongoose'

const TransactionSchema = mongoose.Schema({
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount:{type: Number} ,
        description:{type:String},
        createdAt: { type: Date, default: Date.now }
      });


      const Transaction = mongoose.model("Transaction",TransactionSchema)

      export default Transaction