const express = require('express');
const Model = require('./db/model.js');
require('newrelic');

const M = new Model();
M.connect();

const app = express();

app.get('/api/reviews/:productid', (req, res) => {
  M.getReviews(req.params.productid)
  .then(result => {
    res.json(result.rows);
  })
  .catch(err => console.log(err));
})

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));