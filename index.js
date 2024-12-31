import app from "./server.js";
import dotenv from "dotenv";
import task from "./tools/cron.js";
task.start();
dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
