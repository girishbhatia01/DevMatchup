import connectionRequestModel from "../models/connectionrequestmodel.js";
import usermodel from "../models/usermodel.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;
    const createdRequest = await connectionRequestModel.create({
      fromUserID: senderId,
      toUserID: receiverId,
    });
   
    res.status(201).json({ message: "Connection request sent successfully", connectionRequest: createdRequest });

  }
  catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};  