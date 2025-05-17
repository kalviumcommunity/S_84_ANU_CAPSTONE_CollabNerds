const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  profileImage: { type: String, default: '' },
  bio: String,
  skills: String,
  socialLinks: [String],
  dob: Date,
  location: String,
  role: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
