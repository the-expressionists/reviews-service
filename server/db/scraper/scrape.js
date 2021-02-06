const axios = require('axios');
const uploadToS3 = require('./upload.js');
const crypto = require('crypto');

/**
 * @return {String} - a valid, random UUID
 */
const genUUID = () => {
  let buf = crypto.randomBytes(16);
  buf[6] &= 0b01001111; // set high nibble to 4
  buf[8] &= 0b10111111; // set high nibble to one of 8, 9, 'A', 'B'
  let s = buf.toString('hex');
  let intervals = [8, 4, 4, 4, 12]; // positions to split s at
  let offset = 0;
  return intervals.reduce((a, i) => `${a}-${s.substring(offset, offset += i)}`, '').slice(1);
};

let delay = (f, time) => new Promise((res) => setTimeout(() => res(f()), time));

let log = (d) => {console.log(d); return d;};

// create an axios instance - we need to specify an arraybuffer to prevent the image data
// from getting corrupted
let photoGetter = axios.create({
  baseURL: 'https://thispersondoesnotexist.com/image',
  responseType: 'arraybuffer'
});

/**
 *
 * @param {Buffer} buf - Buffer object representing a JPEG image
 * @return {Promise(ManagedUpload)} - AWS object with metadata for the uploaded S3 object
 */
let bundlePhoto = (buf) => uploadToS3(`${genUUID()}.jpeg`, Buffer.from(buf, 'binary'));

/**
 * @param {number} numUrls - how many urls to get
 * @param {number} [delayTime=1000] - delay period between GET requests (necessary to prevent duplicates)
 * @return {Promise(Array(String))} - Array of `n` image URLs.
 */
let getImgUrls = (numUrls, delayTime = 1000) => {
  let ct = 1;
  console.log('Downloading images...');
  return ( [...Array(numUrls)]
      |> #.map((_, i) => delay(::photoGetter.get, i * delayTime) // to guarantee unique images
               .then(resp => {
                   console.log(`Saving ${ct++}/${numUrls} images...`);
                   return bundlePhoto(resp.data);
                  })
               .then(s3Obj => s3Obj |> #.Location) // upload to S3, returning the location
              )
      |> Promise.all
      ).catch(::console.log);
};

getImgUrls(1000);