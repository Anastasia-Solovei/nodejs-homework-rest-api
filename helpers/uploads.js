const multer = require("multer");
const { CustomError } = require("./custom_error");
const { HttpCode } = require("../config/constants");
require("dotenv").config();
const TMP_DIR = process.env.TMP_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TMP_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      return cb(null, true);
    }

    cb(new CustomError(HttpCode.BAD_REQUEST, "Wrong format for avatar"));
  },
});

module.exports = upload;
