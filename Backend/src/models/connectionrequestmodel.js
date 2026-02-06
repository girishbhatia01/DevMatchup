
import mongoose from "mongoose";

const connectionrequestSchema = new mongoose.Schema(
  {
    fromUserID: {
        type: mongoose.Schema.Types.ObjectId,      
        ref: "User",        
    },
    toUserID: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: "User", 
    },
    status: {
        type: String,   
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
  },
  { timestamps: true }
); 
module.exports = mongoose.model("connectionRequestModel", connectionrequestSchema);    


