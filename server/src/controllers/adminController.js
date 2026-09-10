const User = require("../models/User");
const ProviderProfile = require("../models/ProviderProfile");
const Document = require("../models/Document");

// Get all providers
const getProviders = async (req, res) => {
    try {
        const {
            search = "",
            status,
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);
        const skip = (pageNumber - 1) * limitNumber;

        const users = await User.find({
            role: "provider",
            $or: [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ],
        }).select("_id name email");

        const userIds = users.map((user) => user._id);

        const filter = {
            userId: { $in: userIds },
        };

        if (status) {
            filter.status = status;
        }

        const total = await ProviderProfile.countDocuments(filter);

        const profiles = await ProviderProfile.find(filter)
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            providers: profiles,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error("GET PROVIDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get providers",
        });
    }
};

// Get provider by ID
const getProviderById = async (req, res) => {
    try {
        const profile = await ProviderProfile.findById(
            req.params.id
        ).populate("userId", "name email role");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        const documents = await Document.find({
            providerId: profile._id,
        });

        res.status(200).json({
            success: true,
            provider: profile,
            documents,
        });
    } catch (error) {
        console.error("GET PROVIDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get provider",
        });
    }
};

// Approve provider
const approveProvider = async (req, res) => {
    try {
        const profile = await ProviderProfile.findById(
            req.params.id
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        if (profile.status === "approved") {
            return res.status(400).json({
                success: false,
                message: "Provider is already approved",
            });
        }

        if (profile.status !== "pending") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending applications can be approved",
            });
        }

        profile.status = "approved";
        profile.reviewedAt = new Date();
        profile.rejectionRemark = "";

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Provider approved successfully",
            status: profile.status,
        });
    } catch (error) {
        console.error("APPROVE PROVIDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to approve provider",
        });
    }
};

// Reject provider
const rejectProvider = async (req, res) => {
    try {
        const { rejectionRemark } = req.body;

        if (!rejectionRemark) {
            return res.status(400).json({
                success: false,
                message: "Rejection remark is required",
            });
        }

        const profile = await ProviderProfile.findById(
            req.params.id
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        if (profile.status !== "pending") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending applications can be rejected",
            });
        }

        profile.status = "rejected";
        profile.rejectionRemark = rejectionRemark;
        profile.reviewedAt = new Date();

        await profile.save();

        res.status(200).json({
            success: true,
            message: "Provider rejected successfully",
            status: profile.status,
            rejectionRemark: profile.rejectionRemark,
        });
    } catch (error) {
        console.error("REJECT PROVIDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reject provider",
        });
    }
};

// Dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalProviders,
            pendingProviders,
            approvedProviders,
            rejectedProviders,
            draftProviders,
        ] = await Promise.all([
            ProviderProfile.countDocuments(),
            ProviderProfile.countDocuments({
                status: "pending",
            }),
            ProviderProfile.countDocuments({
                status: "approved",
            }),
            ProviderProfile.countDocuments({
                status: "rejected",
            }),
            ProviderProfile.countDocuments({
                status: "draft",
            }),
        ]);

        res.status(200).json({
            success: true,
            statistics: {
                totalProviders,
                pendingProviders,
                approvedProviders,
                rejectedProviders,
                draftProviders,
            },
        });
    } catch (error) {
        console.error("STATS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get dashboard statistics",
        });
    }
};

module.exports = {
    getProviders,
    getProviderById,
    approveProvider,
    rejectProvider,
    getDashboardStats,
};