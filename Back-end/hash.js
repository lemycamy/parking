import bcrypt from "bcryptjs";

async function run() {
  const password = "lyle123";
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashed);

  const isMatch = await bcrypt.compare("lyle123", hashed);
  console.log("Password match?", isMatch);
}

run();
