import mongoose from 'mongoose';

const fitResultSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    companyName: { type: String, default: '' },
    fitPercentage: { type: Number, required: true },
    breakdown: { type: mongoose.Schema.Types.Mixed },
    explanation: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      default: '',
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    missingForJob: {
      type: [String],
      default: [],
    },
    scoringBreakdown: {
      type: mongoose.Schema.Types.Mixed,
    },
    fitResults: {
      type: [fitResultSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
