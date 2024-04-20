const Notes = require("../models/notesModel");
const User = require("../models/userModel");
exports.createNotes = async (req, res, next) => {
  try {
    const id = req.user._id;
    console.log(id);
    const newNote = await Notes.create({
      title: req.body.title,
      content: req.body.content,
      access: id,
    });
    const user = await User.findById(id);
    const arr = user.myNotes;
    arr.push(newNote._id);
    user.myNotes = arr;
    await user.updateOne({ myNotes: arr });
    res.status(201).json({
      status: "success",
      data: {
        notes: newNote,
      },
    });
  } catch (e) {
    console.log(e);
  }
  next();
};
exports.getOneNotes = async (req, res, next) => {
  try {
    const id = req.params.id;
    const specificNote = await Notes.findById(id);
    res.status(201).json({
      status: "success",
      data: {
        Note: specificNote,
      },
    });
  } catch (e) {
    console.log(e);
  }
  next();
};
exports.getAllNotes = async (req, res, next) => {
  try {
    const arrNotes = req.user.myNotes.map((x) => {
      x = x.valueOf();
      return Notes.findById(x).then((v) => {
        let { _id, title, content } = v;
        return { _id, title, content };
      });
    });
    let allNotes = await Promise.all(arrNotes).then((v) => v);
    res.status(201).json({
      status: "success",
      data: {
        Notes: allNotes,
      },
    });
  } catch (e) {
    console.log(e);
  }
  next();
};
exports.updateNotes = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateNote = await Notes.findByIdAndUpdate(
      { _id: id },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        Note: updateNote,
      },
    });
  } catch (e) {
    console.log(e);
  }
  next();
};
exports.shareNote = async (req, res, next) => {
  const id = req.params.id;
  try {
    //get id from email id (user jisko share karna hai)
    const shareEmail = req.body.email;
    const user = await User.findOne({ email: shareEmail });
    //update note(iss user ki id)
    const note = await Notes.findById(id);
    const arr = note.access;
    arr.push(user._id);
    const outNote = await Notes.findByIdAndUpdate(
      { _id: id },
      { access: arr },
      { new: true }
    );
    //user mein iss note ki id
    const sharedNotes = user.myNotes;
    sharedNotes.push(id);
    const outUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { myNotes: sharedNotes },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        Note: outNote,
      },
    });
  } catch (e) {
    console.log(e);
  }
  next();
};
exports.deleteNotes = async (req, res, next) => {
  const id = req.params.id;
  try {
    // Getting users
    const note = await Notes.findById(id);
    const users = note.access;

    // updating user(yaha se user mein se note delete kar rahe hai)
    for (let i = 0; i < users.length; i++) {
      const user = await User.findById(users[i]);
      const array = user.myNotes.filter((item) => item.valueOf() !== id); // ye humari note ki id hatake array deta hai
      console.log(array);
      const newUser = await User.findByIdAndUpdate(
        { _id: user._id },
        { myNotes: array },
        { new: true }
      );
      console.log(newUser);
    }

    //delete note
    const deleteNote = await Notes.findByIdAndDelete(id);

    res.status(201).json({
      status: "success",
      data: {
        Note: deleteNote,
      },
    });
  } catch (e) {
    console.log(e);
  }
  next();
};
