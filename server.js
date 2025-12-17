// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import morgan from "morgan";
// import dotenv from "dotenv";
// // this is updated code 

// import spaRoutes from "./routes/spas.js";
// import leadRoutes from "./routes/leads.js";
// import authRoutes from "./routes/auth.js";
// import { ensureDefaultAdmin } from "./utils/seedAdmin.js";

// dotenv.config();

// const app = express();
// app.use(express.static('public'));
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//   ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
//   : ["*"];

// app.use(
//   cors({
//     origin: allowedOrigins.includes("*") ? true : allowedOrigins,
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(morgan("dev"));

// app.get("/health", (_req, res) => {
//   res.json({ status: "ok" });
// });

// app.use("/api/spas", spaRoutes);
// app.use("/api/leads", leadRoutes);
// app.use("/api/auth", authRoutes);

// app.use((err, _req, res, _next) => {
//   console.error(err);
//   const status = err.status || 500;
//   res.status(status).json({
//     message: err.message || "Internal server error",
//   });
// });

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/spa-bot";
// console.log("Using MONGO_URI:", MONGO_URI);

// // Force connection to spa-bot database
// mongoose
//   .connect("mongodb://localhost:27017/spa-bot", { autoIndex: true })
//   .then(async () => {
//     console.log("MongoDB connected successfully");
//     console.log("Database name:", mongoose.connection.db.databaseName);
//     console.log("Connection readyState:", mongoose.connection.readyState);
//     await ensureDefaultAdmin();
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error("Mongo connection error", error);
//     process.exit(1);
//   });








import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import spaRoutes from "./routes/spas.js";
import leadRoutes from "./routes/leads.js";
import authRoutes from "./routes/auth.js";
import { ensureDefaultAdmin } from "./utils/seedAdmin.js";

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */

app.use(express.json());
app.use(express.static("public"));
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : true,
    credentials: true,
  })
);

/* =======================
   ROUTES
======================= */

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/spas", spaRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

/* =======================
   ERROR HANDLER
======================= */

app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

/* =======================
   SERVER & DATABASE
======================= */

const PORT = process.env.PORT || 5000;

/**
 * ❗ PRODUCTION RULE
 * Never hardcode credentials in code
 */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");
    console.log(
      "📦 Database:",
      mongoose.connection.db.databaseName
    );

    await ensureDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed");
    console.error(error);
    process.exit(1);
  });

