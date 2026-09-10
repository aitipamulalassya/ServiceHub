const Document = require("../models/Document");
const ProviderProfile = require("../models/ProviderProfile");
const cloudinary = require("../config/cloudinary");

// Upload file to Cloudinary
const uploadToCloudinary = (file, folder, resourceType) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(file.buffer);
    });
};

// Upload verification document
const uploadDocument = async (req, res) => {
    try {
        const { type } = req.body;

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Document type is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file",
            });
        }

        const allowedTypes = [
            "aadhaar",
            "pan",
            "address_proof",
            "other",
        ];

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid document type",
            });
        }

        const profile = await ProviderProfile.findOne({
            userId: req.user.id,
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Provider profile not found",
            });
        }

        if (profile.status === "approved") {
            return res.status(400).json({
                success: false,
                message: "Approved profile cannot be modified",
            });
        }

        // Upload document to Cloudinary
        const result = await uploadToCloudinary(
            req.file,
            "servicehub/documents",
            "raw"
        );

        const document = await Document.create({
            providerId: profile._id,
            type,
            fileName: req.file.originalname,
            filePath: result.secure_url,
        });

        profile.documents.push(document._id);

        await profile.save();

        res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            document,
        });
    } catch (error) {
        console.error("DOCUMENT UPLOAD ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to upload document",
        });
    }
};

// Get provider documents
const getDocuments = async (req, res) => {
    try {
        const profile = await ProviderProfile.findOne({
            userId: req.user.id,
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Provider profile not found",
            });
        }

        const documents = await Document.find({
            providerId: profile._id,
        });

        res.status(200).json({
            success: true,
            documents,
        });
    } catch (error) {
        console.error("GET DOCUMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get documents",
        });
    }
};

// Upload profile photo
const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile photo",
            });
        }

        const profile = await ProviderProfile.findOne({
            userId: req.user.id,
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Provider profile not found",
            });
        }

        if (profile.status === "approved") {
            return res.status(400).json({
                success: false,
                message: "Approved profile cannot be modified",
            });
        }

        // Upload profile photo to Cloudinary
        const result = await uploadToCloudinary(
            req.file,
            "servicehub/profile-photos",
            "image"
        );

        profile.profilePhoto = result.secure_url;

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Profile photo uploaded successfully",
            profilePhoto: profile.profilePhoto,
        });
    } catch (error) {
        console.error("PROFILE PHOTO ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to upload profile photo",
        });
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    uploadProfilePhoto,
};