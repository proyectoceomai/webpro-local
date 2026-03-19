const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve HTML files
  if (req.method === 'GET') {
    let htmlFile = null;
    
    if (pathname === '/' || pathname === '/index.html') htmlFile = 'index.html';
    else if (pathname === '/electricista') htmlFile = 'electricista.html';
    else if (pathname === '/plomero') htmlFile = 'plomero.html';
    else if (pathname === '/inmobiliario') htmlFile = 'inmobiliario.html';
    else if (pathname === '/blog') htmlFile = 'blog.html';
    else if (pathname === '/monitoring') htmlFile = 'monitoring-dashboard.html';
    else if (pathname === '/dashboard') htmlFile = 'dashboard.html';
    else if (pathname === '/payment') htmlFile = 'payment.html';
    
    if (htmlFile) {
      const filePath = path.join(__dirname, htmlFile);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
      return;
    }
    
    // XML/TXT files
    if (pathname === '/sitemap.xml') {
      const sitemapPath = path.join(__dirname, 'sitemap.xml');
      fs.readFile(sitemapPath, (err, data) => {
        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.end(err ? '<?xml version="1.0"?><urlset></urlset>' : data);
      });
      return;
    }
    
    if (pathname === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('User-agent: *\nAllow: /');
      return;
    }
    
    // API endpoints
    if (pathname === '/api/leads') {
      const leadsFile = path.join(__dirname, 'leads.json');
      fs.readFile(leadsFile, (err, data) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data || '[]');
      });
      return;
    }
  }

  // POST endpoints
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      if (pathname === '/capture-lead') {
        try {
          const data = JSON.parse(body);
          const leadsFile = path.join(__dirname, 'leads.json');
          
          fs.readFile(leadsFile, (err, fileData) => {
            let leads = [];
            if (!err && fileData) {
              try { leads = JSON.parse(fileData); } catch(e) {}
            }
            
            leads.push({
              ...data,
              timestamp: new Date().toISOString()
            });
            
            fs.writeFile(leadsFile, JSON.stringify(leads, null, 2), () => {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            });
          });
        } catch(e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
        return;
      }
      
      if (pathname === '/create-checkout-session') {
        try {
          const data = JSON.parse(body);
          const email = String(data.email || 'unknown@webpro.local').trim();
          const name = String(data.name || 'Customer').trim();
          
          console.log('✅ Checkout request:', email, name);
          
          // Save lead
          const leadsFile = path.join(__dirname, 'leads.json');
          fs.readFile(leadsFile, (err, fileData) => {
            let leads = [];
            if (!err && fileData) {
              try { leads = JSON.parse(fileData); } catch(e) {}
            }
            
            leads.push({
              email: email,
              name: name,
              plan: data.plan || 'basico',
              timestamp: new Date().toISOString()
            });
            
            fs.writeFile(leadsFile, JSON.stringify(leads, null, 2), () => {
              console.log('✅ Lead saved:', email);
            });
          });
          
          // Respond with success - redirect to confirmation
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            url: '/payment',
            sessionId: 'session_' + Date.now(),
            success: true
          }));
          
        } catch(e) {
          console.error('❌ Error:', e.message);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid request' }));
        }
        return;
      }
    });
    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ WebPro Local running on port ${PORT}`);
});
