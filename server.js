const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');

function getMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMessage(name, email, message) {
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
}

const products = [
  { id: 1, name: 'Vivo V30 Pro', category: 'Smartphones', desc: '50MP camera, 80W fast charging, AMOLED display', price: '₹36,955' },
  { id: 2, name: 'Vivo X100', category: 'Smartphones', desc: 'Zeiss optics, Dimensity 9300, 120W charging', price: '₹52,999' },
  { id: 3, name: 'HP EliteBook G40 Laptop', category: 'Laptops', desc: 'Intel i7, 16GB RAM, lightweight design', price: '₹205,334' },
  { id: 4, name: 'Wireless Pro Earbuds', category: 'Audio', desc: 'Active noise cancellation, 30hr battery', price: '₹2,500' },
  { id: 5, name: 'Smart Watch Elite', category: 'Wearables', desc: 'Health tracking, GPS, 7-day battery', price: '₹1,999' },
  { id: 6, name: 'Pro Tablet 12.9"', category: 'Tablets', desc: 'M2 chip, Liquid Retina XDR display', price: '₹39,999' }
];

app.get('/api/search', (req, res) => {
  try {
    const query = (req.query.q || '').trim().toLowerCase();
    if (!query) return res.json({ success: true, products });
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query)
    );
    res.json({ success: true, products: filtered });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }
    saveMessage(name.trim(), email.trim(), message.trim());
    res.json({ success: true, message: "Message sent successfully! We'll get back to you soon." });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ success: false, error: 'Failed to save message. Please try again.' });
  }
});

// Serve static files (index.html, scripts, styles)
app.use(express.static(process.cwd()));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
