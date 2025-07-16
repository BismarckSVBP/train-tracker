import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getTrainDetails = (train_no) => {
  try {
    const filePath = path.join(__dirname, "../public/trains.json");

    const data = fs.readFileSync(filePath, "utf8");
    const trains = JSON.parse(data);

    if (trains[train_no]) {
      return trains[train_no];
    } else {
      return { error: "Train not found" };
    }
  } catch (error) {
    return { error: "Error reading JSON file", details: error.message };
  }
};
