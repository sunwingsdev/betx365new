const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { upload, deleteFile } = require("./utils");

// import API modules
const usersApi = require("./apis/usersApi/usersApi");
const homeControlApi = require("./apis/homeControlApi/homeControlApi");
const colorControlApi = require("./apis/colorControlApi/colorControlApi");
const gameApi = require("./apis/gameApi/gameApi");
const depositApi = require("./apis/depsoitsApi/depsoitsApi");
const withdrawApi = require("./apis/withdrawApi/withdrawApi");
const paymentMethodApi = require("./apis/paymentMethodApi/paymentMethodApi");

const port = process.env.PORT || 5000;

// CORS configuration
const corsConfig = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    `https://${process.env.SITE_URL}`,
    `http://${process.env.SITE_URL}`,
    `http://www.${process.env.SITE_URL}`,
    `www.${process.env.SITE_URL}`,
    `${process.env.SITE_URL}`,
    "*",
  ],
  credentials: true,
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// middlewares
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

// MongoDB URI and client setup
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes for image upload and delete
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/uploads/images/${req.file.filename}`,
  });
});

app.delete("/delete", async (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: "File path not provided" });
  }

  try {
    await deleteFile(filePath);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// MongoDB connection and API setup
async function run() {
  try {
    await client.connect();

    // Collections
    const usersCollection = client.db("baji").collection("users");
    const homeControlsCollection = client.db("baji").collection("homeControls");
    const colorControlsCollection = client
      .db("baji")
      .collection("colorControls");
    const gamesCollection = client.db("baji").collection("games");
    const depositsCollection = client.db("baji").collection("deposits");
    const withdrawsCollection = client.db("baji").collection("withdraws");
    const paymentMethodsCollection = client
      .db("baji")
      .collection("paymentMethods");

    // API routes
    app.use("/users", usersApi(usersCollection));
    app.use("/home-controls", homeControlApi(homeControlsCollection));
    app.use("/color-controls", colorControlApi(colorControlsCollection));
    app.use("/games", gameApi(gamesCollection));
    app.use("/deposits", depositApi(depositsCollection, usersCollection));
    app.use("/withdraws", withdrawApi(withdrawsCollection, usersCollection));
    app.use("/paymentmethod", paymentMethodApi(paymentMethodsCollection));

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!!!✅");
  } finally {
    // Leave client open for now (close manually if needed)
  }
}
run().catch(console.dir);

// Basic route
app.get("/", (req, res) => {
  res.send("Server is Running.");
});

app.listen(port, () => {
  console.log(`Server is Running on PORT:🆗 ${port}`);
});
