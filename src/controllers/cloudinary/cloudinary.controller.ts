import { Router, Request, Response } from "express";
const Multer = require("multer");
// import Multer from 'multer';
import { v2 as cloudinary ,UploadApiResponse} from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new Multer.memoryStorage();
const multerUploader = Multer({
    storage,
});

async function handleUpload(file: any) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}

// cloudinaryRouter.post(
//     "/imgup",
//     multerUploader.array("file"),
//     async (req: any, res: Response) => {
//         try {
//             // console.log('🎇🎈',req.files);

//             const result : string[] = [];
//             for (let i = 0; i < req.files.length; i++) {
//                 const b64 = Buffer.from(req.files[i].buffer).toString("base64");
//                 let dataURI = "data:" + req.files[i].mimetype + ";base64," + b64;
//                 try {
//                     const cldRes = await handleUpload(dataURI);
//                     result.push(cldRes.url);
//                     // console.log(cldRes.url);
//                 } catch (error) {
//                     //
//                 }
//             }
//             console.log(`final result : `,result);
//            return res.json(result);
//         } catch (error) {
//             console.log(error);
//             res.send({
//                 message: (error as Error).message,
//             });
//         }
//     }
// );



export async function uploadFileToCloud(req: any, res: Response)  {
    try {
        // console.log('🎇🎈',req.files);

        const result : string[] = [];
        for (let i = 0; i < req.files.length; i++) {
            const b64 = Buffer.from(req.files[i].buffer).toString("base64");
            let dataURI = "data:" + req.files[i].mimetype + ";base64," + b64;
            try {
                const cldRes = await handleUpload(dataURI);
                result.push(cldRes.url);
                // console.log(cldRes.url);
            } catch (error) {
                //
            }
        }
        // console.log(`final result : `,result);
       return res.json(result);
    } catch (error) {
        console.log(error);
        res.send({
            message: (error as Error).message,
        });
    }
}

export default multerUploader;
