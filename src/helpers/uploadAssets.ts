import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (file: any, folder: string) => {

    try {

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result)
                }
            )
            uploadStream.end(buffer);
        })

        return result;

    } catch (error) {
        return NextResponse.json({ "error": error }, { status: 500 })
    }
}



