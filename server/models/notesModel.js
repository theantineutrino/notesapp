const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  access: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

const Notes = mongoose.model("notes", notesSchema);
module.exports = Notes;
