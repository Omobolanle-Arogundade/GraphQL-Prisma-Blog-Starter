import bcrypt from "bcryptjs";

const hashPassword = async password => {
  const salt = bcrypt.genSaltSync(10);

  if (password.length < 8) {
    throw new Error("Password must be 8 characters or more!!");
  }

  return bcrypt.hash(password, salt);
};

export default hashPassword;
