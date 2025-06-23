// models/UserXP.js
import mongoose from 'mongoose'

const userXPSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

module.exports = mongoose.model('UserXP', userXPSchema);

export default UserXP;
