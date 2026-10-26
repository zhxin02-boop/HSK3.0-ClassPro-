const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const entry = path.join(root, 'node_modules', 'qrcode', 'lib', 'browser.js');
const modules = [];
const ids = new Map();

function resolveModule(request, from) {
  let target;
  if (request.startsWith('.')) target = path.resolve(path.dirname(from), request);
  else target = require.resolve(request, { paths: [path.dirname(from)] });
  if (!path.extname(target)) {
    if (fs.existsSync(target + '.js')) target += '.js';
    else target = path.join(target, 'index.js');
  }
  return target;
}

function add(file) {
  file = path.resolve(file);
  if (ids.has(file)) return ids.get(file);
  const id = modules.length;
  ids.set(file, id);
  modules.push('');
  let source = fs.readFileSync(file, 'utf8');
  source = source.replace(/require\((['"])([^'"]+)\1\)/g, function (_, quote, request) {
    return '__r(' + add(resolveModule(request, file)) + ')';
  });
  modules[id] = 'function(module,exports,__r){\n' + source + '\n}';
  return id;
}

const entryId = add(entry);
const output = '(function(g){var m=[' + modules.join(',\n') + '],c={};function r(i){if(c[i])return c[i].exports;var x=c[i]={exports:{}};m[i](x,x.exports,r);return x.exports}g.QRCode=r(' + entryId + ')})(window);\n';
fs.writeFileSync(path.join(root, 'source', 'shared', 'qrcode-local.js'), output);
