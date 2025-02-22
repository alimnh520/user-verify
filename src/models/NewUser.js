import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role:{type: String, enum: ["user", "admin"], default: "user"},
    isVerified: {type: Boolean, default: false},
});

export default mongoose.models.NewUser || mongoose.model('NewUser', UserSchema);