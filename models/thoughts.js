const { Schema, model, Types } = require("mongoose");
const moment = require('moment')
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
    ISO: {
        type: Date,
        default: Date.now()
    },
  },
  {
    id: false,
    timestamps: false,
    strict: false
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
    ISO: {
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
    strict: false,
    timestamps: false
  },
);

const reactCount = thoughtSchema.virtual("reactCount").get(function(){
  return this.reactions.length;
})
const Created = thoughtSchema.virtual("Created").get(function() {
  let time = this.ISO
  return moment(time).format('DD/MM/YYYY')

})
const Reacted = thoughtSchema.virtual("Reacted").get(function() {
  let time = this.ISO
  return moment(time).format('DD/MM/YYYY')

})
const Thought = model("thought", thoughtSchema);
const React = model("react", reactionSchema)

module.exports =  Thought, React;
