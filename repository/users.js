const User = require("../model/user_schema");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const findUserByVerifyToken = async (verificationToken) => {
  return await User.findOne({ verificationToken });
};

const updateTokenVerify = async (id, isVerified, verificationToken) => {
  return await User.updateOne({ _id: id }, { isVerified, verificationToken });
};

const updateUserSubscription = async (id, body) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { subscription: body.subscription },
    { new: true }
  );
  return result;
};

// implementation local storage of avatars
// const updateAvatar = async (id, avatar) => {
//   return await User.updateOne({ _id: id }, { avatarURL: avatar });
// };

// implementation cloud storage of avatars
const updateAvatar = async (id, avatar, idUserCloud) => {
  return await User.updateOne(
    { _id: id },
    { avatarURL: avatar },
    { idUserCloud }
  );
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  findUserByVerifyToken,
  updateTokenVerify,
  updateUserSubscription,
  updateAvatar,
};
