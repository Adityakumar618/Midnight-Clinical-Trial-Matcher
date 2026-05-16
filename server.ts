import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
// Replaced Gemini client with a lightweight GROQ-compatible placeholder.
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Read GROQ API key (if available). This server contains a safe
  // local fallback analysis so the app works without a remote AI key.
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  app.use(express.json());

  // Set up multer for memory storage
  const upload = multer({ storage: multer.memoryStorage() });

  // API Route for PDF bill upload and analysis
  app.post("/api/upload-bill", upload.single('bill'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log('Analyzing PDF bill...');

      // If a GROQ API key is configured, you could call the GROQ/remote
      // inference endpoint here. For safety in this demo repo we return
      // a deterministic mock analysis so the frontend can function.
      const mockAnalysis = {
        totalAmount: "$123.45",
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
        estimatedMonthlyIncome: "$3,200",
        estimatedMonthlyExpenses: "$1,800",
        rawTextSnippet: "Sample bill containing account and amount lines..."
      };

      res.json({ analysis: mockAnalysis });
    } catch (error) {
      console.error('PDF analysis error:', error);
      res.status(500).json({ error: "Failed to analyze PDF bill" });
    }
  });

  // API Route for credit score analysis (future AI feature)
  app.post("/api/analyze-credit", async (req, res) => {
    try {
      const { financialData } = req.body;
      // Mock analysis: real GROQ integration would call the external API
      // and return the model output. Keep a predictable response here.
      const summary = {
        summary: "Mock credit analysis: reported score is healthy for demo purposes.",
        details: {
          recommendedAction: "No action required",
          confidence: 0.74,
          inputSnapshot: financialData,
        }
      };
      res.json({ analysis: summary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to analyze credit data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
