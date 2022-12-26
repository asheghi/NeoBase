const process = require("process");
const ghpages = require("gh-pages");
const fs = require("fs");
const path = require("path");
const domain = process.env.DOMAIN;

//a hack to fix routing issue on github pages
fs.copyFileSync(
  path.join(__dirname, "../dist/index.html"),
  path.join(__dirname, "../dist/404.html")
);
if (domain) fs.writeFileSync(path.join(__dirname, "../dist/CNAME"), domain);

ghpages.publish(path.join(__dirname, "../dist"), (err) => {
  if (err) {
    console.error("Deploy Failed");
    console.error(err);
    process.exit(1);
  } else {
    let msg = "Deployed Successfully";
    if (domain) msg += " on " + domain;
    console.log(msg);
    process.exit(0);
  }
});
