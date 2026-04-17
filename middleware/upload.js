import multer from "multer";
import {storage} from "../cloudConfig.js";

const upload = multer({ storage });

export default upload;
