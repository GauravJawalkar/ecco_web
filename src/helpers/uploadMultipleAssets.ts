import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



export const uploadMultipleOnCloudinary = async (images: any, folder: string) => {
    try {
        console.log("Images are ", images)
        for (const image in images) {
            const result = await cloudinary.uploader.upload(images[image],
                {
                    folder: folder,
                    resource_type: 'image'
                }
            );
            console.log("In Loop", images[image])
            console.log(result);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to upload the images on cloudinary" }, { status: 500 })
    }
}



