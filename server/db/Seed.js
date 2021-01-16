/**
 * @module Seed
 * contains some functions for generating fake data, fetching images from 
 *  `thispersondoesnotexist.com` and uploading them to AWS. The stored URLs are then
 *  bundled in a `Review` object and saved in the database.
 * Module will seed 100 records when called directly.
 * 
 */
import faker from 'faker';
import Review from './Review.js';
import fs from 'fs/promises';
import {existsSync} from 'fs';
import axios from 'axios';
import path from 'path';
import crypto from 'crypto';
import uploadToS3 from '../../config/aws.js';
let {lorem, name, internet, random} = faker;

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
 * @param {number} n - how many urls to get
 * @param {number} [delayTime=1000] - delay period between GET requests (necessary to prevent duplicates)
 * @return {Promise(Array(String))} - Array of `n` image URLs.
 */
let getImgUrls = (n, delayTime = 1000) => {
    let ct = 1;
    console.log('Downloading images...');
    return ( [...Array(n)]
        |> #.map((_, i) => delay(::photoGetter.get, i * delayTime) // to guarantee unique images
                 .then(resp => {
                     console.log(`Saving ${ct++}/${n} images...`);
                     return bundlePhoto(resp.data);
                    })
                 .then(s3Obj => s3Obj |> #.Location) // upload to S3, returning the location
                ) 
        |> Promise.all
        ).catch(::console.log);
};

let mkStar = () => 1 + ~~(Math.random() * 5);

let mkReview = (thumbnail) => {
    return {
        title: lorem.sentence(10),
        user: internet.userName(),
        date: faker.date.past(4),
        likes: random.number(1000),
        body: lorem.paragraph(30),
        stars: mkStar(),
        thumbnail: thumbnail,
        recommend: random.boolean(),
        // product: random.uuid(),
        metrics: {
            difficulty: mkStar(),
            value: mkStar(),
            quality: mkStar(),
            appearance: mkStar(),
            works: mkStar()
        } 
    };
};

/**
 * @param {Number} n - How many records to create.
 * @return {Promise(Array(Review))} - Array of Review instances.
 */
let seed = (n) => getImgUrls(n).then(urls => urls.map(url =>
                    mkReview(url) |> new Review(#) |> #.save())
                    |> Promise.all);

if (require.main === module) {
    seed(100)
        .then(arr => {
            console.log(`Wrote ${arr.length} records!`);
            process.exit(0);
        })
        .catch(err => {
            console.log(err);
            process.exit(1);
        });
}

export {
    seed, genUUID, bundlePhoto, mkReview
};