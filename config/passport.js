const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
require("dotenv").config();
const SERCRET_KEY = process.env.JWT_SECRET_KEY;
const Users = require("../repository/users");

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SERCRET_KEY,
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);

      if (!user) {
        return done(new Error("User not found!"), false);
      }
      if (!user.token) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);
