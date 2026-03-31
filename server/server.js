import dotenv from "dotenv";
const envResult = dotenv.config();
if (envResult.error) {
  console.error("Dotenv Error:", envResult.error);
}
console.log("Dotenv loaded from:", envResult.parsed ? "parsed" : "not parsed");
console.log("MONGO_URI value:", process.env.MONGO_URI ? "Found" : "Missing");

import app from "./app.js";
import connectDB from "./config/db.js";

// Connect to DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server Synchronized: http://localhost:${PORT}\n`);
});
