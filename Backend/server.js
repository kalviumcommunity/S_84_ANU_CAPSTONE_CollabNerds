const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require("mongoose")
const auth = require("./routes/auth")
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection !
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB connected !"))
.catch((err)=>console.log("Error occurred during Connection !"))


// Routes
app.use("/" , auth)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
