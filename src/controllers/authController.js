const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const DealershipModel = require("../models/dealershipModel");
const { jwtSecret } = require("../config/config");
const { errorHandlers } = require("../utils/errorHandlers");
const connectDB = require("../config/db");

const router = express.Router();

const registerUser = async (req, res) => {
  try {
    const database = await connectDB();
    const userModel = new UserModel(database);
    const { name, email, password } = req.body;

    let user = await userModel.getUserByEmail(email);
    if (user) {
      return res.status(400).json({ msg: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: name,
      email: email,
      password: hashedPassword,
    };

    const userId = await userModel.createUser(userData);

    res.status(200).json({ msg: "User successfully registered" });
  } catch (err) {
    errorHandlers(err.res);
    console.error(err);
  }
};

const loginRoute = async (req, res) => {
  try {
    const database = await connectDB();
    const userModel = new UserModel(database);
    const dealership = new DealershipModel(database);

    const { email, password } = req.body;

    console.log("Email:", email);
    let user = null;
    if (user === null || user === undefined) {
      user = await userModel.getUserByEmail(email);
    }
    if (user === null || user === undefined) {
      user = await dealership.getUserByEmail(email);
    }
    if (!user || user.length === 0 || user === null || user === undefined) {
      return res.status(400).json({ msg: "User not found" });
    }
    console.log("User:", user.password);
    if (user != null || user != undefined) {
      // const isMatch = await bcrypt.compare(password, user.password);
      if (password != user.password) {
        // if (!isMatch) {
        return res.status(400).json({ msg: "Password mismatch" });
        // }
      }

      const payload = {
        user: user
      };

      jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      });
    }
  } catch (err) {
    errorHandlers(err, res);
  }
};

// const loginRoute = async (req, res) => {
//   try {
//     const database = await connectDB();
//     const userModel = new UserModel(database);

//     const { email, password } = req.body;

//     console.log("Email:", email);
//     const user = await userModel.getUserByEmail(email);
//     console.log("User:", user);

//     if (user && user.length > 0) {
//       console.log("Output form " + user[0].password);
//     } else {
//       console.log("User not found");
//     }

//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     // const isMatch = await bcrypt.compare(password, user.password);
//     if (password != user.password) {
//       // const isMatch = await bcrypt.compare(password, user.password);
//       // if (!isMatch) {
//       return res.status(400).json({ msg: "Password mismatch" });
//       // }
//     }
//     const payload = {
//       user: {
//         id: user._id,
//       },
//     };

//     jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
//       if (err) {
//         throw err;
//       }
//       if (token) {
//         localStorage.setItem("x-auth-token", token);
//         const token = localStorage.getItem("x-auth-token");
//         console.log(token);

//       }
//       res.json({ token });
//     });
//   } catch (err) {
//     errorHandlers(err, res);
//   }
// };

module.exports = {
  registerUser,
  loginRoute,
};
