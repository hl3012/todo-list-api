import dotenv from "dotenv";
import { getApp } from "./app";

dotenv.config();
const app = getApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
