const { Schema, model } = require("mongoose");
const Thought = require("./thoughts");

// Schema to create a user model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
      required: [true, "Email required"],
    },
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: Thought,
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
    }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// const friendCount = userSchema.virtual("friendCount").get(function(){
//   return userSchema.friends.length;
// })

const User = model("user", userSchema);


module.exports = User;
