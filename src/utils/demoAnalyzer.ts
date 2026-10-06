import { AnalysisResponse, RiskLevel } from '../types/analysis';

/**
 * Checks if a message appears to contain sensitive information like OTPs, passwords, or PINs.
 */
export function detectSensitiveInformation(message: string): boolean {
  const sensitivePatterns = [
    /\b(otp|one[- ]time[- ]password|verification code)\b\s*[:=-]?\s*\d{3,8}/i,
    /\b(upi[- ]pin|mpin|atm[- ]pin|card[- ]pin)\b/i,
    /\b(password|passwd|passcode|secret pin)\b\s*[:=-]?\s*\S+/i,
    /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // 16 digit card number
    /\bcvv\b\s*[:=-]?\s*\d{3,4}/i,
  ];

  return sensitivePatterns.some((pattern) => pattern.test(message));
}

/**
 * Redacts sensitive credentials (OTPs, PINs, passwords) to protect user privacy in storage.
 */
export function sanitizeMessageForStorage(message: string): string {
  let cleaned = message;
  // Redact OTP codes
  cleaned = cleaned.replace(/\b(otp|code)\s*[:=-]?\s*(\d{4,8})\b/gi, '$1: [REDACTED]');
  // Redact passwords
  cleaned = cleaned.replace(/\b(password|passcode)\s*[:=-]?\s*(\S+)\b/gi, '$1: [REDACTED]');
  // Redact 16-digit card numbers
  cleaned = cleaned.replace(/\b(\d{4})[- ]?(\d{4})[- ]?(\d{4})[- ]?(\d{4})\b/g, '****-****-****-$4');
  // Redact PIN references
  cleaned = cleaned.replace(/\b(pin|mpin)\s*[:=-]?\s*(\d{4,6})\b/gi, '$1: [REDACTED]');
  return cleaned;
}

/**
 * Local rule-based analyzer for offline/demo operation when AI API is not reachable.
 */
export function analyzeMessageLocally(rawMessage: string): AnalysisResponse {
  const message = rawMessage.trim();
  const lower = message.toLowerCase();
  const hasSensitiveData = detectSensitiveInformation(message);

  // Example 1: Lottery / Prize / Won Scam
  if (
    (lower.includes('won') || lower.includes('winner') || lower.includes('congratulations') || lower.includes('lottery') || lower.includes('prize')) &&
    (lower.includes('fee') || lower.includes('processing') || lower.includes('claim') || lower.includes('pay') || lower.includes('transfer'))
  ) {
    return {
      riskLevel: 'HIGH',
      riskScore: 92,
      category: 'Lottery Scam',
      summary: 'This message presents hallmark indicators of an advance-fee lottery scam, demanding an upfront payment to claim an alleged reward.',
      warningSigns: [
        'Unsolicited announcement of winning money or a prize',
        'Requirement to pay a processing or registration fee upfront',
        'Emotional lure using artificial excitement and large sums',
        'Suspicious demand for immediate payment to claim funds'
      ],
      recommendedActions: [
        'Do not pay any fee or transfer money to claim winnings',
        'Legitimate lotteries and sweepstakes never require an upfront fee',
        'Block and report the sender immediately',
        'Never share bank account details or card information'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  // Example 2: Bank / Account Blocked / KYC Scam
  if (
    (lower.includes('kyc') || lower.includes('blocked') || lower.includes('suspended') || lower.includes('deactivated') || lower.includes('freeze')) &&
    (lower.includes('bank') || lower.includes('account') || lower.includes('verify') || lower.includes('update') || lower.includes('pan') || lower.includes('immediately') || lower.includes('today'))
  ) {
    return {
      riskLevel: 'HIGH',
      riskScore: 95,
      category: 'KYC Scam / Phishing',
      summary: 'This message exhibits extreme urgency threatening account deactivation or banking blocks, a signature tactic of bank impersonation fraud.',
      warningSigns: [
        'Urgent threat of immediate bank account suspension or freeze',
        'Coercive call to update KYC credentials via unofficial channels',
        'High pressure tactics to bypass standard security thinking',
        'Impersonation of trusted financial banking institutions'
      ],
      recommendedActions: [
        'Do not click any embedded links or call the number in the SMS',
        'Never share net banking passwords, OTPs, or UPI PINs',
        'Banks never ask to complete KYC over informal messages',
        'Visit your bank branch directly or use the official mobile banking app'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  // Example 3: Work from Home / Job Scam
  if (
    (lower.includes('job') || lower.includes('work from home') || lower.includes('part-time') || lower.includes('daily income') || lower.includes('selected for')) &&
    (lower.includes('pay') || lower.includes('fee') || lower.includes('registration') || lower.includes('deposit') || lower.includes('per month') || lower.includes('per day'))
  ) {
    return {
      riskLevel: 'HIGH',
      riskScore: 88,
      category: 'Job Scam',
      summary: 'This message contains classic traits of a recruitment scam offering unrealistic compensation while requiring an advance registration fee.',
      warningSigns: [
        'Unrealistic compensation for minimal or undefined tasks',
        'Unsolicited job offer without formal interview or application',
        'Demand for upfront registration, equipment, or training fees',
        'Use of informal communication channels for official employment'
      ],
      recommendedActions: [
        'Never pay money to secure a job or interview',
        'Legitimate employers never charge candidates a registration fee',
        'Verify company vacancies directly on their verified careers portal',
        'Refrain from sharing personal identification or financial documents'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  // Investment / Crypto Scams
  if (
    (lower.includes('crypto') || lower.includes('invest') || lower.includes('guaranteed return') || lower.includes('double your money') || lower.includes('trading signal')) &&
    (lower.includes('profit') || lower.includes('deposit') || lower.includes('earn'))
  ) {
    return {
      riskLevel: 'HIGH',
      riskScore: 91,
      category: 'Investment Scam',
      summary: 'This message guarantees high financial returns with little to no risk, which is a strong indicator of fraudulent investment schemes.',
      warningSigns: [
        'Promises of guaranteed returns or rapid wealth generation',
        'Pressure to deposit funds or cryptocurrency immediately',
        'Lack of registration with financial regulatory authorities',
        'High-pressure persuasion tactics'
      ],
      recommendedActions: [
        'Never transfer funds to unregulated trading platforms or individuals',
        'Remember that guaranteed returns are universally a fraud red flag',
        'Consult certified financial advisors before any investment',
        'Block and report the sender'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  // Courier / Delivery Scams
  if (
    (lower.includes('courier') || lower.includes('package') || lower.includes('parcel') || lower.includes('delivery') || lower.includes('fedex') || lower.includes('dhl') || lower.includes('post')) &&
    (lower.includes('address') || lower.includes('failed') || lower.includes('reschedule') || lower.includes('customs') || lower.includes('pending') || lower.includes('fee'))
  ) {
    return {
      riskLevel: 'MEDIUM',
      riskScore: 58,
      category: 'Courier Impersonation',
      summary: 'This message resembles common delivery phishing attempts claiming failed shipment delivery to solicit personal details or payment.',
      warningSigns: [
        'Notice of undelivered package without tracking number verification',
        'Vague sender identity mimicking major parcel carriers',
        'Request to update personal address or pay redelivery fees'
      ],
      recommendedActions: [
        'Do not click links to reschedule delivery or pay unexpected fees',
        'Track shipments directly on official courier website using tracking ID',
        'Check your official purchase order history on e-commerce accounts'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  // General Warning Indicators (Medium risk check)
  const urgencyKeywords = ['urgent', 'immediately', 'expires today', 'action required', 'limited time', 'last chance', 'within 24 hours', 'alert'];
  const credentialKeywords = ['password', 'otp', 'upi pin', 'login credentials', 'security code', 'cvv', 'card details'];
  const monetaryKeywords = ['wire transfer', 'gift card', 'pay now', 'claim money', 'cashback', 'refund'];

  const hasUrgency = urgencyKeywords.some(k => lower.includes(k));
  const hasCredentials = credentialKeywords.some(k => lower.includes(k));
  const hasMonetary = monetaryKeywords.some(k => lower.includes(k));

  if (hasCredentials) {
    return {
      riskLevel: 'HIGH',
      riskScore: 84,
      category: 'Phishing / Credential Harvesting',
      summary: 'This message solicits private security credentials, which legitimate institutions never request via unverified communication.',
      warningSigns: [
        'Direct or implied request for passwords, PINs, or security codes',
        'Potential attempt at credential harvesting or account takeover',
        'Unverified sender seeking privileged security access'
      ],
      recommendedActions: [
        'Never disclose OTPs, passwords, or UPI PINs under any circumstance',
        'Immediately change passwords if you previously shared information',
        'Report the suspicious communication to your bank or service provider'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  if (hasUrgency && hasMonetary) {
    return {
      riskLevel: 'HIGH',
      riskScore: 78,
      category: 'Potential Financial Scam',
      summary: 'This message combines intense time pressure with monetary transactions, a typical formula used to prompt hasty decisions.',
      warningSigns: [
        'Artificial urgency designed to prompt swift, unverified action',
        'Direct mention of financial transfers, refunds, or payments',
        'Unverified origin requesting transactional cooperation'
      ],
      recommendedActions: [
        'Pause and independently verify the message before sending funds',
        'Contact the purported sender via officially listed contact numbers',
        'Avoid making rushed financial decisions under time pressure'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  if (hasUrgency || hasMonetary) {
    return {
      riskLevel: 'MEDIUM',
      riskScore: 46,
      category: 'Suspicious Communication',
      summary: 'This message contains elements of urgency or payment language that warrant caution and independent verification.',
      warningSigns: [
        'Time-sensitive phrasing urging quick response',
        'References to transactional actions or account modifications'
      ],
      recommendedActions: [
        'Carefully verify the identity of the sender before responding',
        'Do not click unverified links or dial unfamiliar phone numbers',
        'Confirm requests through a known, trusted communication channel'
      ],
      hasSensitiveData,
      isDemo: true
    };
  }

  // Example 4: Normal Message
  return {
    riskLevel: 'LOW',
    riskScore: 12,
    category: 'Normal Message',
    summary: 'No common scam indicators, threats, urgent payment requests, or credential solicitations were identified in this message.',
    warningSigns: [
      'No coercive urgency detected',
      'No unsolicited financial demands found',
      'No requests for sensitive passwords, OTPs, or banking PINs'
    ],
    recommendedActions: [
      'Continue following standard personal safety habits',
      'Always exercise general caution if the sender asks for personal info later',
      'Remember that legitimate contacts will never ask for your confidential PINs'
    ],
    hasSensitiveData,
    isDemo: true
  };
}

/**
 * Maps risk score to Level according to specification:
 * 0-29: LOW
 * 30-59: MEDIUM
 * 60-100: HIGH
 */
export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score <= 29) return 'LOW';
  if (score <= 59) return 'MEDIUM';
  return 'HIGH';
}
