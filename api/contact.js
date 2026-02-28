const fs = require('fs');
const path = require('path');

const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');

// Load or create messages file
function getMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMessage(name, email, message) {
  try {
    const messages = getMessages();
    const newMsg = {
      id: messages.length + 1,
      name,
      email,
      message,
      created_at: new Date().toISOString()
    };
    messages.push(newMsg);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    return newMsg;
  } catch (err) {
    console.error('Failed to save message:', err);
    throw err;
  }
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    saveMessage(name.trim(), email.trim(), message.trim());

    res.json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.'
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to save message. Please try again.'
    });
  }
}
