const Model = require('./model.js');
const faker = require('faker');
const s3 = require('../../config/aws.js');
//const memwatch = require('@airbnb/node-memwatch');


let {lorem, internet, random} = faker;
let M = new Model();

const N_PRIMARY_RECORDS = 10000000;

// memory monitoring and logging to console
// memwatch.on('stats', (stats) => {
//   console.log(`used: ${stats.used_heap_size}`);
// });

const randomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// pull s3 urls
const getImgUrls = () => {
  return s3.listObjects({Bucket: "reviews-pictures"}).promise()
  .then(response => {
    let imgUrls = [];
    response.Contents.forEach(object => imgUrls.push(`https://reviews-pictures.s3.us-east-2.amazonaws.com/${object.Key}`));
    return imgUrls;
  })
  .catch(err => console.log(err));
}

// generate list of insert queries for reviews
const generateReviews = async (n, imgUrls) => {
  let count = 0;
  for (id = 1; id <= n; id++) {
    let numReviews = randomIntInRange(1, 20);
    let insertQueries = [];
    for (i = 0; i < numReviews; i++) {
      let review = {
        productid: id,
        title: lorem.sentence(10),
        user: internet.userName(),
        date: faker.date.past(4),
        likes: random.number(1000),
        body: lorem.paragraph(randomIntInRange(5, 20)),
        thumbnail: imgUrls[random.number(1000)],
        stars: randomIntInRange(1, 5),
        recommend: random.boolean(),
        difficulty: randomIntInRange(1, 5),
        value: randomIntInRange(1, 5),
        quality: randomIntInRange(1, 5),
        appearance: randomIntInRange(1, 5),
        works: randomIntInRange(1, 5)
      }
      insertQueries.push(M.insertReview(review))
    }
    count++;
    console.log(count);
    await Promise.all(insertQueries);
  }
}

// do the thing
M.connect()
.then(() => console.time('runtime'))
.then(() => M.dropSchema())
.then(() => M.createSchema())
.then(() => getImgUrls())
.then(imgUrls => generateReviews(N_PRIMARY_RECORDS, imgUrls))
.then(() => M.endConnection())
.then(() => console.timeEnd('runtime'));