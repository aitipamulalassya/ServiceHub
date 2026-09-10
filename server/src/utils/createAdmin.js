const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            email: "admin@servicehub.com",
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        await User.create({
            name: "ServiceHub Admin",
            email: "admin@servicehub.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully");

        process.exit(0);
    } catch (error) {
        console.error("ADMIN CREATION ERROR:", error);
        process.exit(1);
    }
};

createAdmin();