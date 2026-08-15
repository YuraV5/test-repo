import express, { type Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse incoming JSON payloads
app.use(express.json());

// Service routes
app.get("/health", (req, res: Response<{ status: string; timestamp: Date }>) => {
  res.json({ status: "UP", timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Service listening at http://localhost:${PORT}`);
});
