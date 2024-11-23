import { v2 as cloudinary } from "cloudinary";

/**
 * Uploads a single file to Cloudinary
 * @param {string} file - Base64 encoded file or file path
 * @param {Object} options - Upload options (folder, transformation, etc.)
 * @returns {Promise} Cloudinary upload response
 */
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "instapics",
      resource_type: "auto",
      ...options,
    });
    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Uploads multiple files to Cloudinary
 * @param {Array<string>} files - Array of base64 encoded files or file paths
 * @param {Object} options - Upload options (folder, transformation, etc.)
 * @returns {Promise<Array>} Array of Cloudinary upload responses
 */
export const uploadMultipleToCloudinary = async (files, options = {}) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};

/**
 * Deletes a file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise} Cloudinary deletion response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Deletion failed: ${error.message}`);
  }
};

/**
 * Deletes multiple files from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs to delete
 * @returns {Promise<Array>} Array of Cloudinary deletion responses
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteFromCloudinary(publicId));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple deletion failed: ${error.message}`);
  }
};


// For uploading multiple post images
// const uploadResults = await uploadMultipleToCloudinary(imageFiles, {
//     folder: "instapics/posts",
//     transformation: [
//       { width: 1080, height: 1080, crop: "fill" },
//       { quality: "auto" }
//     ]
//   });