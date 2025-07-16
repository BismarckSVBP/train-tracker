import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import data from "./routes/route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [/\.vercel\.app$/];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS Request from:", origin);

      if (!origin || allowedOrigins.some((domain) => origin.match(domain))) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/", data);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
