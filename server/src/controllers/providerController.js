const ProviderProfile = require("../models/ProviderProfile");

// Get provider profile
const getProfile = async (req, res) => {
    try {
        let profile = await ProviderProfile.findOne({
            userId: req.user.id,
        }).populate("userId", "name email role");

        if (!profile) {
            profile = await ProviderProfile.create({
                userId: req.user.id,
            });

            profile = await ProviderProfile.findById(profile._id)
                .populate("userId", "name email role");
        }

        res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get profile",
        });
    }
};

// Update provider profile
const updateProfile = async (req, res) => {
    try {
        const {
            phone,
            categories,
            skills,
            experience,
            location,
        } = req.body;

        let profile = await ProviderProfile.findOne({
            userId: req.user.id,
        });

        if (!profile) {
            profile = new ProviderProfile({
                userId: req.user.id,
            });
        }

        // Provider can edit only before approval
        if (profile.status === "approved") {
            return res.status(400).json({
                success: false,
                message: "Approved profile cannot be edited",
            });
        }

        profile.phone = phone;
        profile.categories = categories || [];
        profile.skills = skills || [];
        profile.experience = experience || 0;
        profile.location = location || {};

        // If rejected and edited, allow resubmission later
        if (profile.status === "rejected") {
            profile.status = "draft";
            profile.rejectionRemark = "";
        }

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile,
        });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};

// Submit application
const submitApplication = async (req, res) => {
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

    if (profile.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Approved applications cannot be submitted again",
      });
    }

    if (profile.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Application is already under review",
      });
    }

    const missingFields = [];

    if (!profile.phone) {
      missingFields.push("Phone number");
    }

    if (!profile.categories || profile.categories.length === 0) {
      missingFields.push("Service category");
    }

    if (!profile.skills || profile.skills.length === 0) {
      missingFields.push("Skills");
    }

    if (
      profile.experience === undefined ||
      profile.experience === null
    ) {
      missingFields.push("Experience");
    }

    if (!profile.location?.city) {
      missingFields.push("City");
    }

    if (!profile.location?.state) {
      missingFields.push("State");
    }

    if (!profile.location?.pincode) {
      missingFields.push("Pincode");
    }

    if (!profile.profilePhoto) {
      missingFields.push("Profile photo");
    }

    if (!profile.documents || profile.documents.length === 0) {
      missingFields.push("Verification document");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please complete your application before submitting",
        missingFields,
      });
    }

    profile.status = "pending";
    profile.submittedAt = new Date();
    profile.rejectionRemark = "";

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      profile,
    });
  } catch (error) {
    console.error("Submit application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};
// Get application status
const getApplicationStatus = async (req, res) => {
    try {
        const profile = await ProviderProfile.findOne({
            userId: req.user.id,
        }).select(
            "status rejectionRemark submittedAt reviewedAt"
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.status(200).json({
            success: true,
            application: profile,
        });
    } catch (error) {
        console.error("STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get application status",
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    submitApplication,
    getApplicationStatus,
};