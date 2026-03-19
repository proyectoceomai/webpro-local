const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Stripe Test Mode Secret Key - USAR VARIABLE DE ENTORNO
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_DEMO_MODE';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && (pathname === '/' || pathname === '/electricista' || pathname === '/plomero' || pathname === '/inmobiliario' || pathname === '/blog' || pathname === '/monitoring')) {
    let htmlFile = 'index.html';
    if (pathname === '/electricista') htmlFile = 'electricista.html';
    else if (pathname === '/plomero') htmlFile = 'plomero.html';
    else if (pathname === '/inmobiliario') htmlFile = 'inmobiliario.html';
    else if (pathname === '/blog') htmlFile = 'blog.html';
    else if (pathname === '/monitoring') htmlFile = 'monitoring-dashboard.html';
    
    const filePath = path.join(__dirname, htmlFile);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  } else if (pathname === '/dashboard' && req.method === 'GET') {
    const dashboardPath = path.join(__dirname, 'dashboard.html');
    fs.readFile(dashboardPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  } else if (pathname === '/sitemap.xml' && req.method === 'GET') {
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    fs.readFile(sitemapPath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      if (err) {
        res.end('<?xml version="1.0"?><urlset></urlset>');
      } else {
        res.end(data);
      }
    });
    return;
  } else if (pathname === '/robots.txt' && req.method === 'GET') {
    const robotsPath = path.join(__dirname, 'robots.txt');
    fs.readFile(robotsPath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      if (err) {
        res.end('User-agent: *\nAllow: /');
      } else {
        res.end(data);
      }
    });
    return;
  } else if (pathname === '/api/leads' && req.method === 'GET') {
    const leadsFile = path.join(__dirname, 'leads.json');
    fs.readFile(leadsFile, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) {
        res.end(JSON.stringify([]));
      } else {
        res.end(data);
      }
    });
    return;
  } else if (pathname === '/capture-lead' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        // Guardar lead en archivo JSON
        const leadsFile = path.join(__dirname, 'leads.json');
        fs.readFile(leadsFile, (err, fileData) => {
          let leads = [];
          if (!err && fileData) {
            try {
              leads = JSON.parse(fileData);
            } catch(e) {
              leads = [];
            }
          }
          
          leads.push({
            ...data,
            timestamp: new Date().toISOString()
          });
          
          fs.writeFile(leadsFile, JSON.stringify(leads, null, 2), (err) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          });
        });
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid request');
      }
    });
    return;
  } else if (pathname === '/create-checkout-session' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Checkout requested for:', data);

        // Stripe API call to create checkout session
        const postData = JSON.stringify({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'WebPro Local - Plan Básico',
                description: 'Sitio web profesional para tu negocio'
              },
              unit_amount: 2000 // $20 en centavos
            },
            quantity: 1
          }],
          mode: 'subscription',
          success_url: 'https://webpro-local.vercel.app?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'https://webpro-local.vercel.app',
          customer_email: data.email || 'cliente@webpro.local'
        });

        const stripeReq = require('https').request(
          {
            hostname: 'api.stripe.com',
            path: '/v1/checkout/sessions',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + STRIPE_SECRET_KEY,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(postData)
            }
          },
          (stripeRes) => {
            let responseData = '';
            stripeRes.on('data', chunk => { responseData += chunk; });
            stripeRes.on('end', () => {
              try {
                const sessionData = JSON.parse(responseData);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  sessionId: sessionData.id,
                  url: sessionData.url
                }));
              } catch (e) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Stripe error: ' + e.message }));
              }
            });
          }
        );

        stripeReq.on('error', (e) => {
          console.error('Stripe API error:', e);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Stripe connection error' }));
        });

        stripeReq.write(postData);
        stripeReq.end();
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebPro Local server running on port ${PORT}`);
});
