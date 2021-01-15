import faker from 'faker';
import Review from './Review.js';
import fs from 'fs/promises';
import {existsSync} from 'fs';
import axios from 'axios';
import path from 'path';
import crypto from 'crypto';
import uploadToS3 from '../../config/aws.js';
let {lorem, name, internet, random} = faker;

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

let photoGetter = axios.create({
    baseURL: 'https://thispersondoesnotexist.com/image',
    responseType: 'arraybuffer'
});

let getPhotos = (n) => {
    let ct = 1;
    console.log('Downloading images...');
    return ( n |> [...Array(#)]
        |> #.map((_, i) => delay(::photoGetter.get, i * 1000) // to guarantee unique images
                 .then(d => {
                     console.log(`Saving ${ct++}/${n} images...`);
                     let buf = Buffer.from(d.data, 'binary');
                     let filename = `${genUUID()}.jpeg`;
                     return uploadToS3(filename, buf);
                    //  return fs.writeFile(`${filepath}/${uuid}.jpeg`, buf);
                    })
                 .then(s3Obj => s3Obj.location)
                ) 
        |> Promise.all
        ).catch(::console.log);
};


let mkStar = () => 1 + ~~(Math.random() * 5);
let mkReview = () => {
    return {
        title: lorem.sentence(10),
        user: internet.userName(),
        date: faker.date.past(4),
        likes: random.number(1000),
        body: lorem.paragraph(30),
        stars: mkStar(),
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


let f = () => {
    console.log('resolved!');
    return 1;
};

delay(f, 1000).then(() => console.log('yep'));

// let seed = (n) => ( n |> [...Array(#)]
//                       |> #.map(() => # |> mkReview |> new Review(#) |> #.save()) 
//                       |> Promise.all
//                   );

let imgDir = '/tmp/jtwenlImages';

let populateImgs = async (n) => {
    if (!existsSync(imgDir)) {
        await fs.mkdir(imgDir);
    }
    getPhotos(n, imgDir).then(() => console.log('images saved!')).catch(err => console.log(err));
};

populateImgs(1);

// // seed(100)
// //     .then(arr => console.log(arr, `Wrote ${arr.length} records!`) 
// //     ).catch(err => console.log(err));
