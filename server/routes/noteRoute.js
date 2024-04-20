const express = require("express");
const notesController = require("../controller/notesController");
const authController = require("../controller/authController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, notesController.getAllNotes)
  .post(authController.protect, notesController.createNotes);

router
  .route("/:id")
  .get(authController.protect, notesController.getOneNotes)
  .patch(authController.protect, notesController.updateNotes)
  .post(authController.protect, notesController.shareNote)
  .delete(authController.protect, notesController.deleteNotes);

module.exports = router;
