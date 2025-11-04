import express from "express";
import fetch from "node-fetch";  

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON body
app.use(express.json());


const FIREBASE_URL = "https://water-district-b59bf-default-rtdb.asia-southeast1.firebasedatabase.app/sensors.json";

// === ROUTE TO RECEIVE DATA FROM AIR780E ===
app.post("/update", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data from Air780E:", data);

    // Forward to Firebase via HTTPS
    const fbResponse = await fetch(FIREBASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify(data),
    });

    if (fbResponse.ok) {
      console.log("✅ Data sent to Firebase successfully");
      res.status(200).send("OK");
    } else {
      console.error("❌ Firebase error:", await fbResponse.text());
      res.status(500).send("Firebase error");
    }
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).send("Server error");
  }
});

// === ROOT ROUTE (optional) ===
app.get("/", (req, res) => {
  res.send("Air780E Firebase Bridge is running 🚀");
});

// === START SERVER ===
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
