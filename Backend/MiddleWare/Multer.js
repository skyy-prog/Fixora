import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
    filename:function(req,file ,callback){
        const safeBaseName = path
          .basename(file.originalname, path.extname(file.originalname))
          .replace(/[^a-zA-Z0-9_-]/g, "-")
          .slice(0, 60);
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeBaseName}${extension}`;
        callback(null , uniqueName)
    }
})

const upload = multer({storage})
export default upload;
