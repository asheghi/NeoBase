const express = require("express");
const path = require("path");

module.exports = {
  middleware() {
    const app = express.Router();
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("/*", (req, res) => {
      return res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
    return app;
  },
};
