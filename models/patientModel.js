import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const patientSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    patientID : {
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    role: { type: String, enum: ["patient", "admin"], default: "patient" },
},{
    timestamps : true
})

// Pre-save middleware to hash password
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Patient = mongoose.models.Patient || mongoose.model("Patient",patientSchema);
export default  Patient;