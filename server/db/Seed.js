import faker from 'faker';
import Review from './Review.js';
import fs from 'fs/promises';
import {existsSync} from 'fs';
import axios from 'axios';
import path from 'path';

let {lorem, name, internet, random} = faker;

let log = (d) => {console.log(d); return d;};
let photoGetter = axios.create({
    baseURL: 'https://thispersondoesnotexist.com/image',
    responseType: 'arraybuffer'
});

let getPhotos = (n, filepath = '/tmp/jtwenlImages') => 
    ( n |> [...Array(#)]
        |> #.map((_, i) => photoGetter.get()
                 .then(d => {
                     let {data, ...keys} = d;
                     let buf = Buffer.from(data, 'binary');
                     console.log(buf);
                     return fs.writeFile(`${filepath}/fakeImg-${i}.jpeg`, buf);
                    })
                ) 
        |> Promise.all
        |> #.then(() => console.log(`Saved images to ${filepath}!`))
            .catch(err => console.log(err))
    );

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

let delay = (f, time) => new Promise((res) => setTimeout(() => res(f()), time));

let f = () => {
    console.log('resolved!');
    return 1;
};

delay(f, 1000).then(() => console.log('yep'));

// let seed = (n) => ( n |> [...Array(#)]
//                       |> #.map(() => # |> mkReview |> new Review(#) |> #.save()) 
//                       |> Promise.all
//                   );

// let imgDir = '/tmp/jtwenlImages';

// let populateImgs = async (n) => {
//     if (!existsSync(imgDir)) {
//         await fs.mkdir(imgDir);
//     }
//     getPhotos(n, imgDir).then(() => console.log('images saved!')).catch(err => console.log(err));
// };


// populateImgs(5);
// // getPhotos(5);

// // seed(100)
// //     .then(arr => console.log(arr, `Wrote ${arr.length} records!`) 
// //     ).catch(err => console.log(err));
