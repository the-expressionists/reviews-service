const express = require('express');
const process = require('process');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const fs = require('fs/promises');
const {template} = require('../src/templates.js');
const λ = require('ramda');
const Λ = require('ramda-adjunct');


const {map, view, pipe, pipeWith} = λ;

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
{ reviews: env.REVIEWS ?? 'http://localhost:8081'
, similar: env.SIMILAR ?? 'http://localhost:8080'
, mainDsc: env.MAINDESC ?? 'http://localhost:3000'
};

const templatePath = path.join(__dirname, '..', 'dist', 'template.scm');
let pxTmpl;

(async () => {
  pxTmpl = await fs.readFile(templatePath, 'utf-8');
})();

const findBundleUrl = (html) => {
  let reg = /<script.*src="(?<url>.*)">/;
  return html.match(reg)?.groups?.url ?? null;
}

// to avoid globbing of 'http://'
const joinURL = (base, ...args) => base + '/' + path.join(...args);
const data = λ.lensProp('data');

const kleisli = λ.unapply(λ.pipeWith(λ.andThen));// λ.pipeWith(λ.andThen);
const partial = (f, ...args) => λ.partial(f, args);
const split = (x) => [x, x];
const left = λ.lensIndex(0);
const right = λ.lensIndex(1);
const pure = Promise.resolve;

const getBundle = (url) => kleisli
( partial(axios.get)
, λ.view(data)
, findBundleUrl
, partial(joinURL, url)
, partial(axios.get)
, λ.view(data)
)(url);

const buildMacros = async (urls) => {
  let files = await Promise.all(λ.values(urls).map(getBundle));
  return λ.zipObj(keys(urls), files);
}

const buildTemplate = (macros = {}) => {
  let s = template(macros, pxTmpl);
  console.log(s);
}


[ cors()
, bodyParser.json()
, express.static(path.join(__dirname, 'dist'))
].forEach(md => app.use(md));

app.get('/', (req, res) => {
  res.send('1');
  res.send('2');
})

app.listen(PORT);
console.log(`proxy listening on ${PORT}`);

setTimeout(buildTemplate, 5000);