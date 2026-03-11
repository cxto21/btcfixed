#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# BTCFixed — Setup GitHub Secrets para CI/CD
# Ejecutar UNA sola vez desde tu máquina local con `gh` instalado
# Requiere: gh auth login  (GitHub CLI autenticado)
# ─────────────────────────────────────────────────────────────
set -e

REPO="cxto21/btcfixed"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   BTCFixed — GitHub Secrets Setup        ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── 1. Cloudflare ──────────────────────────────────────────
echo "▶ Configurando secrets de Cloudflare..."

gh secret set CLOUDFLARE_API_TOKEN \
  --repo "$REPO" \
  --body "8tvsNHaSG8U8ahYYnk310V-ZcUGieynVHs4r3Aeo"

gh secret set CLOUDFLARE_ACCOUNT_ID \
  --repo "$REPO" \
  --body "eb6e0c55ac7aa3c441500bb7ca73b9e3"

echo "✅ Cloudflare: OK"

# ── 2. Android Keystore ────────────────────────────────────
echo ""
echo "▶ Configurando secrets del keystore Android..."

# El keystore fue generado en el devcontainer y está en base64
KEYSTORE_B64=$(cat signing/btcfixed-release.keystore.b64)

gh secret set ANDROID_KEYSTORE_BASE64 \
  --repo "$REPO" \
  --body "$KEYSTORE_B64"

gh secret set ANDROID_KEYSTORE_PASSWORD \
  --repo "$REPO" \
  --body "btcfixed2026"

gh secret set ANDROID_KEY_ALIAS \
  --repo "$REPO" \
  --body "btcfixed-release"

gh secret set ANDROID_KEY_PASSWORD \
  --repo "$REPO" \
  --body "btcfixed2026"

echo "✅ Android Keystore: OK"

# ── 3. Google Play Service Account ────────────────────────
echo ""
echo "▶ Configurando Google Play Service Account..."
echo ""
echo "  ⚠️  Para este paso necesitás el archivo JSON de la Service Account."
echo "  Seguí estos pasos:"
echo ""
echo "  1. Ir a: https://play.google.com/console"
echo "  2. Setup → API access → Link to Google Cloud project"
echo "  3. En Google Cloud Console → IAM → Service Accounts"
echo "  4. Crear service account con rol 'Release Manager'"
echo "  5. Crear key → JSON → descargar el archivo"
echo "  6. En Play Console → Users → Invite → pegar el email de la SA"
echo "     Permisos: Release to testing tracks"
echo ""
echo "  Una vez tengas el archivo JSON, ejecutá:"
echo ""
echo "  gh secret set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON \\"
echo "    --repo $REPO \\"
echo "    --body-file /ruta/a/tu/service-account.json"
echo ""

# ── 4. Resumen ────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Secrets configurados:                  ║"
echo "║   ✅ CLOUDFLARE_API_TOKEN                ║"
echo "║   ✅ CLOUDFLARE_ACCOUNT_ID               ║"
echo "║   ✅ ANDROID_KEYSTORE_BASE64             ║"
echo "║   ✅ ANDROID_KEYSTORE_PASSWORD           ║"
echo "║   ✅ ANDROID_KEY_ALIAS                   ║"
echo "║   ✅ ANDROID_KEY_PASSWORD                ║"
echo "║   ⏳ GOOGLE_PLAY_SERVICE_ACCOUNT_JSON    ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Cuando tengas el JSON de Google Play, ejecutá el comando de arriba"
echo "y el próximo push a main desplegará automáticamente en Play Store."
echo ""
