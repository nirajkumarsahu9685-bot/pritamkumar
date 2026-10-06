import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '1mb' }));

// Helper local heuristic analyzer in case GEMINI_API_KEY is not configured or rate-limited
function fallbackAnalyze(message: string) {
  const lower = message.toLowerCase();

  const hasSensitiveData = Boolean(
    /\b(otp|one[- ]time[- ]password|verification code)\b\s*[:=-]?\s*\d{3,8}/i.test(message) ||
    /\b(upi[- ]pin|mpin|atm[- ]pin|card[- ]pin)\b/i.test(message) ||
    /\b(password|passwd|passcode)\b\s*[:=-]?\s*\S+/i.test(message) ||
    /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/.test(message)
  );

  if (
    (lower.includes('won') || lower.includes('winner') || lower.includes('congratulations') || lower.includes('lottery') || lower.includes('prize')) &&
    (lower.includes('fee') || lower.includes('processing') || lower.includes('claim') || lower.includes('pay'))
  ) {
    return {
      riskLevel: 'HIGH',
      riskScore: 92,
      category: 'Lottery Scam',
      summary: 'This message contains classic advance-fee lottery scam patterns demanding upfront payment to claim a fictitious reward.',
      warningSigns: [
        'Unsolicited announcement of winning prize money',
        'Requirement to pay an upfront processing or claim fee',
        'Emotional lure designed to bypass critical thinking',
        'Artificial urgency to claim before expiration'
      ],
      recommendedActions: [
        'Do not pay any fee or transfer money to claim winnings',
        'Legitimate lotteries never require an upfront processing charge',
        'Block and report the sender number immediately',
        'Never disclose banking credentials or card details'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  if (
    (lower.includes('kyc') || lower.includes('blocked') || lower.includes('suspended') || lower.includes('deactivated')) &&
    (lower.includes('bank') || lower.includes('account') || lower.includes('verify') || lower.includes('pan') || lower.includes('immediately'))
  ) {
    return {
      riskLevel: 'HIGH',
      riskScore: 94,
      category: 'KYC Scam / Phishing',
      summary: 'This message exhibits extreme urgency threatening account suspension, a textbook tactic of bank impersonation fraud.',
      warningSigns: [
        'Urgent threat of immediate bank account deactivation or freeze',
        'Coercive demand to complete KYC via unofficial SMS or link',
        'High-pressure fear tactic to prompt hasty compliance',
        'Impersonation of a financial institution'
      ],
      recommendedActions: [
        'Do not click embedded links or call the sender number',
        'Never share net banking passwords, OTPs, or UPI PINs',
        'Official banks do not request KYC updates over informal text messages',
        'Log in solely via your official banking app or visit the nearest branch'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  if (
    (lower.includes('job') || lower.includes('work from home') || lower.includes('part-time') || lower.includes('selected for')) &&
    (lower.includes('pay') || lower.includes('fee') || lower.includes('registration') || lower.includes('per month') || lower.includes('daily'))
  ) {
    return {
      riskLevel: 'HIGH',
      riskScore: 88,
      category: 'Job Scam',
      summary: 'This message exhibits characteristic signs of a recruitment scam offering outsized pay while asking for advance registration fees.',
      warningSigns: [
        'Disproportionately high pay for minimal, undefined tasks',
        'Unsolicited job offer without formal interview or application',
        'Demand for upfront registration, training, or deposit fee',
        'Communication conducted through informal chat channels'
      ],
      recommendedActions: [
        'Never pay money to obtain employment or interview slots',
        'Legitimate employers do not ask candidates for registration fees',
        'Verify job postings directly on official company careers pages',
        'Do not submit personal identity cards or bank statements'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  const urgencyWords = ['urgent', 'immediately', 'expires', 'last chance', 'warning', 'action required'];
  const credentialWords = ['otp', 'password', 'upi pin', 'cvv', 'card details', 'passcode'];
  const moneyWords = ['wire', 'gift card', 'pay now', 'cashback', 'refund'];

  const hasUrgency = urgencyWords.some(w => lower.includes(w));
  const hasCreds = credentialWords.some(w => lower.includes(w));
  const hasMoney = moneyWords.some(w => lower.includes(w));

  if (hasCreds || (hasUrgency && hasMoney)) {
    return {
      riskLevel: 'HIGH',
      riskScore: 85,
      category: 'Phishing',
      summary: 'This message combines high urgency with requests for financial transactions or sensitive credentials.',
      warningSigns: [
        'Uses urgent or threatening language',
        'Requests sensitive verification or payment actions',
        'Contains suspicious unverified requests'
      ],
      recommendedActions: [
        'Do not click suspicious links or call back the sender',
        'Never share OTPs, passwords, or UPI PINs with anyone',
        'Verify the sender through an independently verified official source'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  if (hasUrgency || hasMoney) {
    return {
      riskLevel: 'MEDIUM',
      riskScore: 48,
      category: 'Suspicious Communication',
      summary: 'This message contains elements of urgency or payment terms that warrant caution and independent verification.',
      warningSigns: [
        'Urgent or time-pressured phrasing',
        'References to transactional actions or account reviews'
      ],
      recommendedActions: [
        'Exercise caution before responding or taking transactional action',
        'Confirm the legitimacy of the sender through official channels',
        'Do not disclose private financial or personal details'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  return {
    riskLevel: 'LOW',
    riskScore: 12,
    category: 'Normal Message',
    summary: 'No recognized scam indicators, urgent financial demands, or credential requests were found in this message.',
    warningSigns: [
      'No coercive urgency detected',
      'No unsolicited financial demands found',
      'No requests for sensitive passwords, OTPs, or banking PINs'
    ],
    recommendedActions: [
      'Continue following standard personal safety practices',
      'Always exercise general caution if the sender later requests money or passwords',
      'Remember that reputable services never ask for your confidential PINs'
    ],
    hasSensitiveData,
    isDemo: true
  };
}

// POST /api/analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message exceeds 5,000 characters limit.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('No GEMINI_API_KEY present in environment, running demo analyzer.');
      const result = fallbackAnalyze(message);
      return res.json(result);
    }

    try {
      const ai = new GoogleGenAI();
      const prompt = `Analyze the following message for scam indicators, fraud patterns, phishing, advance-fee scams, fake job offers, bank/KYC impersonation, fake lotteries, courier scams, urgency manipulation, or requests for sensitive credentials.\n\nMessage to evaluate:\n"""\n${message.slice(0, 5000)}\n"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are SafeCheck AI, an expert cybersecurity scam detection assistant.
Your goal is to evaluate suspicious SMS, WhatsApp messages, emails, job offers, investment offers, bank alerts, and courier notifications.
Safety and quality rules:
1. NEVER tell users that a message is "100% safe" or "100% scam". Always use nuanced phrases like "Potential scam", "High risk", "Suspicious", "Likely fraudulent", or "Low risk - No obvious scam patterns detected".
2. Score risk from 0 to 100:
   - 0-29: LOW risk (everyday conversational messages, expected notifications without phishing indicators)
   - 30-59: MEDIUM risk (vague requests, unsolicited links, moderate urgency, delivery notices needing confirmation)
   - 60-100: HIGH risk (demands for upfront fees, lottery winnings, threats of immediate bank block or KYC freeze, requests for OTPs/passwords/UPI PINs, job registration fees, impersonation)
3. Ensure riskLevel accurately reflects the riskScore:
   - 0-29: "LOW"
   - 30-59: "MEDIUM"
   - 60-100: "HIGH"
4. Check if the message contains sensitive credentials (OTP, passwords, UPI PIN, credit card numbers). Set hasSensitiveData to true if so.
5. Provide:
   - riskLevel: "LOW" | "MEDIUM" | "HIGH"
   - riskScore: integer (0 to 100)
   - category: concise category (e.g., "Lottery Scam", "KYC Scam / Phishing", "Job Scam", "Investment Scam", "Courier Impersonation", "Phishing", "Normal Message")
   - summary: 1-2 clear, professional sentences explaining the assessment.
   - warningSigns: list of 2-5 specific warning signs observed in the message.
   - recommendedActions: list of 2-5 actionable safety steps.
   - hasSensitiveData: boolean`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
              riskScore: { type: Type.INTEGER },
              category: { type: Type.STRING },
              summary: { type: Type.STRING },
              warningSigns: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              hasSensitiveData: { type: Type.BOOLEAN },
            },
            required: ['riskLevel', 'riskScore', 'category', 'summary', 'warningSigns', 'recommendedActions', 'hasSensitiveData'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      const parsedData = JSON.parse(responseText);

      // Clamp riskScore
      const score = Math.max(0, Math.min(100, Number(parsedData.riskScore) || 50));
      let level = parsedData.riskLevel;
      if (score <= 29) level = 'LOW';
      else if (score <= 59) level = 'MEDIUM';
      else level = 'HIGH';

      return res.json({
        riskLevel: level,
        riskScore: score,
        category: parsedData.category || 'General Assessment',
        summary: parsedData.summary || 'Assessment completed.',
        warningSigns: Array.isArray(parsedData.warningSigns) ? parsedData.warningSigns : [],
        recommendedActions: Array.isArray(parsedData.recommendedActions) ? parsedData.recommendedActions : [],
        hasSensitiveData: Boolean(parsedData.hasSensitiveData),
        isDemo: false,
      });
    } catch (aiError) {
      console.warn('Gemini API call failed, using robust fallback analyzer:', aiError);
      const fallbackResult = fallbackAnalyze(message);
      return res.json(fallbackResult);
    }
  } catch (error) {
    console.error('API Error in /api/analyze:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Setup Vite dev middleware or serve static dist in production
async function startServer() {
  if (!isProd) {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SafeCheck AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
