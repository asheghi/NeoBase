const process = require('process');
const ghpages = require('gh-pages');
ghpages.publish('dist', (err) => {
  if (err) {
    console.error('Deploy Failed');
    console.error(err);
    process.exit(1);
  } else {
    process.exit(0);
  }
});
