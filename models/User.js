import mongoose from 'mongoose';

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
});

// Export User Model
const User = mongoose.model('User', userSchema);

export default User;
