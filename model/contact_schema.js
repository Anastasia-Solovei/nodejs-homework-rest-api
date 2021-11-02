const { Schema, model, SchemaTypes } = require("mongoose");
const { ValidContactName } = require("../config/constants");
const mongoosePaginate = require("mongoose-paginate-v2");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: ValidContactName.MIN_LENGTH,
      maxlength: ValidContactName.MAX_LENGTH,
      required: [true, "Name of contact is required"],
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      match: /^[(][0-9]{3}[)][ ]{0,1}[0-9]{3}[-][0-9]{4}$/,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

contactSchema.path("name").validate(function (value) {
  const re = /[A-Z]\w+/;
  return re.test(String(value));
});

contactSchema.plugin(mongoosePaginate);

const Contact = model("contact", contactSchema);

module.exports = Contact;
