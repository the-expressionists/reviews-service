import express from 'express';
import process from 'process';
import { join } from 'path';
import axios from 'axios';

import {Review} from './db/Review.js';

// eslint-disable-next-line @babel/new-cap
const app = new express();
const PORT = process.env.PORT || 8081;

app.use(express.static(join(__dirname, 'dist')));

app.get('/reviews', (req, res, next) => {
  axios.get('http://api.nliu.net/rants?count=20')
    .then(resp => resp.data)
    .then(data => res.status(200).json(data).end())
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
});

app.listen(PORT);
console.log(`listening on ${PORT}`);