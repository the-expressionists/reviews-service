const fs = require('fs/promises');
const s3 = require('../../../config/aws.js');

const uploadToS3 = async (fileName, buf) => {
  if (buf === undefined) {
    buf = await fs.readFile(fileName);
  }

  let params = {
    Bucket: 'reviews-pictures',
    Key: fileName,
    Body: buf,
    ContentType: 'image/jpeg',
  };
  return s3.upload(params).promise();
};

module.exports = uploadToS3;