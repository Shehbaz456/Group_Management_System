import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    course: { type: String, required: true }, 
    refreshToken:{
        type:String,
    },
    role: {
        type: String,
        enum: ["leader", "member", "guest"],
        default: "guest",
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null,
    },
    socialLinks: {
        github: String,
        hashnode: String,
        pearlist: String,
    },
    passions: [String],
    description: {
        type: String,
        maxlength: 300,
        default: "",
    },
    skills: [String],
    activityLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "AuditLog" }],
});


// Method to check if the user is a leader
userSchema.methods.isLeader = function () {
    return this.role === "leader";
};

// Method to check if the user is a member
userSchema.methods.isMember = function () {
    return this.role === "member";
};
// Method to check if the user is a guest
userSchema.methods.isGuest = function () {
    return this.role === "guest";
};
// Method to check if the user is part of a group
userSchema.methods.isPartOfGroup = function () {
    return this.groupId !== null;
};


// Method to get the user's social links
userSchema.methods.getSocialLinks = function () {
    return {
        github: this.socialLinks.github || "No GitHub Link",
        hashnode: this.socialLinks.hashnode || "No Hashnode Link",
        pearlist: this.socialLinks.pearlist || "No Pearlist Link",
    };
};

// Method to get the user's passions
userSchema.methods.getPassions = function () {
    return this.passions.length > 0 ? this.passions : ["No Passions Listed"];
};


// Method to get the user's activity logs
userSchema.methods.getActivityLogs = function () {
    return this.activityLogs.length > 0 ? this.activityLogs : ["No Activity Logs"];
};

// Method to get the user's group ID
userSchema.methods.getGroupId = function () {
    return this.groupId ? this.groupId.toString() : "No Group Assigned";
};

// Method to get the user's refresh token
userSchema.methods.getRefreshToken = function () {
    return this.refreshToken || "No Refresh Token Provided";
}
// Method to set the user's refresh token
userSchema.methods.setRefreshToken = function (token) {
    this.refreshToken = token;
    return this.save();
};

// Method to clear the user's refresh token
userSchema.methods.clearRefreshToken = async function () {
    this.refreshToken = null;
    await this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
