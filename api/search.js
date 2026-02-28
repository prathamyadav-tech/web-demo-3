const products = [
  { id: 1, name: 'Vivo V30 Pro', category: 'Smartphones', desc: '50MP camera, 80W fast charging, AMOLED display', price: '₹36,955' },
  { id: 2, name: 'Vivo X100', category: 'Smartphones', desc: 'Zeiss optics, Dimensity 9300, 120W charging', price: '₹52,999' },
  { id: 3, name: 'HP EliteBook G40 Laptop', category: 'Laptops', desc: 'Intel i7, 16GB RAM, lightweight design', price: '₹205,334' },
  { id: 4, name: 'Wireless Pro Earbuds', category: 'Audio', desc: 'Active noise cancellation, 30hr battery', price: '₹2,500' },
  { id: 5, name: 'Smart Watch Elite', category: 'Wearables', desc: 'Health tracking, GPS, 7-day battery', price: '₹1,999' },
  { id: 6, name: 'Pro Tablet 12.9"', category: 'Tablets', desc: 'M2 chip, Liquid Retina XDR display', price: '₹39,999' }
];

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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const query = (req.query.q || '').trim().toLowerCase();

    if (!query) {
      return res.json({ success: true, products });
    }

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
}
