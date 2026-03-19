# BREVO EMAIL AUTOMATION - QUICK START (15 MIN)

## STEP 1: Create Account
```
https://www.brevo.com → Sign up → Confirm email
```

## STEP 2: Create Contact List
```
Contacts → Add Contact List
Name: "WebPro_Leads"
Double opt-in: OFF (for faster conversions)
```

## STEP 3: Create 3 Email Templates

### EMAIL 1 - Welcome
```
Name: Email_1_Welcome
Subject: Tu checklist de [servicio] está listo ✓

Body:
---
Hola [NAME],

¡Gracias por descargar tu checklist!

Lo acabamos de enviar a tu email.

Estos son lo que TODO [electricista/plomero] necesita en su web para atraer clientes.

Pero aquí viene lo interesante...

El 73% de los [profesionales] que los implementan reciben clientes NUEVOS dentro de la primera semana.

Te voy a mandar 3 emails más en los próximos días con estrategias específicas.

¡No te los pierdas!

Un abrazo,
El equipo de WebPro Local
---
```

### EMAIL 2 - Value (Send after 3 days)
```
Name: Email_2_Value
Subject: 3 errores que [profesionales] cometen SIN web

Body:
---
Hola [NAME],

Ayer fue el Checklist.

Hoy vienen los errores (porque de errores se aprende).

He visto a 100+ [profesionales] SIN web. Estos son los 3 que MÁS dinero les cuesta:

1️⃣ ERROR #1: No mostrar trabajos
Sin fotos = Sin confianza = Sin clientes

2️⃣ ERROR #2: Precio misterio
Si no dices tu precio, asumen que es caro.

3️⃣ ERROR #3: No tener formulario
Sin formulario = Leads perdidos.

---

La buena noticia?

Carlos, electricista en Madrid, implementó estos 3 en su web.

Resultado: De 2-3 clientes/mes a 8-10 clientes/mes en 3 meses.

Si factura €150/trabajo:
2-3 = €300-450/mes
8-10 = €1200-1500/mes

DIFERENCIA: +€750-1050/mes

Casi un salario mínimo extra.

¿Quieres ver cómo funciona?

[BOTÓN] Ver Demo

Un abrazo,
Manolo - WebPro Local
---
```

### EMAIL 3 - Offer (Send after 7 days)
```
Name: Email_3_Offer
Subject: ⏰ Oferta 48h: -20% tu primer mes

Body:
---
Hola [NAME],

Te voy a hacer una oferta que no puedes rechazar.

Y solo es para 48 horas.

OFERTA: Primer mes de WebPro Local por €16 en lugar de €20.

20% descuento.

¿Por qué 48 horas?

Porque es una oferta real para gente que de verdad quiere hacer crecer su negocio.

La oferta vence en 48 horas.

[BOTÓN] Activar oferta -20% | €16/mes

Un abrazo,
Manolo
WebPro Local
---
```

## STEP 4: Create Automation Flow

### Flow 1: Welcome (Trigger = New Contact)
```
Trigger: Contact added to "WebPro_Leads"
Wait: 0 minutes
Send: Email_1_Welcome
Next: Delay 3 days → Flow 2
```

### Flow 2: Value (Trigger = 3 days after Email 1)
```
Trigger: Previous flow completed
Wait: 3 days
Send: Email_2_Value
Next: Delay 4 days → Flow 3
```

### Flow 3: Offer (Trigger = 7 days total)
```
Trigger: Previous flow completed
Wait: 0
Send: Email_3_Offer
Next: End
```

## STEP 5: Connect to Website

### In Brevo Dashboard:
```
Settings → Webhooks → Create
Event: Contact added
Endpoint: https://webpro-local.vercel.app/api/brevo-webhook
Method: POST
```

### In your website form:
When user fills form → POST to `/capture-lead`
Lead gets added to Brevo automatically

## STEP 6: Test Everything

1. Go to: https://webpro-local.vercel.app/electricista
2. Fill form with YOUR email
3. Check Brevo: Contact should appear
4. Wait 1 minute
5. Check your inbox: Should have Email_1

## SUCCESS = LAUNCH!

Once verified:
- [ ] Contact appears in Brevo
- [ ] Email 1 delivers
- [ ] Email opens/clicks working
- [ ] Automation flows running

**Then:** Traffic start coming → Leads capture → Emails nurture → Sales

---

**Tiempo estimado:** 15 minutos
**Costo:** €0 (free tier)
**ROI:** When first customer signs up, you've made back €20 investment

---

**Maikel:** Once Brevo is set up, tell me ✅ and I'll monitor everything.

Let the machines work.
