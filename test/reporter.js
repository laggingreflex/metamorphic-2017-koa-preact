const Path = require('path');
const Base = require('mocha/lib/reporters/base');
const inherits = require('mocha/lib/utils').inherits;
const color = Base.color;

exports = module.exports = Spec;

const getTitle = (suite, indents) => {
  if (!suite.file || indents > 2) {
    return suite.title;
  }
  const fullpath = Path.relative(Path.join(__dirname, '..'), suite.file);
  const basename = Path.basename(fullpath);
  let ret;
  if (basename.match(/index.js|test.js/)) {
    ret = Path.dirname(fullpath);
  } else {
    ret = fullpath;
  }
  ret = ret.split(/[\/\\]+/g);
  // ret = ret.reverse();
  // ret = ret[0] + ':' + suite.title + ` (${ret.slice(1).reverse().join('/')})`;
  ret = suite.title + ` (${ret.join('/')})`
  return ret;
};

function Spec(runner) {
  Base.call(this, runner);

  const self = this;
  let indents = 0;
  let n = 0;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('start', () => {
    console.log();
  });

  runner.on('suite', (suite) => {
    ++indents;
    console.log(color('suite', '%s%s'), indent(), getTitle(suite, indents));
  });

  runner.on('suite end', () => {
    --indents;
    if (indents === 1) {
      console.log();
    }
  });

  runner.on('pending', (test) => {
    const fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', (test) => {
    let fmt;
    if (test.speed === 'fast') {
      fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s');
      console.log(fmt, test.title);
    } else {
      fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s')
        + color(test.speed, ' (%dms)');
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', (test) => {
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.on('end', self.epilogue.bind(self));
}

inherits(Spec, Base);
