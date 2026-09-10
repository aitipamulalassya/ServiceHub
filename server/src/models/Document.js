const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProviderProfile",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "aadhaar",
                "pan",
                "address_proof",
                "other",
            ],
            required: true,
        },

        fileName: {
            type: String,
            required: true,
        },

        filePath: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Document", documentSchema);