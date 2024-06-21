import mongoose, { Model, Schema } from "mongoose";

const DefaultValues = {
  name: {
    type: String,
    default: "name",
  },
  //
  //
  //
  workspaceID: {
    type: String,
    default: "",
  },
  //
  //
  //
  // inputs: [
  //   {
  //     name: {
  //       type: String,
  //       default: "input",
  //     },
  //     //
  //     name: {
  //       type: String,
  //       default: "input",
  //     },
  //   },
  // ],
};

/** @type {DefaultValues} */
export default DefaultValues;

const DefinitionInfo = mongoose.Schema(DefaultValues, {
  timestamps: true,
});

if (mongoose?.models && mongoose?.models["GraphNode" + "_Collection"]) {
  mongoose.deleteModel("GraphNode" + "_Collection");
}

mongoose.models = mongoose.models || {};

/** @type {Model} */
const model =
  mongoose?.models["GraphNode" + "_Collection"] ||
  mongoose.model("GraphNode" + "_Collection", DefinitionInfo);

/** @type {Model} */
export const GraphNode = model;
