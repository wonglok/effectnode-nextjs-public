import mongoose, { Model } from "mongoose";
import { getDBConnection } from "./mongo";

const DefaultValues = {
  title: {
    type: String,
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

if (mongoose?.models["Workspace" + "_Collection"]) {
  mongoose.deleteModel("Workspace" + "_Collection");
}

/** @type {Model} */
const model =
  mongoose.models["Workspace" + "_Collection"] ||
  mongoose.model("Workspace" + "_Collection", DefinitionInfo);

/** @type {Model} */
export const Workspace = new Proxy(model, {
  get: (target, key) => {
    return target[key];
  },
  set: (target, key, val) => {
    target[key] = val;
    return true;
  },
});
