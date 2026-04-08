import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API routes - add your own here
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Example API endpoint
app.get("/api/example", (req, res) => {
  res.json({ 
    message: "This is your API endpoint", 
    data: [1, 2, 3, 4, 5],
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
} else {
  // Development - Vite handles static files
  app.get("/", (req, res) => {
    res.json({ message: "Development server running" });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});