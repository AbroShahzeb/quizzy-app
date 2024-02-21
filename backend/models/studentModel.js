import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    imgUrl: String,
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Provided email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Minimum length of password should be 6"],
    },
    joinedQuiz: {
      type: mongoose.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.matchPasswords = async function (password) {
  const arePasswordsEqual = await bcrypt.compare(password, this.password);
  return arePasswordsEqual;
};

const student = mongoose.model("Student", studentSchema);
export default student;
