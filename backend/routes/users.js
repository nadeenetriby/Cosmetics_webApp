const express = require("express");
const router = express.Router();

const User = require("../models/User");
const {
  register,
  login,
  getuserInfo,
  updateUserInfo
} = require("../Controllers/userController");

const auth = require("../middleware/PromoteAuthen");

const {
  updateUserProfilePicture,
  deleteProfilePicture,
} = require("../Controllers/imagesController");

router.post("/register", register);
router.post("/login", login);

router.put("/promoteEmail", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(401).json({ msg: "unauthorized" });

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    //if user is already an admin
    if (user.isAdmin)
      return res.status(400).json({ msg: "This user is already an admin." });

    user.isAdmin = true;
    await user.save();

    res.json({ msg: `User with email ${email} has been promoted to admin.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error lol" });
  }
});

router.get("/userInfo", auth, getuserInfo);

router.put("/update", auth, updateUserInfo);

router.put("/profile/", updateUserProfilePicture);

router.delete("/profile/:userId/delete", deleteProfilePicture);

module.exports = router;
