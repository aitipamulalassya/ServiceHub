const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        profilePhoto: {
            type: String,
            default: "",
        },

        categories: [
            {
                type: String,
                trim: true,
            },
        ],

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        experience: {
            type: Number,
            min: 0,
            default: 0,
        },

        location: {
            city: {
                type: String,
                trim: true,
            },

            state: {
                type: String,
                trim: true,
            },

            pincode: {
                type: String,
                trim: true,
            },
        },

        documents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document",
            },
        ],

        status: {
            type: String,
            enum: ["draft", "pending", "approved", "rejected"],
            default: "draft",
        },

        rejectionRemark: {
            type: String,
            default: "",
        },

        submittedAt: {
            type: Date,
        },

        reviewedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "ProviderProfile",
    providerProfileSchema
);