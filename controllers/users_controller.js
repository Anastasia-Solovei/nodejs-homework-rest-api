const jwt = require("jsonwebtoken");
const {
  findById,
  findByEmail,
  create,
  updateToken,
} = require("../repository/users");
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
      ResponseBody: {
        message: "Email is already in use",
      },
    });
  }

  try {
    const newUser = await create({ email, password });

    res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      ResponseBody: {
        user: {
          email: newUser.email,
          subscription: "starter",
        },
        message: "Registration successful",
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  const isValidPassword = await user.isValidPassword(password);

  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      ResponseBody: {
        message: "Email or password is wrong",
      },
    });
  }

  const id = user._id;
  const payload = { id };
  const token = jwt.sign(payload, SERCRET_KEY, { expiresIn: "1h" });

  await updateToken(id, token);

  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    ResponseBody: {
      token,
      user: {
        email: `${user.email}`,
        subscription: "starter",
      },
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
      ResponseBody: {
        message: "Not authorized",
      },
    });
  }

  await updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const current = async (req, res, next) => {
  res.json();
};

module.exports = {
  signup,
  login,
  logout,
  current,
};
