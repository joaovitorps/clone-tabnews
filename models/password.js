import bcrypt from "bcryptjs";
import { createHmac } from "node:crypto";

// 4 rounds is the minimum for bcrypt: https://unix.stackexchange.com/a/776066
const getNumberOfRounds = process.env.NODE_ENV === "production" ? 14 : 4;

function pepperPassword(password) {
  const hmac = createHmac("sha256", process.env.PEPPER_SECRET);
  hmac.update(password);
  return hmac.digest("hex");
}

async function hash(password) {
  const spicyPass = pepperPassword(password);
  const salt = await bcrypt.genSalt(getNumberOfRounds);
  return await bcrypt.hash(spicyPass, salt);
}

function getRounds(password) {
  return bcrypt.getRounds(password);
}

async function compare(password, hashedPassword) {
  const spicyPass = pepperPassword(password);
  return await bcrypt.compare(spicyPass, hashedPassword);
}

const password = {
  hash,
  getRounds,
  getNumberOfRounds,
  compare,
};

export default password;
