const Model = require('./model.js');
const faker = require('faker');
const s3 = require('../../config/aws.js');
const transform = require('stream');
//const memwatch = require('@airbnb/node-memwatch');


let {lorem, internet, random} = faker;
let M = new Model();

const N_PRIMARY_RECORDS = 10000000;

// memory monitoring and logging to console
// memwatch.on('stats', (stats) => {
//   console.log(`used: ${stats.used_heap_size}`);
// });

// progress bar
const resetCrg = () => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}
const writeProgress = (prog, limit) => {
  resetCrg();
  let tenth = (prog / limit * 10);
  let progBar = ('[' + '='.repeat(tenth * 2) + '>'.repeat(tenth < 10)).padEnd(21) + ']';
  process.stdout.write(`Progress: ${(tenth * 10).toFixed(0)}%`.padEnd(20) + progBar);
}

const endProgress = () => {
  resetCrg();
  process.stdout.write(`Progress: 100%`.padEnd(20) + `[${'='.repeat(20)}]\n`);
}

// random int generator within range min-max, inclusive
const randomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// pull s3 urls
const createImgUrl = (key) => {
  return `https://reviews-pictures.s3.us-east-2.amazonaws.com/${key}`;
}

const getImgUrls = () => {
  return s3.listObjects({Bucket: "reviews-pictures"}).promise()
  .then(response => {
    let imgUrls = [];
    response.Contents.forEach(object => imgUrls.push(createImgUrl(object.Key)));
    return imgUrls;
  })
  .catch(err => console.log(err));
}


// generate reviews
const genReview = (id, imgUrls) => {
  return {
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
  };
}

function *generateNReviews(n, id, imgUrls) {
  for (i = 0; i < n; i++) {
    yield genReview(id, imgUrls);
  }
}

// generate list of insert queries for reviews
const seedReviews = async (n, imgUrls) => {
  for (id = 1; id <= n; id++) {
    writeProgress(id, n);
    let batch = [];
    let numReviews = randomIntInRange(1, 20);
    let gen = generateNReviews(numReviews+1, id, imgUrls);
    for (i = 0; i < numReviews; i++) {
      let curr = gen.next();
      batch.push(curr.value);
    }
    await Promise.all(batch.map(rev => M.insertReview(rev)));
  }
  endProgress();
}

// do the thing
M.connect()
.then(() => console.time('runtime'))
.then(() => M.dropSchema())
.then(() => M.createSchema())
.then(() => getImgUrls())
.then(imgUrls => seedReviews(N_PRIMARY_RECORDS, imgUrls))
.then(() => M.endConnection())
.then(() => console.timeEnd('runtime'));