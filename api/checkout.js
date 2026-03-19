module.exports = function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, name, plan } = req.body;

    if (!email || !name) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

    console.log('✅ Checkout request:', email, name);

    // Return success immediately
    res.status(200).json({
      success: true,
      url: '/payment',
      sessionId: 'session_' + Date.now()
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
