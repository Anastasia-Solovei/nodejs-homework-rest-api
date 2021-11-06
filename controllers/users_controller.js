const jwt = require("jsonwebtoken");
// implementation local storage of avatars
// const path = require("path");
// const mkdirp = require("mkdirp");

// implementation cloud storage of avatars
const fs = require("fs/promises");
const {
  findById,
  findByEmail,
  create,
  updateToken,
  findUserByVerifyToken,
  updateTokenVerify,
  updateUserSubscription,
  updateAvatar,
} = require("../repository/users");
// implementation local storage of avatars
// const UploadService = require("../services/file-upload");

// implementation cloud storage of avatars
const CloudUploadService = require("../services/cloud-upload");
const { HttpCode } = require("../config/constants");
const EmailService = require("../services/email/service");
const {
  CreateSenderSendGrid,
  CreateSenderNodeMailer,
} = require("../services/email/sender");
const { CustomError } = require("../helpers/custom_error");

require("dotenv").config();
const SERCRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);

  if (!user) {
    const newUser = await create({ email, password });

    // Sending email for verify user
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderSendGrid()
    );

    const statusEmail = await emailService.sendVerifyEmail(
      newUser.email,
      newUser.name,
      newUser.verificationToken
    );

    res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
        verificationEmailIsSent: statusEmail,
      },
      message: "Verification email sent",
    });
  }

  throw new CustomError(HttpCode.CONFLICT, "Email is already in use");
  // res.status(HttpCode.CONFLICT).json({
  //   status: "error",
  //   code: HttpCode.CONFLICT,
  //   message: "Email is already in use",
  // });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  const isValidPassword = await user?.isValidPassword(password);

  if (!user || !isValidPassword || !user?.isVerified) {
    throw new CustomError(HttpCode.UNAUTHORIZED, "Email or password is wrong");
    // return res.status(HttpCode.UNAUTHORIZED).json({
    //   status: "error",
    //   code: HttpCode.UNAUTHORIZED,
    //   message: "Email or password is wrong",
    // });
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
    throw new CustomError(HttpCode.UNAUTHORIZED, "Not authorized");
    // return res.status(HttpCode.UNAUTHORIZED).json({
    //   status: "error",
    //   code: HttpCode.UNAUTHORIZED,
    //   message: "Not authorized",
    // });
  }

  await updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const current = async (req, res, next) => {
  const id = req.user._id;
  const user = await findById(id);

  if (!user) {
    throw new CustomError(HttpCode.UNAUTHORIZED, "Not authorized");
    // return res.status(HttpCode.UNAUTHORIZED).json({
    //   status: "error",
    //   code: HttpCode.UNAUTHORIZED,
    //   message: "Not authorized",
    // });
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
    throw new CustomError(HttpCode.UNAUTHORIZED, "Not authorized");
    // return res.status(HttpCode.UNAUTHORIZED).json({
    //   status: "error",
    //   code: HttpCode.UNAUTHORIZED,
    //   message: "Not authorized",
    // });
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
// const uploadAvatar = async (req, res, next) => {
//   const id = String(req.user._id);
//   const file = req.file;

//   const PUBLIC_AVATARS = process.env.PUBLIC_AVATARS;
//   const destination = path.join(PUBLIC_AVATARS, id);
//   await mkdirp(destination);

//   const uploadService = new UploadService(destination);
//   const avatarURL = await uploadService.save(file, id);
//   await updateAvatar(id, avatarURL);

//   if (!avatarURL) {
// throw new CustomError(HttpCode.UNAUTHORIZED, "Not authorized");
// return res.status(HttpCode.UNAUTHORIZED).json({
//   status: "error",
//   code: HttpCode.UNAUTHORIZED,
//   message: "Not authorized",
// });
//   }

//   return res.status(200).json({
//     status: "success",
//     code: HttpCode.OK,
//     user: {
//       avatarURL,
//     },
//   });
// };

// implementation cloud storage of avatars
const uploadAvatar = async (req, res, next) => {
  const { id, idUserCloud } = req.user;
  const file = req.file;

  const destination = "avatars";
  const uploadService = new CloudUploadService(destination);
  const { avatarURL, updatedIdUserCloud } = await uploadService.save(
    file.path,
    idUserCloud
  );
  await updateAvatar(id, avatarURL, updatedIdUserCloud);

  try {
    await fs.unlink(file.path);
  } catch (err) {
    console.log(err.message);
  }

  if (!avatarURL) {
    throw new CustomError(HttpCode.UNAUTHORIZED, "Not authorized");
    // return res.status(HttpCode.UNAUTHORIZED).json({
    //   status: "error",
    //   code: HttpCode.UNAUTHORIZED,
    //   message: "Not authorized",
    // });
  }

  return res.status(200).json({
    status: "success",
    code: HttpCode.OK,
    user: {
      avatarURL,
    },
  });
};

const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await findUserByVerifyToken(verificationToken);

  if (!user) {
    throw new CustomError(HttpCode.NOT_FOUND, "User not found!");
    // return res.status(HttpCode.NOT_FOUND).json({
    //   status: "error",
    //   code: HttpCode.NOT_FOUND,
    //   message: "User not found!",
    // });
  }

  await updateTokenVerify(user._id, true, null);
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    message: "Verification successful",
  });
};

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await findByEmail(email);
  const { name, verificationToken } = user;

  if (user.isVerified === false) {
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderNodeMailer()
    );

    const statusEmail = await emailService.sendVerifyEmail(
      email,
      name,
      verificationToken
    );

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      message: "Verification email sent",
    });
  }

  if (user.isVerified === true) {
    throw new CustomError(
      HttpCode.BAD_REQUEST,
      "Verification has already been passed"
    );
    // return res.status(HttpCode.BAD_REQUEST).json({
    //   status: "error",
    //   code: HttpCode.BAD_REQUEST,
    //   message: "Verification has already been passed",
    // });
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  updateSubscription,
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser,
};
