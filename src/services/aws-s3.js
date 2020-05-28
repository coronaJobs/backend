const aws = require("aws-sdk");

// Configurate AWS
aws.config.update({
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

// Create a global instance of S3
const s3 = new aws.S3();

// S3 required params
const s3Params = {
  Bucket: process.env.AWS_BUCKET_NAME || "coronajobs_pictures",
  Expires: Number(process.env.AWS_EXPIRATION_TIME) || 60,
};

const getUploadUrl = async (filename) => {
  // Generate file path
  const filenameParts = filename.split(".");
  const extension = filenameParts[filenameParts.length - 1];
  // missing extension validation
  const timestamp = (new Date() / 1).toString();

  // Generate the path for the file in the bucket
  const filePath = `${timestamp}.${extension}`;
  const getParams = { Key: filePath };
  Object.assign(getParams, s3Params);

  // Return a temporal url for upload the file
  const url = await s3.getSignedUrl("putObject", getParams);
  return { url, filePath };
};

const getFileUrl = async (filePath) => {
  try {
    // Get the temporal url for the file
    const getParams = { Key: filePath };
    Object.assign(getParams, s3Params);
    const url = await s3.getSignedUrl("getObject", getParams);
    return { url };
  } catch (error) {
    // If there's no file, then return a null one
    return null;
  }
};

module.exports = { getUploadUrl, getFileUrl, s3Params, s3 };
