const express = require('express');
const process = require('process');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const fs = require('fs/promises');
// const {template} = require('../src/templates.js');
const pug = require('pug');
const webpack = require('webpack');
const λ = require('ramda');
const Λ = require('ramda-adjunct');


const {keys, zipObj, andThen, map, view, pipe, pipeWith} = λ;

const PORT = process.env.PORT ?? 8082;
const app = express();

/**
 * 
 * @param {object} obj - An object with an endomorphic class method
 * @param {function} arrow - The endomorphism's identifier
 * @return {function} - obj[arrow] with `this` α-renamed to `obj`
 */
const endo = (obj, arrow) => obj[arrow].bind(obj);

const display = (s) => { console.log(s); return s };

const { env } = process;

const services =
{ reviews: env.REVIEWS ?? 'http://localhost:8081/bundle.js'
, similar: env.SIMILAR ?? 'http://localhost:8080/path.js'
, main: env.MAINDESC ?? 'http://localhost:3000/dist/bundle.js'
};

const templatePath = path.join(__dirname, '..', 'dist', 'template.pug');

const findBundleUrl = (html) => {
  let reg = /<script.*src="(?<url>.*)">/;
  return html.match(reg)?.groups?.url ?? null;
}

// to avoid globbing of 'http://'
const joinURL = (base, ...args) => base + '/' + path.join(...args);
const data = λ.lensProp('data');

const kleisli = λ.unapply(λ.pipeWith(andThen));
const partial = (f, ...args) => λ.partial(f, args);
const split = (x) => [x, x];
const left = λ.lensIndex(0);
const right = λ.lensIndex(1);
const pure = Promise.resolve;
const liftA2 = λ.curry((f, g, h, x) => f(g(x))(h(x)));

const getBundle = (url) => kleisli
( partial(axios.get)
, λ.view(data)
, findBundleUrl
, partial(joinURL, url)
, partial(axios.get)
, λ.view(data)
)(url);

// hate how methods prevent us from eta reducing
let get = (url) => axios.get(url);
let all = (p) => Promise.all(p);

// let views;
// (async () => {
//   try {
//     let fetch = kleisli(get, λ.view(data), );
//     let join = // I hate how Promises turn `andThen` into either <$> or >>=
//       liftA2 ( andThen)
//         (pipe( keys, zipObj))
//         (pipe( λ.values
//              , map(fetch)
//              , all
//              ));
//     views = await join(services);
//   } catch (err) {
//     console.log(err);
//   }
// })();

app.set('view engine', 'pug');
app.use(cors());
[ 
 bodyParser.json()
, express.static(path.join(__dirname, 'dist'))
].forEach(md => app.use(md));

app.get('/', (req, res) => {
  res.render(templatePath, services);
})

app.listen(PORT);
console.log(`proxy listening on ${PORT}`);
