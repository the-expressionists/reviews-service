import axios, {create} from 'axios';
import process from 'process';

const serverUrl = process.env.SERVER_URL ?? 'http://localhost:1337';

const reviewsConn = create({
    baseURL: serverUrl
});

// should ideally take a product id
const getReviews = (productid) => {
    return reviewsConn.get(`/api/reviews/${productid}`)
        .then(resp => resp.data)
        .catch(err => {
            console.log(err);
            return [];
        });
};

const getImg = (url) => axios.get(url, {
  responseType: 'arraybuffer'
}).then(resp => Buffer.from(resp.data, 'binary'))
  .catch(err => {
    console.log(err);
    return null;
  });


export default getReviews;
export {getImg};