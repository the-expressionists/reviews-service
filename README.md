Review component service.

Integration testing is currently not ready, although the bundle is configured to render my component to `<div class="app">`. I should refactor this to just serve a DOM element along with the bundle, which I'll get to ASAP.

To run the seeding script, you'll need to create an `aws.js` file in this format:

Create an AWS account, along with a `jtwenl-reviews-pictures` bucket. This bucket needs to be visible to the public in order to serve images.

```
import S3 from 'aws-sdk/clients/s3';
import fs from 'fs/promises';

const s3 = new S3({
  accessKeyId: `YOUR ACCESS KEY ID`
  secretAccessKey: `YOUR SECRET ACCESS KEY`
});

const uploadToS3 = async (fileName, buf) => {
  if (buf === undefined) {
    buf = await fs.readFile(fileName);
  }

  let params = {
    Bucket: 'jtwenl-reviews-pictures',
    Key: fileName,
    Body: buf,
    ContentType: 'image/jpeg',
  };
  return s3.upload(params).promise();
};
export default uploadToS3; 
```

To run the local server:
