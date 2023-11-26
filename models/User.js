const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
      type: String,
      unique: true,
      required: true,
      trim: true
  },
  password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
  },
  journalEntries: [{
      title: {
          type: String,
          required: true
      },
      content: {
          type: String,
          required: true
      },
      date: {
          type: Date,
          default: Date.now
      }
  }],
  garden: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
  }],
  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marketplace'
  }]
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema, 'Users');

