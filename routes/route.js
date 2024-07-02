const express = require("express");

const router = express.Router()
const { createUser,loginUser, findUserById, updateUser, deleteUser, getUserImage } = require("../controllers/userController");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {authMiddleware} = require("../middleware/auth")


router.post("/insert", upload.single('image'), createUser);

router.post("/login",loginUser);
// get user details
router.get("/details/:id", findUserById);

// get user image
router.get("/image/:id", getUserImage);
// update user
router.put("/update", authMiddleware,upload.single('image'), updateUser);
// delete user
router.delete("/delete/:id", authMiddleware,deleteUser);
module.exports = router;