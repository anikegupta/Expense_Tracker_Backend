import User from "../models/users.js";

// ✅ Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username email avatar");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error: error.message });
  }
};

// ✅ Update only provided fields
export const updateProfile = async (req, res) => {
  try {
    const { username, email, avatar } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (avatar) updateData.avatar = avatar;

    // Find and update only provided fields
    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("username email avatar");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

export const deleteAvatar = async (req, res) => {
   try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

     // Clear avatar
    user.avatar = "";
    await user.save();

    res.status(200).json({
      message: "Avatar deleted successfully",
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    res.status(500).json({ message: "Error deleting avatar", error: error.message });
  }
};