const fs = require("fs/promises");
const path = require("path");

const from = path.resolve(__dirname, "../views");
const to = path.resolve(__dirname, "../../dist/src/views");

(async () => {
  await fs.cp(from, to, { recursive: true, force: true });
})();
