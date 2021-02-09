const cassandra = require('cassandra-driver');
const distance = cassandra.types.distance;

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  pooling: {
    coreConnectionsPerHost: {
      [distance.local]: 5
    }
  }
})

class Model {

  connect() {
    return client.connect()
      .then(() => console.log('Connected to Cassandra!'))
      .then(() => client.execute(`USE reviews_service`))
      .catch(err => console.log(err));
  }

  createSchema() {
    return client.execute(`
      CREATE KEYSPACE IF NOT EXISTS reviews_service
      WITH replication = {'class':'SimpleStrategy','replication_factor':1}
    `)
    .then(() => client.execute(`USE reviews_service`))
    .then(() => client.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        productid int,
        title text,
        user text,
        date timestamp,
        likes int,
        body text,
        thumbnail text,
        stars tinyint,
        recommend boolean,
        difficulty tinyint,
        value tinyint,
        quality tinyint,
        appearance tinyint,
        works tinyint,
        PRIMARY KEY (productid, date)
      ) WITH CLUSTERING ORDER BY (date DESC)
    `))
    .then(() => console.log('Schema Created'))
    .catch(err => console.log(err));
  }

  dropSchema() {
    return client.execute('DROP KEYSPACE IF EXISTS reviews_service')
    .then(() => console.log('Schema Dropped'))
    .catch(err => console.log(err));
  }

  insertReview(review) {
    let queryString = `
      INSERT INTO reviews (productid, title, user, date, likes, body, thumbnail, stars, recommend, difficulty, value, quality, appearance, works)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    let {productid, title, user, date, likes, body, thumbnail, stars, recommend, difficulty, value, quality, appearance, works} = review;
    let values = [productid, title, user, date, likes, body, thumbnail, stars, recommend, difficulty, value, quality, appearance, works];
    return client.execute(queryString, values, { prepare: true })
    .catch(err => console.log(err));
  }

  getReviews(productid) {
    return client.execute(`SELECT * FROM reviews WHERE productid=${productid}`);
    //.catch(err => console.log(err));
  }

  endConnection() {
    return client.shutdown()
    .then(() => console.log('Bye'))
    .catch(err => console.log(err));
  }
}

module.exports = Model;