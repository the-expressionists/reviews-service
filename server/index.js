import express from 'express';
import process from 'process';
import { join } from 'path';
import axios from 'axios';
import bodyParser from 'body-parser';

import Review from './db/Review.js';
import {reviewsHandler} from './endpoints';


// eslint-disable-next-line @babel/new-cap
const app = new express();
const PORT = process.env.PORT || 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(join(__dirname, '..', 'dist')));

let log = (data) => {
  console.log(data);
  return data;
};

app.get('/reviews', reviewsHandler);

app.listen(PORT);
console.log(`listening on ${PORT}`);