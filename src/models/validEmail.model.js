import mongoose from "mongoose";

const validEmailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  course: { type: String, required: true }
});
const ValidEmail = mongoose.model('ValidEmail', validEmailSchema);
export default ValidEmail;
