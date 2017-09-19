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

const element = React.createElement(
  'h1',
  null,
  'hey ',
  formatName(user),
  '!'
);

ReactDOM.render(element, document.getElementById('root'));