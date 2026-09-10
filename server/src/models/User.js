const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        resetPasswordToken: {
    type: String,
    default: null,
},

resetPasswordExpires: {
    type: Date,
    default: null,
},
 googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
        role: {
            type: String,
            enum: ["provider", "admin"],
            default: "provider",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);