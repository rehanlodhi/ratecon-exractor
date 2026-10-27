import express, { Request, Response } from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;
const FASTAPI_URL = 'http://127.0.0.1:8000';

// Body parsers with large limit for PDF payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer storage in memory for uploaded PDF files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

// Launch Python FastAPI backend daemon
let pythonProcess: ChildProcess | null = null;
function ensureFastApiDaemon() {
  try {
    const extendedPath = `/root/.local/bin:${process.env.PATH || ''}`;
    pythonProcess = spawn('python3', ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'], {
      env: { ...process.env, PATH: extendedPath },
      stdio: 'inherit',
    });

    pythonProcess.on('error', (err) => {
      console.warn('FastAPI process error (falling back to embedded engine):', err.message);
    });

    pythonProcess.on('exit', (code) => {
      console.log(`FastAPI process exited with code ${code}`);
    });
  } catch (e: any) {
    console.warn('Failed to start FastAPI sub-process:', e.message);
  }
}

ensureFastApiDaemon();

// Cleanup on exit
process.on('SIGINT', () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit(0);
});
process.on('SIGTERM', () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit(0);
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const EXTRACTION_PROMPT = `
You are an expert logistics and freight document analyzer. 
Analyze the attached Rate Confirmation (Rate Con / Load Tender / Carrier Confirmation) PDF or document image and extract the key details into the specified JSON format.
Be rigorous with data extraction:
- load_number: The unique broker load, tender, or confirmation reference number.
- broker: company name, dispatch email, direct or main phone number.
- carrier: assigned trucking company name, Motor Carrier MC#, USDOT#.
- equipment_type: e.g., 53' Dry Van, 53' Reefer, Flatbed, Stepdeck, Power Only, Straight Truck.
- total_rate: numeric total agreed compensation (e.g. 2850.00). Do not include currency symbols in the number.
- currency: usually "USD" or "CAD".
- weight: cargo weight including unit (e.g., "41,500 lbs").
- stops: in sequential itinerary order (stop 1, 2, ...). Classify each stop as either "PICKUP" or "DELIVERY". Include facility name, street address, city, state, zip, appointment date, appointment time/window, and any special notes (e.g. strict appointment, gate code, PPE requirements).
- special_instructions: array of important requirements (e.g., detention policy, tracking requirement, temperature recorder, no double brokering, lumper reimbursement rules).
`;

const rateConSchema = {
  type: Type.OBJECT,
  properties: {
    load_number: { type: Type.STRING },
    broker: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        contact_email: { type: Type.STRING },
        contact_phone: { type: Type.STRING },
      },
      required: ["name"],
    },
    carrier: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        mc_number: { type: Type.STRING },
        dot_number: { type: Type.STRING },
      },
      required: ["name"],
    },
    equipment_type: { type: Type.STRING },
    total_rate: { type: Type.NUMBER },
    currency: { type: Type.STRING },
    weight: { type: Type.STRING },
    stops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          stop_number: { type: Type.INTEGER },
          facility_name: { type: Type.STRING },
          address: { type: Type.STRING },
          appointment_date: { type: Type.STRING },
          appointment_time: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ["type", "stop_number", "facility_name", "address"],
      },
    },
    special_instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["load_number", "broker", "carrier", "equipment_type", "total_rate", "currency", "stops"],
};

// Health endpoint - queries FastAPI or reports backend status
app.get('/api/health', async (_req: Request, res: Response) => {
  let fastApiStatus = 'offline';
  try {
    const resp = await fetch(`${FASTAPI_URL}/api/health`, { signal: AbortSignal.timeout(1500) });
    if (resp.ok) {
      fastApiStatus = 'online';
    }
  } catch {
    fastApiStatus = 'starting';
  }

  res.json({
    status: 'ok',
    backend: 'FastAPI (Python) + Express Proxy',
    fastApiStatus,
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    model: 'gemini-3.8-flash',
  });
});

// Proxy to Python FastAPI backend
app.post('/api/extract-rate-con', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let base64Data = '';
    let mimeType = 'application/pdf';
    let fileName = 'rate_confirmation.pdf';
    let rawText = '';

    if (req.file) {
      base64Data = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype || 'application/pdf';
      fileName = req.file.originalname || fileName;
    } else if (req.body && req.body.base64Data) {
      base64Data = req.body.base64Data;
      mimeType = req.body.mimeType || 'application/pdf';
      fileName = req.body.fileName || fileName;
    } else if (req.body && req.body.rawText) {
      rawText = req.body.rawText;
    }

    // Try sending to Python FastAPI first
    try {
      const fastApiResp = await fetch(`${FASTAPI_URL}/api/extract-rate-con`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data,
          mimeType,
          fileName,
          rawText,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (fastApiResp.ok) {
        const data = await fastApiResp.json();
        return res.json(data);
      }
    } catch (fastApiErr) {
      console.warn('FastAPI request failed or timed out, executing direct Gemini SDK:', fastApiErr);
    }

    // Direct Gemini fallback
    if (rawText) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [EXTRACTION_PROMPT, `Document text:\n${rawText}`],
        config: {
          responseMimeType: 'application/json',
          responseSchema: rateConSchema,
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      parsed.fileName = 'raw_document_input.txt';
      return res.json(parsed);
    }

    if (!base64Data) {
      return res.status(400).json({ error: 'No document data provided.' });
    }

    const pdfPart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [EXTRACTION_PROMPT, pdfPart],
      config: {
        responseMimeType: 'application/json',
        responseSchema: rateConSchema,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.fileName = fileName;
    return res.json(parsed);

  } catch (error: any) {
    console.error('Extraction error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to extract rate confirmation details.',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
