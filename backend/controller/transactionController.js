import Transaction from '../models/transactionModel.js'
import User from '../models/user.js';

const sendMoney = async (req, res) => {
    const { paymentId } = req.params;
    const { amount } = req.body;
    const senderId = req.user._id; 
    // assuming user is authenticated and req.user contains the sender's ID
  
    try {
      // Get sender and recipient
      const sender = await User.findById(senderId);
      console.log("sender",sender)
      const recipient = await User.findOne({ payment_id: paymentId });
  console.log("recipient",recipient)
      // Check if sender has sufficient balance
      if (sender.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
  console.log(sender.balance)
      // Update balances
      parseInt(sender.balance  -= amount);
      recipient.balance += amount;
      console.log("recipient",recipient.balance)
      // Save transactions
      const senderTransaction = new Transaction({
        sender: senderId,
        recipient: recipient._id,
        amount: -amount,
        description: `Payment to ${recipient.name}`,
      });
      const recipientTransaction = new Transaction({
        sender: senderId,
        recipient: recipient._id,
        amount,
        description: `Payment from ${sender.name}`,
      });
      await Promise.all([
        senderTransaction.save(),
        recipientTransaction.save(),
        sender.save(),
        recipient.save(),
      ]);
  
      res.json({ message: 'Payment successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send payment' });
    }
  };
  
  // Retrieve transaction history for a user
 const getTransactionHistory = async (req, res) => {
    const userId = req.user._id; // assuming user is authenticated and req.user contains the user's ID
  
    try {
      const transactions = await Transaction.find({ $or: [{ sender: userId }, { recipient: userId }] })
        .populate('sender', 'name')
        .populate('recipient', 'name')
        .select('sender recipient amount description createdAt');
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  };
  
  export {sendMoney,getTransactionHistory}