import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import zlib from "zlib";

const uploadDir = path.resolve("tmp/my-uploads");

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter for only images and PDFs
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only images and PDFs are allowed!"));
        }
    },
}).fields([{ name: "notes", maxCount: 1 }]); // ✅ Corrected here

// 📝 Compress Image Before Saving
const compressAndSaveImage = async (localFilePath) => {
    const compressedFilePath = localFilePath.replace(path.extname(localFilePath), "-compressed.jpg");
    try {
        await sharp(localFilePath)
            .resize(800) // Resize width to 800px
            .jpeg({ quality: 70 }) // Compress with 70% quality
            .toFile(compressedFilePath);

        // Delete original uncompressed file
        fs.unlinkSync(localFilePath);
        return compressedFilePath;
    } catch (error) {
        console.error("Error compressing image:", error);
        return localFilePath; // Return original if compression fails
    }
};

// 📚 Compress PDF Before Saving
const compressAndSavePDF = (localFilePath) => {
    const compressedFilePath = localFilePath.replace(".pdf", "-compressed.pdf");
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(localFilePath);
        const writeStream = fs.createWriteStream(compressedFilePath);
        const gzip = zlib.createGzip();

        readStream
            .pipe(gzip)
            .pipe(writeStream)
            .on("finish", () => {
                // Delete original uncompressed file
                fs.unlinkSync(localFilePath);
                resolve(compressedFilePath);
            })
            .on("error", (error) => {
                console.error("Error compressing PDF:", error);
                resolve(localFilePath); // Return original if compression fails
            });
    });
};

// 🎯 Handle Compression Based on File Type
const compressAndSaveFile = async (localFilePath, mimetype) => {
    if (mimetype.startsWith("image/")) {
        return await compressAndSaveImage(localFilePath);
    } else if (mimetype === "application/pdf") {
        return await compressAndSavePDF(localFilePath);
    }
    return localFilePath;
};

export { upload, compressAndSaveFile };
