import faker from 'faker';
import Review from './Review.js';

let {lorem, name, internet, random} = faker;

let mkStar = () => 1 + ~~(Math.random() * 5);
let mkReview = () => {
    return {
        title: lorem.sentence(40),
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

let seed = (n) => ( n |> [...Array(#)]
                      |> #.map(() => # |> mkReview |> new Review(#) |> #.save()) 
                      |> Promise.all
                  );

seed(100)
    .then(arr => console.log(arr, `Wrote ${arr.length} records!`) 
    ).catch(err => console.log(err));
    

