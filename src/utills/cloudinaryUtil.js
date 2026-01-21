import { v2 as cloudinary } from "cloudinary";

// Upload multiple images to Cloudinary in parallel
const uploadImages = async (images) => {
  try {
    // Check if images array is valid
    if (!images || !Array.isArray(images) || images.length === 0) {
      return [];
    }

    // Upload all images in parallel processing
    // Use Promise.all to upload all files at the same time and wait for all files to finish
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        return result.secure_url;
      })
    );
    return imagesUrl;
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export { uploadImages };
