const db = require("../config/db");
const app = require("../app");
require("dotenv").config();
const TMP_DIR = process.env.TMP_DIR;
const PUBLIC_AVATARS = process.env.PUBLIC_AVATARS;

const mkdirp = require("mkdirp");

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    await mkdirp(TMP_DIR);
    await mkdirp(PUBLIC_AVATARS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server not running. Error ${err.message}`);
});
