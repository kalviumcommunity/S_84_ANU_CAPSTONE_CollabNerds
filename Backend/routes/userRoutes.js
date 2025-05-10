// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {protect} = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('name email');
  res.json(users);
});

router.get("/all" , async(req , res)=>{
  const data = await User.find();
  res.json(data);
})

router.delete("/:id" , async(req , res)=>{
  const id = req.params.id;
  try {
    const data = await User.findByIdAndDelete(id);
    res.json( { Message : "Deleted successfully !" , data : data});
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
}
) ;

module.exports = router;
