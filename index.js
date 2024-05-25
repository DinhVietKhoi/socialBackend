/** @format */

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

/* SET UP */
const app = express();
dotenv.config();
app.use(
  cors({
    origin: "https://frontend-xh75.vercel.app",
    credentials: true,
  })
);
//Bảo mật
app.use(helmet());

//ghi lại thông tin tương tác
app.use(morgan("common"));

// Thiết lập giới hạn kích thước tối đa của yêu cầu
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());

/* ROUTES */
app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/posts", postRoutes);

/* MONGOOSE SETUP*/
const port = process.env.PORT || 6001;
const mongoUrl = process.env.MONGO_URL;

//Listen MongoDB to Server
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () =>
      console.log(`Máy chủ đang hoạt động tại cổng: ${port}`)
    );
  })
  .catch((errors) => {
    console.log(`${errors} lỗi kết nối máy chủ`);
  });
