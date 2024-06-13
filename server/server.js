import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import UserActivation from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const server = express();
const PORT = process.env.PORT || 3000;

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors())

mongoose.connect(process.env.DB_LOCATION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameNotUnique = await UserActivation.exists({ "personal_info.username": username });

  if (isUsernameNotUnique) {
    username += nanoid();
  }
  return username;
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id },process.env.SECRET_ACESS);
  return {
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    access_token,
  };
};

server.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res.status(403).json({ "error": "Fullname must be at least 3 letters" });
  }

  if (!email.length) {
    return res.status(403).json({ "error": "Enter the email" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ "error": "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({ "error": "Password should be 6 to 20 characters long with at least one numeric digit, one lowercase, and one uppercase letter" });
  }

  try {
    const hashed_password = await bcrypt.hash(password, 10);
    const username = await generateUsername(email);

    const newUser = new UserActivation({
      personal_info: { fullname, email, password: hashed_password, username }
    });

    const savedUser = await newUser.save();
    return res.status(200).json({ user: savedUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ "error": "User with this email already exists" });
    }
    return res.status(500).json({ "error": err.message });
  }
});

server.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserActivation.findOne({ "personal_info.email": email });

    if (!user) {
      return res.status(403).json({ "error": "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.personal_info.password);
    
    if (!isPasswordValid) {
      return res.status(403).json({ "error": "Incorrect password" });
    }

    return res.status(200).json(formatDatatoSend(user));
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ "error": err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port -> ${PORT}`);
});
