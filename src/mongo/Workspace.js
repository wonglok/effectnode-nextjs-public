import mongoose, { Model } from "mongoose";

const DefaultValues = {
  title: {
    type: String,
    unique: true,
    require: true,
    default: "New Workspace",
  },
  slug: {
    type: String,
    unique: true,
    require: true,
  },
  screencapThumb: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
};

/** @type {DefaultValues} */
export default DefaultValues;

const DefinitionInfo = mongoose.Schema(DefaultValues, {
  timestamps: true,
});

if (mongoose?.models && mongoose?.models["Workspace" + "_Collection"]) {
  mongoose.deleteModel("Workspace" + "_Collection");
}

mongoose.models = mongoose.models || {};

/** @type {Model} */
const model =
  mongoose?.models["Workspace" + "_Collection"] ||
  mongoose.model("Workspace" + "_Collection", DefinitionInfo);

/** @type {Model} */
export const Workspace = model;
