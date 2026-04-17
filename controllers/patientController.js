import Patient from "../models/patientModel.js";
import Record from "../models/patientRecordModel.js";

export async function fetchData(req, res) {
  const { id } = req.user;
  if (!id) {
    return res.status(404).json({ success: false, msg: "Please Provide Id" });
  }
  try {
    const pdata = await Patient.findById(id);
    const data = {
      name: pdata.name,
      email: pdata.email,
      pid: pdata.patientID,
      role: pdata.role,
    };
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: err });
  }
}

export async function UploadRecord(req, res) {
  const { email, note } = req.body;
  const imageUrls = req.files.map((file) => file.path);
  try {
    const patient = await Patient.findOne({ email: email });
    const record = await Record.create({
      patient: patient._id, // link to patient
      note: note,
      imageUrl: imageUrls,
      status: "uploaded",
    });
    return res
      .status(200)
      .json({ success: true, msg: "Record Submitted Successfully!" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function AllSubmission(req, res) {
  const { id } = req.user;
  if (!id) {
    return res
      .status(404)
      .json({ success: false, msg: "Something went wrong!" });
  }
  try {
    const data = await Record.find({ patient: id });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: err });
  }
}

export async function getSubmissionById(req, res) {
  const submissionId = req.params.submissionID;
  if (!submissionId) {
    return res.json({ success: false, msg: "Submission ID is required" });
  }
  try{

      const submission = await Record.findById(submissionId);
      if (!submission) {
        return res.json({ success: false, msg: "No Record Found" });
      }

      //fetch Patient Data from Patient id then send to frontend
      const pdata = await Patient.findById(submission.patient);
      const patientData = {
        name : pdata.name,
        email : pdata.email,
        pid : pdata.patientID,
      }
      return res.json({ success: true, data : submission , patientData });
  }catch(err){
    console.log(err);
    return res.json({success : false, msg : err})
  }
}
