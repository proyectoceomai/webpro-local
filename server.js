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
          
          const leadData = {
            ...data,
            timestamp: new Date().toISOString()
          };
          
          leads.push(leadData);
          
          fs.writeFile(leadsFile, JSON.stringify(leads, null, 2), (err) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          });
          
          // Enviar a Brevo automáticamente
          if (process.env.BREVO_API_KEY) {
            const brevoPayload = JSON.stringify({
              email: data.email,
              attributes: {
                FIRSTNAME: data.name,
                SERVICE: data.service
              },
              listIds: [3]
            });
            
            const brevoReq = require('https').request(
              {
                hostname: 'api.brevo.com',
                path: '/v3/contacts',
                method: 'POST',
                headers: {
                  'api-key': process.env.BREVO_API_KEY,
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(brevoPayload)
                }
              },
              (brevoRes) => {
                // Log response but don't block
                console.log(`Lead ${data.email} sent to Brevo`);
              }
            );
            
            brevoReq.on('error', (e) => console.error('Brevo sync error:', e));
            brevoReq.write(brevoPayload);
            brevoReq.end();
          }
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
        const params = new URLSearchParams();
        params.append('payment_method_types[]', 'card');
        params.append('line_items[0][price_data][currency]', 'eur');
        params.append('line_items[0][price_data][product_data][name]', 'WebPro Local - Plan Básico');
        params.append('line_items[0][price_data][unit_amount]', '2000');
        params.append('line_items[0][quantity]', '1');
        params.append('mode', 'subscription');
        params.append('success_url', 'https://webpro-local.vercel.app');
        params.append('cancel_url', 'https://webpro-local.vercel.app');
        params.append('customer_email', data.email || 'test@webpro.local');
        
        const postData = params.toString();
        console.log('Stripe payload:', postData);

        const https = require('https');
        const stripeReq = https.request(
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
              console.log('Stripe response status:', stripeRes.statusCode);
              
              if (stripeRes.statusCode === 200) {
                try {
                  const sessionData = JSON.parse(responseData);
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    sessionId: sessionData.id,
                    url: sessionData.url
                  }));
                } catch (e) {
                  res.writeHead(500);
                  res.end(JSON.stringify({ error: 'Parse error: ' + e.message }));
                }
              } else {
                console.error('Stripe error:', responseData.substring(0, 300));
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Stripe API error' }));
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
