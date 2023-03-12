// const express = require('express');
// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// // Set up express app
// const app = express();
// const port = 3000;

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost/users-account-management', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Define user schema and model
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   password: String,
//   paymentIds: [{ type: String, unique: true }],
//   balance: { type: Number, default: 5000 },
//   transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
// });

// const User = mongoose.model('User', userSchema);

// // Define transaction schema and model
// const transactionSchema = new mongoose.Schema({
//   fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   amount: Number,
//   timestamp: { type: Date, default: Date.now },
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// // Middleware to parse JSON request body
// app.use(express.json());

// // Route to create a new user
// app.post('/users', async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   // Generate a new payment ID for the user
//   const paymentId = uuidv4().substr(0, 7);

//   // Create the user in the database
//   const user = new User({ name, email, phone, password, paymentIds: [paymentId] });
//   await user.save();

//   res.json({ user });
// });

// // Route to generate a new payment ID for a user
// app.post('/users/:userId/paymentIds', async (req, res) => {
//   const { userId } = req.params;

//   // Find the user
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   // Generate a new payment ID for the user if they don't already have the maximum number of payment IDs
//   if (user.paymentIds.length >= 5) {
//     return res.status(400).json({ error: 'Maximum number of payment IDs reached' });
//   }

//   const paymentId = uuidv4().substr(0, 7);

//   // Add the new payment ID to the user's account
//   user.paymentIds.push(paymentId);
//   await user.save();

//   res.json({ user });
// });



// // Route to delete a payment ID for a user
// app.delete('/users/:userId/paymentIds/:paymentId', async (req, res) => {
//   const { userId, paymentId } = req.params;

//   // Find the user
//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }
//   if

// })

// const Transaction = mongoose.model('Transaction', {
//     from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     amount: Number,
//     createdAt: { type: Date, default: Date.now }
//   });
  
//   app.post('/send-funds', async (req, res) => {
//     const { toUserId, amount } = req.body;
//     const fromUserId = req.user.userId;
//     const fromUser = await User.findById(fromUserId);
//     const toUser = await User.findById(toUserId);
//     if (!toUser) {
//       res.status(400).json({ error: 'Invalid user ID.' });
//       return;
//     }
//     if (fromUser.balance < amount)
// })
const Transaction = require('./models/Transaction');
const User = require('./models/User');

// Send funds to another user
app.post('/user/payment/:paymentId', async (req, res) => {
  const { paymentId } = req.params;
  const { amount } = req.body;
  const senderId = req.user._id; // assuming user is authenticated and req.user contains the sender's ID

  try {
    // Get sender and recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findOne({ paymentIds: paymentId });

    // Check if sender has sufficient balance
    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update balances
    sender.balance -= amount;
    recipient.balance += amount;

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
});

// Retrieve transaction history for a user
app.get('/user/transactions', async (req, res) => {
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
});
