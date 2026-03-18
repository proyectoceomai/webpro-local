# WebPro Local - MVP Landing Page

## 🎯 Proyecto
Servicio SaaS para generar sitios web profesionales para pequeños negocios locales (electricistas, plomeros, agentes inmobiliarios).

**Objetivo financiero:** $1M ARR en 18 meses
**Capital inicial:** $500 USD
**Presupuesto este mes:** $245 (infraestructura + marketing)

## 📁 Estructura del Proyecto

```
hyper-local-website-gen/
├── index.html          # Landing page estática + formulario
├── server.js           # Backend Node.js mínimo (Stripe webhook ready)
├── package.json        # Dependencias mínimas
├── vercel.json         # Config de deploy a Vercel
└── README.md           # Este archivo
```

## 🚀 Deploy

### Opción 1: Vercel (Recomendado)
```bash
npm install -g vercel
vercel login
vercel --prod
```

El sitio estará en `https://webpro-local.vercel.app` en 2 minutos.

### Opción 2: Local Testing
```bash
node server.js
# Abre http://localhost:3000
```

## 💳 Integración Stripe

**Estado actual:** Demo (sin credenciales reales)

Para habilitar pagos reales:
1. Crear cuenta en Stripe (stripe.com)
2. Obtener `Publishable Key` y `Secret Key`
3. Reemplazar en `index.html` (línea: `const stripe = Stripe(...)`)
4. Implementar backend real para crear sesiones de checkout

## 📊 MVP Funcionalidades

✅ Landing page profesional
✅ Formulario de captura de emails
✅ Selector de planes ($20/mes)
✅ Estructura backend para Stripe
✅ Mobile responsive
✅ Deploy ready en Vercel

## 🎯 Próximos Pasos (Post-MVP)

1. **Integración Stripe real** - Conectar pagos auténticos
2. **Dashboard de clientes** - Crear sitios desde panel admin
3. **Template builder** - 20+ plantillas por industria
4. **SEO local** - Optimización para "Electricista Madrid", etc.
5. **Analytics** - Tracking de leads y conversiones

## 📈 KPIs Seguimiento

- Visitantes únicos/semana
- Tasa de conversión (email signup)
- Plan seleccionado (básico vs premium)
- Costo de adquisición (CAC)

## 🔐 Seguridad

- No se almacenan credenciales en el código
- Variables de entorno para keys sensibles
- CORS configurado para Vercel

## 💰 Presupuesto Mes 1

| Concepto | Costo |
|----------|-------|
| Dominio (.com) | $12 |
| Vercel hosting | $0 (free tier) |
| Google Ads inicial | $50 |
| Facebook Ads test | $30 |
| Buffer Stripe fees | $20 |
| **TOTAL** | **$112** |

Presupuesto disponible: $500
Restante: $388 para mes 2

---
**Proyecto iniciado:** 18 de Marzo 2026
**Status:** MVP en desarrollo activo
**CEO:** Manolo
