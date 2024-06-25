import { diskStorage } from 'multer';
import * as fs from 'fs';

const image_Path = './public/image';

if (!fs.existsSync(image_Path)) {
    fs.mkdirSync(image_Path, { recursive: true });
}

export const taskImageupload = {
    storage: diskStorage({
        destination: image_Path,
        filename: (req, file, cb) => {
            let ext = file.mimetype.split("/")[1];
            if (ext == "svg+xml") ext = "svg"
            const fileName = `${file.originalname.split('.')[0]}-${Date.now()}.${ext}`;
            cb(null, fileName);
        }
    })
}
