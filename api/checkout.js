import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, plan } = req.body;

    // Validate
    if (!email || !name) {
      return res.status(400).json({ error: 'Missing email or name' });
    }

    // Save to JSON file (in /tmp for Vercel)
    const leadsFile = path.join('/tmp', 'leads.json');
    let leads = [];

    try {
      if (fs.existsSync(leadsFile)) {
        const data = fs.readFileSync(leadsFile, 'utf8');
        leads = JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading leads:', e);
    }

    // Add new lead
    leads.push({
      email: email.trim(),
      name: name.trim(),
      plan: plan || 'basico',
      timestamp: new Date().toISOString()
    });

    // Write back
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    console.log('✅ Lead saved:', email);

    // Return success
    return res.status(200).json({
      success: true,
      url: '/payment',
      sessionId: 'session_' + Date.now()
    });

  } catch (error) {
    console.error('❌ Checkout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
