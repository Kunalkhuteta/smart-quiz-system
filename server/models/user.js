const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,  
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String, 
    required: true
  },
  isAdmin: {
  type: Boolean,
  default: false,
}, 
  // 🔑 Role-based access
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',   // most new users will be students
    required: true,
  },

  // 🔑 Referral system
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // link to teacher
    default: null,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },

}, { timestamps: true });


// ✅ Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); 
});


// ✅ Generate Referral Code (for teachers only)
userSchema.methods.generateReferralCode = function () {
  if (this.role !== "teacher") {
    throw new Error("Only teachers can have referral codes");
  }
  const prefix = this.name.toLowerCase().replace(/\s/g, "").substring(0, 3);
  const random = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  this.referralCode = `${prefix}-${random}`;
};

module.exports = mongoose.model("User", userSchema);

