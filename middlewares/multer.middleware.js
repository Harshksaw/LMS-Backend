import multer from "multer";
import path from "path";
const upload = multer({
    dest:"uploads/",
    limits: {fileSize: 50 * 1024 * 1024 }, //50 mb max size
    storage: multer.diskStorage({
        destination : "uploads/",
        filename: (_req , file , cb)=>{
            cb(null , file.orignalname);
        },

    }),
    fileFilter:(_req, file , cb)=>{
        let ext = path.extname(file.originalname);
        if(
            ext != ".jpg" &&
            ext != ".jpeg" &&
            ext != "/webp" &&
            ext != "/png" &&
            ext != ".mp4"

        ){
            cb(new Error(`Unsupported File type! ${ext}`), false);
            return;
        }
        cb(null, true)
    },
})
export default upload;

