# Google Analytics Setup - WebPro Local

## Quick Setup (5 minutes)

### Step 1: Create GA Property
```
Go to: https://analytics.google.com
Click: Create Property
Property name: WebPro Local
Website URL: https://webpro-local.vercel.app
Timezone: Europe/Madrid
```

### Step 2: Get Measurement ID
```
After creating property, you'll get:
Measurement ID: G-XXXXXXX

This is what goes in tracking code.
```

### Step 3: Add Tracking to Website

Add this to `<head>` of all HTML pages:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
  
  // Track form submissions
  function trackLead(service) {
    gtag('event', 'generate_lead', {
      'service': service,
      'timestamp': new Date().toISOString()
    });
  }
  
  // Track checkout
  function trackCheckout(email) {
    gtag('event', 'begin_checkout', {
      'email': email,
      'value': 20,
      'currency': 'EUR'
    });
  }
</script>
```

### Step 4: Monitor Key Metrics

In Google Analytics dashboard:
- **Real-time:** See visitors now
- **Acquisition:** Where traffic comes from
- **Behavior:** What pages they visit
- **Conversions:** Form submissions, checkouts

### Step 5: Create Custom Dashboard

Segments to track:
- Traffic by service (electricista, plomero, inmobiliario)
- Landing page performance
- Lead capture rate
- Email click-through rate

---

**Implementation:** Once you provide Measurement ID, I'll add tracking to all pages.

**Benefit:** Track everything happening in real-time → Optimize based on data.
