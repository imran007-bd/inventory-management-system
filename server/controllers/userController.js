import User from "../models/user.js";

const getPendingUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { status: "pending" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.status = "approved";
    await user.save();
    return res.status(200).json({ success: true, message: "User approved", user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const rejectUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.status = "rejected";
    await user.save();
    return res.status(200).json({ success: true, message: "User rejected", user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { getPendingUsers, approveUser, rejectUser };
