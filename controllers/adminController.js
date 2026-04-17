import Patient from "../models/patientModel.js";
import Record from "../models/patientRecordModel.js";

export async function AllPatientData(req, res) {
  try {
    const submissions = await Record.find().populate(
      "patient",
      "name email patientID"
    );
    // populate se record ke andar patient ki info aajayegi

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function getSubmissionById(req, res) {
  const submissionId = req.params.submissionID;
  if (!submissionId) {
    return res.json({ success: false, msg: "Submission ID is required" });
  }
  try {
    const submission = await Record.findById(submissionId).populate(
      "patient",
      "name email patientID"
    );
    if (!submission) {
      return res.json({ success: false, msg: "No Record Found" });
    }
    return res.json({ success: true, data: submission });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, msg: err });
  }
}

export async function saveAnnotation(req, res) {
  try {
    const { recordId, annotationJSON, index, annotatedImage } = req.body;

    if (!recordId) {
      return res
        .status(400)
        .json({ success: false, msg: "Record ID required" });
    }

    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ success: false, msg: "Record not found" });
    }
    // Agar annotations array exist nahi hai to bana do
    if (!record.annotations) record.annotations = [];

    // Us index pe save karo
    record.annotations[index] = {
      annotationJSON,
      annotatedImage,
    };

    record.status = "annotated";
    await record.save();

    return res.json({
      success: true,
      msg: "Annotation saved successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
}

export async function OpenPDf(req, res) {
  const record = await Record.findById(req.params.id);
  if (!record || !record.reportUrl) return res.status(404).send("Not found");

  // Redirect to Cloudinary URL
  res.redirect(record.reportUrl);
}

export async function UploadReport(req, res) {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, msg: "No file uploaded" });

    const recordId = req.body.recordId;
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    // Update record in DB
    const updatedRecord = await Record.findByIdAndUpdate(
      recordId,
      { reportUrl: fileUrl, status: "reported" },
      { new: true }
    );

    if (!updatedRecord)
      return res.status(404).json({ success: false, msg: "Record not found" });

    res.json({
      success: true,
      msg: "Report Genrated Successfully!",
      fileUrl,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
}
