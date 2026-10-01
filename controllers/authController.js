const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

const EMAIL_RE = /^[A-Za-z0-9]+([._%+-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;
const fail = (res, status, message) => res.status(status).json({ success: false, message });

const signup = async (req, res) => {
  try {
    let { name, email, password, phone } = req.body;
    name  = name?.trim();
    email = email?.trim().toLowerCase();
    phone = phone?.trim();

    if (!name || !email || !password || !phone)
      return fail(res, 400, "Name, email, phone and password are required");
    if (!/^[A-Za-z ]{2,50}$/.test(name))
      return fail(res, 400, "Please enter a valid full name");
    if (!EMAIL_RE.test(email))
      return fail(res, 400, "Please enter a valid email address");
    if (!/^[6-9]\d{9}$/.test(phone))
      return fail(res, 400, "Please enter a valid 10-digit Indian mobile number");
    if (password.length < 8)
      return fail(res, 400, "Password must be at least 8 characters");
    if (!/[A-Z]/.test(password))
      return fail(res, 400, "Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password))
      return fail(res, 400, "Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(password))
      return fail(res, 400, "Password must contain at least one number");

    if (await User.findOne({ email }))
      return fail(res, 409, "An account with this email already exists");

    const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 12) });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });

  } catch (err) {
    console.error("Signup Error:", err);
    if (err.code === 11000) return fail(res, 409, "An account with this email already exists");
    return fail(res, 500, "Failed to create account");
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();

    if (!email || !password)        return fail(res, 400, "Email and password are required");
    if (!EMAIL_RE.test(email))      return fail(res, 400, "Please enter a valid email address");

    const user = await User.findOne({ email });
    if (!user)                                         return fail(res, 401, "Invalid email or password");
    if (!await bcrypt.compare(password, user.password)) return fail(res, 401, "Invalid email or password");

    const secret = process.env.JWT_SECRET;
    if (!secret) return fail(res, 500, "JWT secret is not configured");

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, secret, { expiresIn: "7d" });

    return res.json({
      success: true,
      message: "Login successful",
      data: { token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } }
    });

  } catch (err) {
    console.error("Login Error:", err);
    return fail(res, 500, "Failed to login");
  }
};

module.exports = { signup, login };