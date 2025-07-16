import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: function() { return this.authMethod === 'local'; }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  collegeId: {
    type: String,
    required: false,
    unique: true,
    trim: true
  },
  declaredGender: {
    type: String,
    enum: ['male', 'female'],
    default: null
  },
  branch: {
    type: String,
    enum: ['PRODUCTION AND INDUSTRIAL ENGINEERING', 'ELECTRICAL ENGINEERING', 'CIVIL ENGINEERING', 'MECHANICAL ENGINEERING', 'COMPUTER SCIENCE AND ENGINEERING', 'ELECTRONICS AND COMPUTATIONAL MECHANICS', 'ELECTRONICS AND COMMUNICATION ENGINEERING', 'METALLURGICAL AND MATERIALS ENGINEERING', 'CHEMISTRY', 'HUMANITIES, SOCIAL SCIENCES AND MANAGEMENT', 'MATHEMATICS', 'PHYSICS'],
    default: null
  },
  // regNumber: { type: String, trim: true, default:null },
  // programme: { type: String, trim: true, default:null },

  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  image: String
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.authMethod !== 'local') return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);