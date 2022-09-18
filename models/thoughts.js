const { Schema, model, Types } = require("mongoose");

const reactionSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
  },
  {
    id: false,
    timestamps: true
  }
);
// Schema to create a thought model
const thoughtSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
   reactions: [reactionSchema]
  },
  
  {
    toJSON: {
      virtuals: true
    },
    id: false,
    timestamps: true
  },
);

const reactCount = thoughtSchema.virtual("reactCount").get(function(){
  return this.reactions.length;
})

const Thought = model("thought", thoughtSchema);
const React = model("react", reactionSchema)

module.exports =  Thought, React;
