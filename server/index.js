require('newrelic');
const express = require('express');
const cors = require('cors');
const Model = require('./db/model.js');

const M = new Model();
M.connect();

const app = express();

app.use(cors());

app.get('/api/reviews/:productid', (req, res) => {
  M.getReviews(req.params.productid)
  .then(result => {
    res.json(result.rows);
  })
  .catch(err => {
    console.log(err);
    res.status(500);
  });
})

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));