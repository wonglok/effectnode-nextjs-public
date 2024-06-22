import mongoose, { Model, Schema } from "mongoose";

const DefaultValues = {
  spaceID: {
    type: String,
  },
  content: {
    type: String,
  },
  data: {
    type: Schema.Types.Mixed,
  },
};

/** @type {DefaultValues} */
export default DefaultValues;

const DefinitionInfo = mongoose.Schema(DefaultValues, {
  timestamps: true,
});

if (mongoose?.models && mongoose?.models["Code" + "_Collection"]) {
  mongoose.deleteModel("Code" + "_Collection");
}

mongoose.models = mongoose.models || {};

/** @type {Model} */
const model =
  mongoose?.models["Code" + "_Collection"] ||
  mongoose.model("Code" + "_Collection", DefinitionInfo);

/** @type {Model} */
export const Code = model;
