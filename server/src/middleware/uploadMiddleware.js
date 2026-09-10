const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
    __dirname,
    "../../uploads"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {

    console.log("FILE RECEIVED:");
    console.log("Original name:", file.originalname);
    console.log("Mimetype:", file.mimetype);

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    console.log("Extension:", extension);

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".pdf",
    ];

    if (allowedExtensions.includes(extension)) {
        console.log("File accepted");
        cb(null, true);
    } else {
        console.log("File rejected");

        cb(
            new Error(
                "Only JPG, JPEG, PNG and PDF files are allowed"
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;