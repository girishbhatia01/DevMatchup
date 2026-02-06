import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const auth = (req, res, next) => {  
    const authHeader = req.headers.authorization;   

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }  
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET);        
        req.user = decoded;
        next();
    } catch (error) {   
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }   
};

export default auth;     
