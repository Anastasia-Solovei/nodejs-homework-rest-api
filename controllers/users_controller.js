const jwt = require("jsonwebtoken");
// implementation local storage of avatars
const path = require("path");
const mkdirp = require("mkdirp");
// implementation cloud storage of avatars
// const fs = require("fs/promises");
const {
  findById,
  findByEmail,
  create,
  updateToken,
  updateUserSubscription,
  updateAvatar,
} = require("../repository/users");
// implementation local storage of avatars
const UploadService = require("../services/file-upload");
// implementation cloud storage of avatars
// const CloudUploadService = require("../services/cloud-upload");
const { HttpCode } = require("../config/constants");
require("dotenv").config();
const SERCRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);

  if (user) {
    res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email is already in use",
    });
  }

  try {
    const newUser = await create({ email, password });

    res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
      message: "Registration successful",
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  const isValidPassword = await user?.isValidPassword(password);

  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Email or password is wrong",
    });
  }

  const id = user._id;
  const payload = { id };
  const token = jwt.sign(payload, SERCRET_KEY, { expiresIn: "1h" });

  await updateToken(id, token);

  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    token,
    user: {
      email: `${user.email}`,
      subscription: `${user.subscription}`,
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user._id;
  const user = await findById(id);

  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  }

  await updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const current = async (req, res, next) => {
  const id = req.user._id;
  const user = await findById(id);

  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  }

  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    user: {
      email: `${user.email}`,
      subscription: `${user.subscription}`,
    },
  });
};

const updateSubscription = async (req, res, next) => {
  const id = req.user._id;
  const body = req.body;
  const user = await findById(id);
  const result = await updateUserSubscription(id, body);

  if (!result) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  }

  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    user: {
      email: `${user.email}`,
      subscription: `${result.subscription}`,
    },
  });
};

// implementation local storage of avatars
const uploadAvatar = async (req, res, next) => {
  const id = String(req.user._id);
  const file = req.file;

  const PUBLIC_AVATARS = process.env.PUBLIC_AVATARS;
  const destination = path.join(PUBLIC_AVATARS, id);
  await mkdirp(destination);

  const uploadService = new UploadService(destination);
  const avatarURL = await uploadService.save(file, id);
  await updateAvatar(id, avatarURL);

  if (!avatarURL) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Not authorized",
    });
  }

  return res.status(200).json({
    status: "success",
    code: HttpCode.OK,
    user: {
      avatarURL,
    },
  });
};

// implementation cloud storage of avatars
// const uploadAvatar = async (req, res, next) => {
//   const { id, idUserCloud } = req.user;
//   const file = req.file;

//   const destination = "avatars";
//   const uploadService = new CloudUploadService(destination);
//   const { avatarURL, updatedIdUserCloud } = await uploadService.save(
//     file.path,
//     idUserCloud
//   );
//   await updateAvatar(id, avatarURL, updatedIdUserCloud);

//   try {
//     await fs.unlink(file.path);
//   } catch (err) {
//     console.log(err.message);
//   }

//   if (!avatarURL) {
//     return res.status(HttpCode.UNAUTHORIZED).json({
//       status: "error",
//       code: HttpCode.UNAUTHORIZED,
//       message: "Not authorized",
//     });
//   }

//   return res.status(200).json({
//     status: "success",
//     code: HttpCode.OK,
//     user: {
//       avatarURL,
//     },
//   });
// };

module.exports = {
  signup,
  login,
  logout,
  current,
  updateSubscription,
  uploadAvatar,
};
