import mongoose from 'mongoose';

const weightsSchema = new mongoose.Schema(
  {
    core: { type: Number, default: 5 },
    tools: { type: Number, default: 3 },
    soft: { type: Number, default: 2 },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    weights: {
      type: weightsSchema,
      default: () => ({ core: 5, tools: 3, soft: 2 }),
    },
    cultureKeywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
