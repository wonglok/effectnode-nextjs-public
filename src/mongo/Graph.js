import mongoose, { Model, Schema } from "mongoose";

const DefaultValues = {
  spaceID: {
    type: String,
  },
  graphData: {
    type: Schema.Types.Mixed,
  },
};

/** @type {DefaultValues} */
export default DefaultValues;

const DefinitionInfo = mongoose.Schema(DefaultValues, {
  timestamps: true,
});

if (mongoose?.models && mongoose?.models["Graph" + "_Collection"]) {
  mongoose.deleteModel("Graph" + "_Collection");
}

mongoose.models = mongoose.models || {};

/** @type {Model} */
const model =
  mongoose?.models["Graph" + "_Collection"] ||
  mongoose.model("Graph" + "_Collection", DefinitionInfo);

/** @type {Model} */
export const Graph = model;
