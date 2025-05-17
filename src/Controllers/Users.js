import UserModel from "../Models/Users.js";
import Auth from "../Config/Auth.js";

const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).send({ message: `User ${email} already exists` });
    }

    // Create the new user if not found
    const hashedPassword = await Auth.hashPassword(password);
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });

    res
      .status(201)
      .send({ message: "Account created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user) {
      let hashCompare = await Auth.hashCompare(password, user.password);
      if (hashCompare) {
        let token = await Auth.createToken({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
        res.status(200).send({ message: "Login successfull", token });
      } else {
        res.status(400).send({ message: "Invalid Password" });
      }
    } else
      res.status(400).send({ message: `user ${req.body.email} Not Exists` });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { email: req.body.email },
      { password: 0 }
    );
    if (user) {
      const token = await Auth.createToken({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id,
      });
      const resetUrl = `https://localhost:8000/reset-password/${token}`;
      const emailContent = {
        to: user.email,
        subject: "Reset Password Request",
        text: `Dear ${user.firstName},\n\nWe received a request to reset your password. Click the link below to reset your password:\n\n${resetUrl}`,
        html: `<p>Dear ${user.firstName},</p><p>We received a request to reset your password. Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      };
      await emailService.sendMail(emailContent);

      res.status(200).send({
        message: "The password reset link has been sent to your email.",
      });
    } else {
      res.status(400).send({
        message: "User not found. Please enter a registered email address.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    let data = await Auth.decodeToken(token);
    if (req.body.newpassword === req.body.confirmpassword) {
      let user = await UserModel.findOne({ email: data.email });
      user.password = await Auth.hashPassword(req.body.newpassword);
      await user.save();

      res.status(200).send({
        message: "Password Updated Successfully",
      });
    } else {
      res.status(400).send({
        message: "Password Does Not match",
      });
    }
  } catch (error) {
    res.status(401).send({
      message: "Invalid or expired token",
    });
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default {
  createUser,
  login,
  resetPassword,
  forgotPassword
};
