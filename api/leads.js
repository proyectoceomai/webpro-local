import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const leadsFile = path.join('/tmp', 'leads.json');
    
    if (fs.existsSync(leadsFile)) {
      const data = fs.readFileSync(leadsFile, 'utf8');
      return res.status(200).send(data);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error reading leads:', error);
    return res.status(500).json([]);
  }
}
