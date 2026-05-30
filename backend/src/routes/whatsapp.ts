import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import fs from 'fs';

const router = Router();

// Import whatsapp-web.js dynamically/CommonJS to avoid compilation/typing issues
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');

let clientReady = false;
let clientStatus = 'loading'; // 'loading', 'qr_required', 'ready', 'disconnected'
let lastQrCode = '';

console.log('Initializing Free Background WhatsApp Gateway...');

// Standard Chrome/Edge installation paths on Windows
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let systemBrowserPath = '';
for (const path of chromePaths) {
  if (fs.existsSync(path)) {
    systemBrowserPath = path;
    break;
  }
}

const puppeteerOptions: any = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--no-zygote',
    '--single-process'
  ]
};

if (systemBrowserPath) {
  puppeteerOptions.executablePath = systemBrowserPath;
  console.log(`✓ Using system browser to launch Puppeteer: ${systemBrowserPath}`);
} else {
  console.log('⚠ System browser not found at standard paths. Falling back to default Puppeteer configuration.');
}

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth' // stores session in .wwebjs_auth folder in backend root
  }),
  puppeteer: puppeteerOptions
});

let lastQrPrintTime = 0;
const QR_PRINT_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes

client.on('qr', (qr: string) => {
  lastQrCode = qr;
  clientStatus = 'qr_required';
  clientReady = false;
  
  const now = Date.now();
  if (now - lastQrPrintTime >= QR_PRINT_THROTTLE_MS) {
    lastQrPrintTime = now;
    console.log('\n====================================================================');
    console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP APP (LINKED DEVICES) TO LOG IN:');
    console.log('====================================================================\n');
    qrcodeTerminal.generate(qr, { small: true });
    console.log('\n====================================================================\n');
  } else {
    console.log('[WhatsApp] QR code refreshed (new session token stored, scanner updated in frontend).');
  }
});

client.on('ready', () => {
  clientReady = true;
  clientStatus = 'ready';
  lastQrCode = '';
  console.log('====================================================================');
  console.log('✓ WhatsApp client is authenticated and fully ready in the background!');
  console.log('====================================================================');
});

client.on('authenticated', () => {
  console.log('✓ WhatsApp authentication was successful!');
});

client.on('auth_failure', (msg: any) => {
  clientReady = false;
  clientStatus = 'qr_required';
  console.error('✗ WhatsApp authentication failed:', msg);
});

client.on('disconnected', (reason: any) => {
  clientReady = false;
  clientStatus = 'disconnected';
  console.log('✗ WhatsApp client was disconnected:', reason);
  // Re-initialize safely in the background
  try {
    client.initialize().catch((e: any) => {
      console.warn('⚠ Handled background re-initialization disconnect error:', e.message);
    });
  } catch (e) {
    console.error('Error re-initializing WhatsApp client:', e);
  }
});

// Process-level error boundaries to isolate Puppeteer/WhatsApp crashes
process.on('unhandledRejection', (reason) => {
  const reasonStr = String(reason);
  if (reasonStr.includes('Puppeteer') || reasonStr.includes('whatsapp-web.js') || reasonStr.includes('ProtocolError') || reasonStr.includes('Runtime.callFunctionOn')) {
    console.warn('⚠ Handled WhatsApp background unhandled rejection:', reasonStr);
  } else {
    console.error('Unhandled Rejection:', reason);
  }
});

process.on('uncaughtException', (error) => {
  const errStr = String(error);
  if (errStr.includes('Puppeteer') || errStr.includes('whatsapp-web.js') || errStr.includes('ProtocolError') || errStr.includes('Runtime.callFunctionOn')) {
    console.warn('⚠ Handled WhatsApp background uncaught exception:', errStr);
  } else {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  }
});

// Initialize client safely
try {
  client.initialize().catch((error: any) => {
    console.warn('⚠ Handled WhatsApp background initialization error:', error.message);
    clientReady = false;
    clientStatus = 'disconnected';
  });
} catch (error) {
  console.error('Failed to initialize WhatsApp client:', error);
}

// Endpoint to check status of WhatsApp Client
router.get('/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  const qrCodeUrl = lastQrCode 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(lastQrCode)}` 
    : null;

  res.json({
    status: clientStatus,
    ready: clientReady,
    qrCodeUrl: qrCodeUrl
  });
});

// Endpoint to send WhatsApp message in the background
router.post('/send', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { phone, message, fileData, fileName, fileType } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    if (!clientReady) {
      return res.status(503).json({ 
        error: 'WhatsApp client is not ready. Please check linking status.',
        status: clientStatus
      });
    }

    // Clean phone number (leave only digits)
    let cleanedPhone = phone.replace(/[^0-9]/g, '');

    // Auto-prepend country code '91' if it's a 10-digit number
    if (cleanedPhone.length === 10) {
      cleanedPhone = '91' + cleanedPhone;
      console.log(`Auto-prepended country code '91' for 10-digit number: ${cleanedPhone}`);
    }

    // Dynamically resolve WhatsApp ID to handle standard formats and new LID formats
    console.log(`Resolving WhatsApp ID for ${cleanedPhone}...`);
    const numberId = await client.getNumberId(cleanedPhone);
    
    let whatsappId = '';
    if (numberId && numberId._serialized) {
      whatsappId = numberId._serialized;
      console.log(`✓ Resolved WhatsApp ID successfully: ${whatsappId}`);
    } else {
      // Fallback format
      whatsappId = `${cleanedPhone}@c.us`;
      console.log(`⚠ Could not resolve verified WhatsApp ID for ${cleanedPhone}. Using fallback: ${whatsappId}`);
    }

    if (fileData) {
      console.log(`Preparing WhatsApp media attachment: ${fileName || 'attachment'} (${fileType})...`);
      
      // Strip Data URI header if present
      let rawBase64 = fileData;
      if (fileData.includes(';base64,')) {
        rawBase64 = fileData.split(';base64,')[1];
      }

      const media = new MessageMedia(
        fileType || 'application/octet-stream',
        rawBase64,
        fileName || 'attachment'
      );

      console.log(`Sending background WhatsApp media to ${whatsappId}...`);
      await client.sendMessage(whatsappId, media, { caption: message });
    } else {
      console.log(`Sending background WhatsApp text-only message to ${whatsappId}...`);
      await client.sendMessage(whatsappId, message);
    }

    res.json({ 
      success: true, 
      message: 'WhatsApp message sent successfully in the background' 
    });
  } catch (error: any) {
    console.error('[WHATSAPP SEND] Error:', error);
    res.status(500).json({ 
      error: 'Failed to send WhatsApp message', 
      details: error.message 
    });
  }
});

export default router;
