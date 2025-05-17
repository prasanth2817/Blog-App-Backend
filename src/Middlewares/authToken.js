import Auth from "../Config/Auth.js";
import UserModel from "../Models/Users.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "No token found" });
    }

    const payload = await Auth.decodeToken(token);

    if (!payload?.id) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const user = await UserModel.findById(payload.id);
    if (!user) {
      return res.status(401).send({ message: "User does not exist" });
    }

    req.user = payload;

    next();
  } catch (error) {
    console.error("isLoggedIn Middleware Error:", error);
    res.status(401).send({ message: "Authentication failed" });
  }
};

export default isLoggedIn;
