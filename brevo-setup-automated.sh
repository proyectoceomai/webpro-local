#!/bin/bash

# Brevo Setup - Semi-automated
# Requires: API key from Brevo dashboard

echo "🚀 BREVO SETUP AUTOMATION"
echo "========================"
echo ""

# Check if BREVO_API_KEY is set
if [ -z "$BREVO_API_KEY" ]; then
  echo "⚠️  BREVO_API_KEY not found in environment"
  echo "Steps to get API key:"
  echo "1. Go to: https://www.brevo.com/login"
  echo "2. Create account OR Login"
  echo "3. Settings → API Keys → Create new key"
  echo "4. Export BREVO_API_KEY='your-key-here'"
  echo ""
  exit 1
fi

echo "✅ API Key detected"
echo ""

# STEP 1: Create Contact List
echo "📋 Creating contact list..."

CONTACT_LIST=$(curl -s -X POST https://api.brevo.com/v3/contacts/lists \
  -H "api-key: $BREVO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "WebPro_Leads",
    "folderId": 1,
    "description": "Leads from WebPro Local landing pages"
  }')

LIST_ID=$(echo "$CONTACT_LIST" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$LIST_ID" ]; then
  echo "❌ Error creating contact list"
  echo "Response: $CONTACT_LIST"
  exit 1
fi

echo "✅ Contact list created: $LIST_ID"
echo ""

# STEP 2: Create Email Templates
echo "📝 Creating email templates..."

# Template 1: Welcome
TEMPLATE_1=$(curl -s -X POST https://api.brevo.com/v3/smtp/templates \
  -H "api-key: $BREVO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Email_1_Welcome",
    "subject": "Tu checklist está listo ✓",
    "htmlContent": "<html><body><p>Hola {{params.NAME}},</p><p>¡Gracias por descargar tu checklist!</p><p>Implementa estos elementos en tu web y atrae más clientes.</p><p>Abrazo,<br>Manolo</p></body></html>",
    "sender": {"name": "WebPro Local", "email": "noreply@webprolocal.com"},
    "replyTo": "support@webprolocal.com"
  }')

TEMPLATE_1_ID=$(echo "$TEMPLATE_1" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$TEMPLATE_1_ID" ]; then
  echo "✅ Template 1 created: $TEMPLATE_1_ID"
else
  echo "⚠️  Template 1 error (may exist already)"
fi

echo ""

# STEP 3: Create Automation Flow
echo "🔄 Setting up automation flow..."

AUTOMATION=$(curl -s -X POST https://api.brevo.com/v3/marketing/automation \
  -H "api-key: $BREVO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "WebPro_Lead_Nurture",
    "enabled": true,
    "trigger": {
      "type": "contact_list",
      "listId": '$LIST_ID'
    }
  }')

echo "Automation setup response: $AUTOMATION"
echo ""

# STEP 4: Update Website Config
echo "📝 Creating Brevo config file..."

cat > /Users/maikelgonzalvesferreira/.openclaw/workspace/hyper-local-website-gen/.env.brevo << EOF
BREVO_API_KEY=$BREVO_API_KEY
BREVO_LIST_ID=$LIST_ID
BREVO_TEMPLATE_WELCOME=$TEMPLATE_1_ID
BREVO_SENDER_EMAIL=noreply@webprolocal.com
EOF

echo "✅ Config saved to .env.brevo"
echo ""

echo "🎉 BREVO SETUP COMPLETE"
echo "========================"
echo ""
echo "Next steps:"
echo "1. Verify templates in Brevo dashboard"
echo "2. Test lead capture form"
echo "3. Monitor contact list growth"
echo ""
