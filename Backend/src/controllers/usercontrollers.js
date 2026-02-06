import usermodel from "../models/usermodel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password   } = req.body;   
    if (!firstName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }  
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist please login" });
    }  
    const newpassword = await bcrypt.hash(password, 10); 
    const newUser = await usermodel.create({
      firstName,
      lastName,
      email,             
      password: newpassword,
    });
    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;  
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET; 
    if (!email || !password) {       
      return res.status(400).json({ message: "Please provide all required fields" });
    }   
    const existingUser = await usermodel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }   
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }   
   const token = jwt.sign({ _id: existingUser._id }, ACCESS_TOKEN_SECRET, {
       expiresIn: "1d",
     });
     const refreshtoken = jwt.sign({ _id: existingUser._id }, REFRESH_TOKEN_SECRET, {
       expiresIn: "7d",
     });
     const options = {
       httpOnly: true,
secure: true, // Uncomment this line if using HTTPS
     };
     const updaterefreshtoken = await usermodel.findByIdAndUpdate(
       existingUser._id,
       { refreshToken: refreshtoken },
       { new: true }
     );
     

    return res.status(200).cookie("accesstoken", token, options).cookie("refreshtoken", refreshtoken, options).json({ message: "Login successful", token, refreshtoken });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { signup, login };