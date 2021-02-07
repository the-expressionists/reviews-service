const fs = require('fs').promises;
const faker = require('faker');
let {lorem, internet, random} = faker;
const s3 = require('../../config/aws.js');

const N_PRIMARY_RECORDS = 10000000;

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
    console.log('S3 Image URLs retrieved');
    return imgUrls;
  })
  .catch(err => console.log(err));
}


// generate reviews and write to CSV
const genReviews = async (n, imgUrls) => {
  console.time('runtime');
  let review, row;
  let file = 'server/db/data/reviews.csv';
  await fs.writeFile(file, 'productid,title,user,date,likes,body,thumbnail,stars,recommend,difficulty,value,quality,appearance,works\n', {flag: 'a'});
  for (let id = 1; id <= n; id++) {
    let numReviews = randomIntInRange(1, 20);
    for (let i = 0; i < numReviews; i++) {
      review = {
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
      row = `${review.productid},${review.title},${review.user},${JSON.stringify(review.date)},${review.likes},${review.body},${review.thumbnail},${review.stars},${review.recommend},${review.difficulty},${review.value},${review.quality},${review.appearance},${review.works}\n`
      await fs.writeFile(file, row, {flag: 'a'});
    }
  }
  console.timeEnd('runtime');
}

getImgUrls()
.then(imgUrls => genReviews(N_PRIMARY_RECORDS, imgUrls));