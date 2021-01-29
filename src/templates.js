const { array } = require('fast-check');
const parse = require('s-expression');

/*
  */

/**
 * 
 * @param {object} assocs - an object containing keyword->XML string associations
 * @param {string} templateStr - an s-expression representing an XML document 
 * @return {string} - a valid XML document
 * 
 * template syntax:
 * 
 *  string :== " [char] "
 * 
 *  attr :== '((k1 v1) (k2 v2) (k3 v3)...)
 * 
 *  element :== tag-name | key!
 * 
 *  sExpr :== (element attr? (sExpr | string)*)
 * 
 *  Postfix your element symbols with `!` to denote that they should be spliced in. It's almost like macros...
 */

let flat = (x) => Array.isArray(x) ? x : [x];


// let template = (assocs, templateStr) => {
//   let map = (assocs instanceof Map ? assocs : new Map(Object.entries(assocs).map(([k, v]) => [k + '!', v])));
//   let p;
//   let isMacro = (s) => s.endsWith('!');
//   let expand = (s) => isMacro(s) ? template(map, map.get(s)) : s;
//   let isArr = Array.isArray;
//   let parseAttr = (node) => {
//     return ' ' + node.map(([key, val]) => {
//       let v = isArr(val) ? walk(val) : val;
//       return `${key}="${expand(val)}"`;
//     }).join(' ');
//   }

//   let walk = (node) => {
//     if (node instanceof String) {
//       return node;
//     }
//     let [x, attr, ...xs] = node;
//     if (isMacro(x)) {
//       return template(map, map.get(x)); // recursive templates
//       // need to exit from this scope
//     }

//     let tag;
//     if (isArr(attr) && attr[0] === 'quote') {
//       tag = parseAttr(attr[1]);
//     } else {
//       tag = '';
//       xs = flat(attr).concat(xs)
//     }
//     return (
//       `<${x}${tag}>${xs.map(walk).join('')}</${x}>`
//     );
//   }

//   try {
//     p = parse(templateStr);
//     return p instanceof Error ? templateStr : walk(p);
//   } catch (err) {
//     console.log(err);
//     return templateStr;
//   }
// }

let isArr = Array.isArray;

let template = (macros, str) => {
  let isMacro = (s) => typeof s === 'string' && s.endsWith('!');
  let map = new Map(Object.entries(macros).map(([k, v]) => [k + '!', v]));

  try {
    let p = parse(str);
    let walk = (node) => {
      if (isArr(node)) {
        if (node[0] === 'quote') {
          let s = ' ' + node[1].map(walk);
          return s;
        }
        let nodes = node.map(walk);
      }
      return (isMacro(node) ? (map.get(node) ?? node) : node);
    }
    return walk(p);
  } catch (err) {
    console.log(err);
    return str;
  }
}
let macros = {
  reviews: 'http://localhost:8000'
};

let s = `
(div '((class "reviews") (src (reviews!)))
  (div "henlo")
  (div (div (p "goodbye"))))
`
console.log(template(macros, s));
module.exports = { template };
