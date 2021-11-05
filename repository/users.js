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
  updateUserSubscription,
  updateAvatar,
};
