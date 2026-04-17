import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "OralVis Assets",
      resource_type: "auto",
      allowed_formats: ["png", "jpg", "jpeg", "pdf"], 
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

export { cloudinary, storage };
