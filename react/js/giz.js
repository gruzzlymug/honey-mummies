//
// ./node_modules/.bin/babel --presets react --watch ./js --out-dir ./dist
//
function formatName(user) {
  return user.fn + ' ' + user.ln;
}

const user = {
  fn: 'Bog',
  ln: 'Cantoo'
};

const element = (
  <h1>
    hey {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
