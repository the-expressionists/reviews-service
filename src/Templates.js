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
let template = (assocs, templateStr) => {
  let map = (assocs instanceof Map ? assocs : new Map(Object.entries(assocs).map(([k, v]) => [k + '!', v])));
  let p;
  try {
    p = parse(templateStr);
    let walk = (node) => {
      io
      if (node instanceof String) {
        return node;
      }
      let [x, attr, ...xs] = node;
      if (x.endsWith('!')) {
        return template(map, map.get(x)); // recursive templates
      }

      let tag;
      if (Array.isArray(attr) && attr[0] === 'quote') {
        tag = ' ' + attr[1].map(([key, val]) => `${key}="${val}"`).join(' ');
      } else {
        tag = '';
        xs = [].concat(attr, xs);
      }
      return (
        `<${x}${tag}>${xs.map(walk).join('')}</${x}>`
      );
    }
    return walk(p);
  } catch {
    return templateStr;
  }
}

export default template;

// let macros = {
//   'reviews': `(div '((class body) (on-click "handleClick")) (p "some nested text!!!") (main!))`,
//   'henlo': '<div>henlo!!</div>',
//   'main': `<script src="index.js"></script>`
// }
// let s = `
//     (div '((class review) (id "app"))
//       (div '((class review-body)) "hello world" 
//         (p "goodbye")
//         (reviews!)
//         (span "this is a span")
//         (henlo!)
//         (main!)))
// `;

// console.log(template(macros, s));