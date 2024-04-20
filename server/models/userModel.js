const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is a mandatory field"],
  },
  email: {
    type: String,
    required: [true, "Name is a mandatory field"],
    unique: [true, "Email already used"],
    validator: [validator.isEmail, "Enter a valid Email"],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Password is a mandatory field"],
  },
  confirmPassword: {
    type: String,
    minlength: 8,
    required: [true, "You need to confirm password before Proceeding..."],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords dont match",
    },
  },
  myNotes: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

this.passswordConfirm = undefined;
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
