# Brevo Email Automation Setup

## Step 1: Create Account (FREE)
- Go to: https://www.brevo.com
- Sign up with email: [tu email]
- Confirm email
- Complete profile

## Step 2: Create Contact Lists

### List 1: Electricistas
```
Name: Electricistas_Leads
Segmentation: service = "electricista"
```

### List 2: Plomeros
```
Name: Plomeros_Leads
Segmentation: service = "plomero"
```

### List 3: Inmobiliarios
```
Name: Inmobiliarios_Leads
Segmentation: service = "inmobiliario"
```

## Step 3: Create Email Templates

Copy-paste content from EMAIL_TEMPLATES.md:

### Template 1: Welcome + Lead Magnet
```
Name: Email_1_Welcome
Subject: Tu checklist de [servicio] está listo ✓
Body: [Copy from EMAIL_TEMPLATES.md]
```

### Template 2: Value + Social Proof
```
Name: Email_2_Value
Subject: 3 errores que [profesionales] cometen SIN web
Body: [Copy from EMAIL_TEMPLATES.md]
```

### Template 3: Limited Offer
```
Name: Email_3_Offer
Subject: ⏰ Oferta 48h: -20% tu primer mes
Body: [Copy from EMAIL_TEMPLATES.md]
```

### Template 4: FOMO
```
Name: Email_4_FOMO
Subject: ❌ Tus competidores ya ganaron esta semana
Body: [Copy from EMAIL_TEMPLATES.md]
```

### Template 5: Win-back
```
Name: Email_5_Winback
Subject: Última oportunidad: €0 primer mes
Body: [Copy from EMAIL_TEMPLATES.md]
```

## Step 4: Setup Automation Flows

### Flow 1: Welcome Email
```
Trigger: Lead captured (new contact added)
Conditions: N/A
Wait: 0 minutes
Send: Email_1_Welcome
Next: Wait 3 days → Flow 2
```

### Flow 2: Value Email
```
Trigger: Email_1 opened OR 24h passed
Conditions: N/A
Wait: 3 days
Send: Email_2_Value
Next: If no open in 3 days → Flow 3
```

### Flow 3: Limited Offer
```
Trigger: Email_2 opened OR 7 days passed
Conditions: N/A
Wait: 0
Send: Email_3_Offer (limited 48h offer)
Next: Wait 7 days → Flow 4 if no conversion
```

### Flow 4: FOMO
```
Trigger: No conversion after 14 days
Conditions: payment_status = "unpaid"
Wait: 14 days
Send: Email_4_FOMO
Next: Wait 16 days → Flow 5
```

### Flow 5: Win-back
```
Trigger: No conversion after 30 days
Conditions: payment_status = "unpaid"
Wait: 30 days
Send: Email_5_Winback
Next: End (or unsubscribe)
```

## Step 5: Setup Webhook for Auto-sync

### In Brevo Dashboard:
```
Settings → Webhooks → Create
Event: "New contact added"
Endpoint: https://webpro-local.vercel.app/api/brevo-webhook
Method: POST
```

### What it does:
When new contact added in Brevo → Triggers automation flows

## Step 6: Configure Sender

```
Sender Name: WebPro Local
Sender Email: noreply@webprolocal.com [or your custom domain]
Reply-to: support@webprolocal.com
```

## Step 7: Test Flows

### Test Lead Capture:
1. Go to: https://webpro-local.vercel.app/electricista
2. Fill form with test email
3. Check Brevo: Contact should appear in list
4. Wait 1 minute
5. Check your email: Should receive Email_1_Welcome

### Test Email Delivery:
1. Check email spam folder
2. Confirm sender address
3. Check unsubscribe link works

## Step 8: Enable Sending

In Brevo Settings:
```
[ ] Email authentication verified
[ ] Sender verified
[ ] Unsubscribe page configured
[ ] Privacy policy linked
[ ] GDPR consent enabled
```

## KPIs to Monitor

### Email Performance
- Delivery rate: >95%
- Open rate: >30% (Email 1)
- Click rate: >5% (Email 2-3)
- Conversion rate: 3-5% (Email 3)

### Contact Health
- Bounce rate: <2%
- Complaint rate: <0.1%
- Unsubscribe rate: <1%

## Dashboard View

In Brevo, check:
- Contacts → Segmentation (by service)
- Campaigns → Performance (opens, clicks)
- Automations → Active flows status
- Reports → Daily metrics

## Costs

- Free tier: Up to 300 emails/day
- Upgrade: When hitting 20k contacts (still cheap: ~$20/month)

---

**Setup Time:** 30 minutes
**Go-live:** After Maikel enables Google Ads campaigns

Follow this exactly and reply with ✅ when done.
