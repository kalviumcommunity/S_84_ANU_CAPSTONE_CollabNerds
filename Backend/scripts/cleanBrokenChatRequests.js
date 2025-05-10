const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ChatRequest = require('../models/ChatRequest');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URL || 'your-mongo-uri-here';

async function cleanBrokenRequests() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    const requests = await ChatRequest.find({});
    let brokenCount = 0;

    for (const req of requests) {
      const fromUser = await User.findById(req.from);
      const toUser = await User.findById(req.to);

      if (!fromUser || !toUser) {
        await ChatRequest.findByIdAndDelete(req._id);
        console.log(`🗑️ Deleted broken ChatRequest: ${req._id}`);
        brokenCount++;
      }
    }

    console.log(`✅ Cleanup complete. Deleted ${brokenCount} broken requests.`);
    process.exit();
  } catch (err) {
    console.error('❌ Error during cleanup:', err);
    process.exit(1);
  }
}

cleanBrokenRequests();
