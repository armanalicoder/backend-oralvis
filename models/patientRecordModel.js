import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // here is the reference of patient model
      required: true,
    },
    note: { type: String, required: true },
    imageUrl: [{ type: String }], // optional
    status: {
      type: String,
      enum: ["uploaded", "annotated", "reported"],
      default: "uploaded",
    },
    reportUrl : {
      type : String
    },
    // multiple annotations, ek array banake
    annotations: [
      {
        annotationJSON: { type: mongoose.Schema.Types.Mixed },
        annotatedImage: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Record = mongoose.models.Record || mongoose.model("Record", recordSchema);

export default Record;
